import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Profile, { IProfile } from '@/models/Profile';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const profile = await Profile.findOne({ userId: session.user.id });

    if (!profile) {
      return NextResponse.json({
        currentStep: 1,
        completedSteps: [],
        totalSteps: 6,
        isComplete: false,
      });
    }

    const completedSteps = calculateCompletedSteps(profile);
    const currentStep = completedSteps.length + 1;
    const isComplete = completedSteps.length >= 6;

    return NextResponse.json({
      currentStep: isComplete ? 6 : currentStep,
      completedSteps,
      totalSteps: 6,
      isComplete,
      profile: profile,
    });
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateCompletedSteps(profile: IProfile): number[] {
  const completedSteps = [];
  
  // Step 1: Basic Information
  if (isBasicInfoComplete(profile)) {
    completedSteps.push(1);
  }

  // Step 2: Location
  if (isLocationComplete(profile)) {
    completedSteps.push(2);
  }

  // Step 3: Religion & Community
  if (isReligionComplete(profile)) {
    completedSteps.push(3);
  }

  // Step 4: Education & Profession
  if (isEducationComplete(profile)) {
    completedSteps.push(4);
  }

  // Step 5: Lifestyle & Personal Info
  if (isLifestyleComplete(profile)) {
    completedSteps.push(5);
  }

  // Step 6: Partner Preferences
  if (isPartnerPreferencesComplete(profile)) {
    completedSteps.push(6);
  }

  return completedSteps;
}

function isBasicInfoComplete(profile: IProfile): boolean {
  return !!(profile.firstName && profile.lastName && profile.dateOfBirth && 
         profile.gender && profile.height && profile.maritalStatus);
}

function isLocationComplete(profile: IProfile): boolean {
  return !!(profile.country && profile.state && profile.city);
}

function isReligionComplete(profile: IProfile): boolean {
  return !!(profile.religion && profile.community);
}

function isEducationComplete(profile: IProfile): boolean {
  return !!(profile.education && profile.profession);
}

function isLifestyleComplete(profile: IProfile): boolean {
  return !!(profile.diet && profile.smoking && profile.drinking && 
         profile.aboutMe && profile.interests && profile.interests.length > 0);
}

function isPartnerPreferencesComplete(profile: IProfile): boolean {
  return !!(profile.partnerPreferences?.ageRange && 
         profile.partnerPreferences?.heightRange &&
         profile.partnerPreferences?.religions &&
         profile.partnerPreferences.religions.length > 0);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { step, data } = await request.json();

    if (!step || !data) {
      return NextResponse.json(
        { error: 'Step and data are required' },
        { status: 400 }
      );
    }

    // Find or create profile
    let profile = await Profile.findOne({ userId: session.user.id });
    
    if (!profile) {
      profile = new Profile({
        userId: session.user.id,
        completenessScore: 0,
        partnerPreferences: {
          ageRange: { min: 21, max: 35 },
          heightRange: { min: 150, max: 180 },
          maritalStatus: [],
          religions: [],
          communities: [],
          education: [],
          professions: [],
          locations: [],
        },
        privacy: {
          showProfile: true,
          showPhotos: 'all',
          showContact: 'mutual_interest',
          allowMessages: true,
        },
        verification: {
          email: false,
          phone: false,
          governmentId: false,
          education: false,
          profession: false,
        },
      });
    }

    // Update profile based on step
    switch (step) {
      case 1: // Basic Information
        Object.assign(profile, {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          height: data.height,
          maritalStatus: data.maritalStatus,
          hasChildren: data.hasChildren || false,
          languages: data.languages || [],
        });
        break;

      case 2: // Location
        Object.assign(profile, {
          country: data.country,
          state: data.state,
          city: data.city,
        });
        break;

      case 3: // Religion & Community
        Object.assign(profile, {
          religion: data.religion,
          community: data.community,
          subCommunity: data.subCommunity,
        });
        break;

      case 4: // Education & Profession
        Object.assign(profile, {
          education: data.education,
          educationDetails: data.educationDetails,
          profession: data.profession,
          professionDetails: data.professionDetails,
          annualIncome: data.annualIncome,
          currency: data.currency || 'USD',
        });
        break;

      case 5: // Lifestyle & Personal Info
        Object.assign(profile, {
          diet: data.diet,
          smoking: data.smoking,
          drinking: data.drinking,
          aboutMe: data.aboutMe,
          interests: data.interests || [],
        });
        break;

      case 6: // Partner Preferences
        profile.partnerPreferences = {
          ageRange: data.ageRange || { min: 21, max: 35 },
          heightRange: data.heightRange || { min: 150, max: 180 },
          maritalStatus: data.maritalStatus || [],
          religions: data.religions || [],
          communities: data.communities || [],
          education: data.education || [],
          professions: data.professions || [],
          locations: data.locations || [],
          diet: data.diet,
          smoking: data.smoking,
          drinking: data.drinking,
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid step' },
          { status: 400 }
        );
    }

    // Calculate completeness score
    profile.completenessScore = calculateCompletenessScore(profile);
    profile.lastActiveAt = new Date();

    await profile.save();

    return NextResponse.json({
      success: true,
      message: `Step ${step} completed successfully`,
      completenessScore: profile.completenessScore,
    });
  } catch (error) {
    console.error('Error saving onboarding step:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateCompletenessScore(profile: IProfile): number {
  const scoreComponents = {
    basicInfo: calculateBasicInfoScore(profile),
    location: calculateLocationScore(profile),
    religion: calculateReligionScore(profile),
    education: calculateEducationScore(profile),
    lifestyle: calculateLifestyleScore(profile),
    photos: calculatePhotosScore(profile),
    preferences: calculatePreferencesScore(profile),
  };

  const totalScore = Object.values(scoreComponents).reduce((sum, score) => sum + score, 0);
  return Math.min(totalScore, 100);
}

function calculateBasicInfoScore(profile: IProfile): number {
  let score = 0;
  if (profile.firstName) score += 3;
  if (profile.lastName) score += 3;
  if (profile.dateOfBirth) score += 3;
  if (profile.gender) score += 3;
  if (profile.height) score += 3;
  if (profile.maritalStatus) score += 3;
  if (profile.languages?.length > 0) score += 7;
  return score;
}

function calculateLocationScore(profile: IProfile): number {
  let score = 0;
  if (profile.country) score += 5;
  if (profile.state) score += 5;
  if (profile.city) score += 5;
  return score;
}

function calculateReligionScore(profile: IProfile): number {
  let score = 0;
  if (profile.religion) score += 5;
  if (profile.community) score += 5;
  return score;
}

function calculateEducationScore(profile: IProfile): number {
  let score = 0;
  if (profile.education) score += 5;
  if (profile.profession) score += 5;
  if (profile.educationDetails) score += 3;
  if (profile.professionDetails) score += 3;
  if (profile.annualIncome) score += 4;
  return score;
}

function calculateLifestyleScore(profile: IProfile): number {
  let score = 0;
  if (profile.diet) score += 2;
  if (profile.smoking) score += 2;
  if (profile.drinking) score += 2;
  if (profile.aboutMe && profile.aboutMe.length >= 100) score += 5;
  if (profile.interests?.length >= 3) score += 4;
  return score;
}

function calculatePhotosScore(profile: IProfile): number {
  const photoCount = profile.photos?.length || 0;
  return Math.min(photoCount * 2, 10);
}

function calculatePreferencesScore(profile: IProfile): number {
  if (profile.partnerPreferences?.religions?.length > 0) {
    return 5;
  }
  return 0;
}
