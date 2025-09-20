import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrivacyComplianceService } from '@/lib/privacy/compliance';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const privacyReport = await PrivacyComplianceService.getPrivacyReport(session.user.id);

    return NextResponse.json({
      success: true,
      data: privacyReport,
    });
  } catch (error) {
    console.error('Privacy report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate privacy report' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'update_settings':
        await PrivacyComplianceService.updatePrivacySettings(session.user.id, data.settings);
        return NextResponse.json({ success: true, message: 'Privacy settings updated' });

      case 'record_consent':
        await PrivacyComplianceService.recordConsentDecision(
          session.user.id,
          data.consentType,
          data.granted
        );
        return NextResponse.json({ success: true, message: 'Consent recorded' });

      case 'request_deletion': {
        const deletionRequest = await PrivacyComplianceService.requestAccountDeletion(
          session.user.id,
          data.deletionType,
          data.reason
        );
        return NextResponse.json({ 
          success: true, 
          message: 'Deletion request submitted',
          requestId: deletionRequest.userId,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Privacy action error:', error);
    return NextResponse.json(
      { error: 'Failed to process privacy request' },
      { status: 500 }
    );
  }
}
