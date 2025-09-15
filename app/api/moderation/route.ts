import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ModerationQueue from '@/models/ModerationQueue';
import ModerationRule, { IModerationRule } from '@/models/ModerationRule';
import Profile from '@/models/Profile';
import { Message } from '@/models/Chat';
import dbConnect from '@/lib/db';

// GET /api/moderation - Get moderation queue items
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const contentType = searchParams.get('contentType');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = { status };
    if (contentType && contentType !== 'all') {
      query.contentType = contentType;
    }
    if (priority) {
      query.priority = { $gte: parseInt(priority) };
    }

    // Get total count for pagination
    const total = await ModerationQueue.countDocuments(query);

    // Get moderation items with populated user data
    const moderationItems = await ModerationQueue.find(query)
      .populate('userId', 'name email profilePicture')
      .populate('reviewedBy', 'name email')
      .sort({ priority: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get statistics
    const stats = await ModerationQueue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, flagged: 0 });

    return NextResponse.json({
      items: moderationItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: statusStats
    });

  } catch (error) {
    console.error('Error fetching moderation queue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/moderation - Submit content for moderation
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contentType, contentId, content, metadata } = body;

    if (!contentType || !contentId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType, contentId, content' },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = ['profile', 'message', 'photo', 'success_story'];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Check if content already exists in moderation queue
    const existingItem = await ModerationQueue.findOne({
      contentId,
      contentType,
      status: { $in: ['pending', 'flagged'] }
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Content is already under moderation' },
        { status: 409 }
      );
    }

    // Apply moderation rules
    const moderationResult = await applyModerationRules(content, contentType);

    // Determine initial status and priority
    let initialStatus = 'pending';
    let priority = 1;

    if (moderationResult.action === 'approve') {
      initialStatus = 'approved';
    } else if (moderationResult.action === 'reject') {
      initialStatus = 'rejected';
    } else if (moderationResult.action === 'flag') {
      initialStatus = 'flagged';
      priority = 5;
    }

    // Create moderation queue item
    const moderationItem = new ModerationQueue({
      userId: session.user.id,
      contentType,
      contentId,
      content,
      status: initialStatus,
      priority,
      violations: moderationResult.violations,
      metadata,
      aiAnalysis: moderationResult.aiAnalysis,
    });

    await moderationItem.save();

    // If auto-approved, update the original content
    if (initialStatus === 'approved') {
      await updateOriginalContent(contentType, contentId, 'approved');
    }

    return NextResponse.json({
      success: true,
      item: moderationItem,
      autoAction: initialStatus
    });

  } catch (error) {
    console.error('Error submitting content for moderation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to apply moderation rules
async function applyModerationRules(content: string, contentType: string) {
  const rules = await ModerationRule.find({
    contentType: { $in: [contentType, 'all'] },
    isActive: true
  }).sort({ priority: -1 });

  const violations: Array<{
    ruleId: string;
    ruleName: string;
    severity: string;
    action: string;
  }> = [];
  let highestSeverityAction = 'review';
  const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };

  for (const rule of rules) {
    const ruleViolation = checkRuleViolation(rule, content);
    if (ruleViolation) {
      violations.push({
        ruleId: rule._id,
        ruleName: rule.name,
        severity: rule.severity,
        action: rule.action
      });

      // Update highest severity action
      highestSeverityAction = getHighestSeverityAction(
        highestSeverityAction,
        rule.action,
        rule.severity,
        severityLevels
      );
    }
  }

  return {
    action: highestSeverityAction,
    violations,
    aiAnalysis: null // Placeholder for future AI integration
  };
}

// Helper function to check if a rule is violated
function checkRuleViolation(rule: IModerationRule, content: string): boolean {
  switch (rule.type) {
    case 'keyword':
      return checkKeywordViolation(rule, content);
    case 'pattern':
      return checkPatternViolation(rule, content);
    case 'content_length':
      return checkContentLengthViolation(rule, content);
    default:
      return false;
  }
}

// Check keyword-based violations
function checkKeywordViolation(rule: IModerationRule, content: string): boolean {
  if (!rule.keywords?.length) return false;

  const contentToCheck = rule.caseSensitive ? content : content.toLowerCase();
  return rule.keywords.some((keyword: string) =>
    contentToCheck.includes(rule.caseSensitive ? keyword : keyword.toLowerCase())
  );
}

// Check pattern-based violations
function checkPatternViolation(rule: IModerationRule, content: string): boolean {
  if (!rule.patterns?.length) return false;

  return rule.patterns.some((pattern: string) => {
    try {
      const regex = new RegExp(pattern, rule.caseSensitive ? 'g' : 'gi');
      return regex.test(content);
    } catch {
      return false;
    }
  });
}

// Check content length violations
function checkContentLengthViolation(rule: IModerationRule, content: string): boolean {
  if (!rule.contentLength) return false;

  const contentLength = content.length;
  const { minLength, maxLength } = rule.contentLength;

  if (minLength && contentLength < minLength) return true;
  if (maxLength && contentLength > maxLength) return true;

  return false;
}

// Determine highest severity action
function getHighestSeverityAction(
  currentAction: string,
  newAction: string,
  newSeverity: string,
  severityLevels: Record<string, number>
): string {
  const currentLevel = severityLevels[currentAction] || 0;
  const newLevel = severityLevels[newSeverity] || 0;

  if (newLevel > currentLevel || (newLevel === currentLevel && newAction === 'reject')) {
    return newAction;
  }

  return currentAction;
}

// Helper function to update original content after moderation
async function updateOriginalContent(contentType: string, contentId: string, status: string) {
  try {
    switch (contentType) {
      case 'profile':
        await Profile.findByIdAndUpdate(contentId, {
          moderationStatus: status,
          moderatedAt: new Date()
        });
        break;

      case 'message':
        await Message.findByIdAndUpdate(contentId, {
          moderationStatus: status,
          moderatedAt: new Date()
        });
        break;

      // Add cases for photo and success_story when those models are implemented
    }
  } catch (error) {
    console.error('Error updating original content:', error);
  }
}
