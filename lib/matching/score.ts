import type { IProfile } from '@/models/Profile';

interface MatchScore {
  score: number;
  reasons: string[];
  breakdown: {
    age: number;
    location: number;
    education: number;
    religion: number;
    lifestyle: number;
    preferences: number;
  };
}

export class MatchingService {
  /**
   * Calculate compatibility score between two profiles
   */
  static calculateCompatibilityScore(
    userProfile: IProfile,
    candidateProfile: IProfile
  ): MatchScore {
    const breakdown = {
      age: this.calculateAgeCompatibility(userProfile, candidateProfile),
      location: this.calculateLocationCompatibility(userProfile, candidateProfile),
      education: this.calculateEducationCompatibility(userProfile, candidateProfile),
      religion: this.calculateReligionCompatibility(userProfile, candidateProfile),
      lifestyle: this.calculateLifestyleCompatibility(userProfile, candidateProfile),
      preferences: this.calculatePreferenceMatch(userProfile, candidateProfile),
    };

    // Weighted average
    const weights = {
      age: 0.15,
      location: 0.20,
      education: 0.15,
      religion: 0.25,
      lifestyle: 0.10,
      preferences: 0.15,
    };

    const score = Math.round(
      breakdown.age * weights.age +
      breakdown.location * weights.location +
      breakdown.education * weights.education +
      breakdown.religion * weights.religion +
      breakdown.lifestyle * weights.lifestyle +
      breakdown.preferences * weights.preferences
    );

    const reasons = this.generateMatchReasons(breakdown, userProfile, candidateProfile);

    return {
      score: Math.max(0, Math.min(100, score)), // Clamp between 0-100
      reasons,
      breakdown,
    };
  }

  private static calculateAgeCompatibility(
    userProfile: IProfile,
    candidateProfile: IProfile
  ): number {
    const userAge = this.getAge(userProfile.dateOfBirth);
    const candidateAge = this.getAge(candidateProfile.dateOfBirth);
    
    // Check if candidate falls within user's preferred age range
    const { min: minAge, max: maxAge } = userProfile.partnerPreferences.ageRange;
    
    if (candidateAge >= minAge && candidateAge <= maxAge) {
      // Perfect match if within range
      const ageGap = Math.abs(userAge - candidateAge);
      return Math.max(70, 100 - (ageGap * 2)); // Reduce score by age gap
    }
    
    // Partial score if slightly outside range
    const deviation = Math.min(
      Math.abs(candidateAge - minAge),
      Math.abs(candidateAge - maxAge)
    );
    
    return Math.max(0, 70 - (deviation * 10));
  }

  private static calculateLocationCompatibility(
    userProfile: IProfile,
    candidateProfile: IProfile
  ): number {
    // Same city = 100
    if (userProfile.city === candidateProfile.city) {
      return 100;
    }
    
    // Same state = 80
    if (userProfile.state === candidateProfile.state) {
      return 80;
    }
    
    // Same country = 60
    if (userProfile.country === candidateProfile.country) {
      return 60;
    }
    
    // Different country = 30
    return 30;
  }

  private static calculateEducationCompatibility(
    userProfile: IProfile,
    candidateProfile: IProfile
  ): number {
    // Define education levels for comparison
    const educationLevels: Record<string, number> = {
      'high_school': 1,
      'diploma': 2,
      'bachelors': 3,
      'masters': 4,
      'phd': 5,
      'professional': 4,
    };

    const userLevel = educationLevels[userProfile.education.toLowerCase()] || 3;
    const candidateLevel = educationLevels[candidateProfile.education.toLowerCase()] || 3;
    
    const levelDiff = Math.abs(userLevel - candidateLevel);
    
    // Perfect match for same level
    if (levelDiff === 0) return 100;
    
    // Good match for 1 level difference
    if (levelDiff === 1) return 85;
    
    // Moderate match for 2 level difference
    if (levelDiff === 2) return 70;
    
    // Lower compatibility for larger differences
    return Math.max(50, 70 - (levelDiff * 10));
  }

  private static calculateReligionCompatibility(
    userProfile: IProfile,
    candidateProfile: IProfile
  ): number {
    // Same religion and community = 100
    if (userProfile.religion === candidateProfile.religion &&
        userProfile.community === candidateProfile.community) {
      return 100;
    }
    
    // Same religion, different community = 80
    if (userProfile.religion === candidateProfile.religion) {
      return 80;
    }
    
    // Different religion = 40 (unless specifically looking for interfaith)
    return 40;
  }

  private static calculateLifestyleCompatibility(
    userProfile: IProfile,
    candidateProfile: IProfile
  ): number {
    let score = 100;
    
    // Diet compatibility
    if (userProfile.diet !== candidateProfile.diet) {
      // Vegetarian/vegan vs non-vegetarian is a bigger mismatch
      if ((userProfile.diet === 'vegetarian' || userProfile.diet === 'vegan') &&
          candidateProfile.diet === 'non_vegetarian') {
        score -= 30;
      } else {
        score -= 15;
      }
    }
    
    // Smoking compatibility
    if (userProfile.smoking !== candidateProfile.smoking) {
      score -= 15;
    }
    
    // Drinking compatibility
    if (userProfile.drinking !== candidateProfile.drinking) {
      score -= 15;
    }
    
    return Math.max(0, score);
  }

  private static calculatePreferenceMatch(
    userProfile: IProfile,
    candidateProfile: IProfile
  ): number {
    let score = 0;
    let totalChecks = 0;

    // Check if candidate matches user's preferences
    const prefs = userProfile.partnerPreferences;

    // Height preference
    if (candidateProfile.height >= prefs.heightRange.min &&
        candidateProfile.height <= prefs.heightRange.max) {
      score += 25;
    }
    totalChecks += 25;

    // Marital status preference
    if (prefs.maritalStatus.includes(candidateProfile.maritalStatus)) {
      score += 25;
    }
    totalChecks += 25;

    // Religion preference
    if (prefs.religions.includes(candidateProfile.religion)) {
      score += 25;
    }
    totalChecks += 25;

    // Location preference
    const locationMatch = prefs.locations.some(loc => 
      candidateProfile.city.includes(loc) ||
      candidateProfile.state.includes(loc) ||
      candidateProfile.country.includes(loc)
    );
    if (locationMatch) {
      score += 25;
    }
    totalChecks += 25;

    return totalChecks > 0 ? Math.round((score / totalChecks) * 100) : 50;
  }

  private static generateMatchReasons(
    breakdown: MatchScore['breakdown'],
    userProfile: IProfile,
    candidateProfile: IProfile
  ): string[] {
    const reasons: string[] = [];

    if (breakdown.religion >= 80) {
      reasons.push(`Same ${candidateProfile.religion} community`);
    }

    if (breakdown.location >= 80) {
      if (userProfile.city === candidateProfile.city) {
        reasons.push(`Both from ${candidateProfile.city}`);
      } else {
        reasons.push(`Both from ${candidateProfile.state}`);
      }
    }

    if (breakdown.education >= 85) {
      reasons.push('Similar education background');
    }

    if (breakdown.age >= 80) {
      reasons.push('Compatible age range');
    }

    if (breakdown.lifestyle >= 80) {
      reasons.push('Similar lifestyle preferences');
    }

    if (breakdown.preferences >= 80) {
      reasons.push('Matches your preferences');
    }

    // Add profession match if same
    if (userProfile.profession === candidateProfile.profession) {
      reasons.push(`Both in ${candidateProfile.profession}`);
    }

    return reasons.slice(0, 3); // Return top 3 reasons
  }

  private static getAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Get daily matches for a user
   */
  static async getDailyMatches(): Promise<unknown[]> {
    // TODO: Implement actual matching logic with database queries
    // This is a placeholder that would:
    // 1. Get user's profile and preferences
    // 2. Find potential matches based on filters
    // 3. Calculate compatibility scores
    // 4. Return top matches sorted by score
    return [];
  }

  /**
   * Generate match explanation for display
   */
  static generateMatchExplanation(matchScore: MatchScore): string {
    const { score, reasons } = matchScore;
    
    if (score >= 90) {
      return `Excellent match (${score}%) - ${reasons.join(', ')}`;
    } else if (score >= 80) {
      return `Great match (${score}%) - ${reasons.join(', ')}`;
    } else if (score >= 70) {
      return `Good match (${score}%) - ${reasons.join(', ')}`;
    } else if (score >= 60) {
      return `Moderate match (${score}%) - ${reasons.join(', ')}`;
    } else {
      return `Low match (${score}%) - Limited compatibility`;
    }
  }
}
