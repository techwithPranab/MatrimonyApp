interface AIProvider {
  generateText(prompt: string): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
  moderateContent(text: string): Promise<ModerationResult>;
}

interface ModerationResult {
  flagged: boolean;
  categories: string[];
  confidence: number;
}

interface GenerateProfileSummaryOptions {
  profile: {
    firstName: string;
    profession: string;
    education: string;
    interests: string[];
    aboutMe?: string;
    city: string;
  };
  maxLength?: number;
}

interface GenerateIceBreakerOptions {
  userProfile: {
    firstName: string;
    interests: string[];
    profession: string;
  };
  candidateProfile: {
    firstName: string;
    interests: string[];
    profession: string;
    education: string;
  };
  commonInterests: string[];
}

export class AIService {
  private readonly provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  /**
   * Generate a compelling profile summary
   */
  async generateProfileSummary(options: GenerateProfileSummaryOptions): Promise<string> {
    const { profile, maxLength = 200 } = options;
    
    const prompt = `Generate a warm, engaging matrimony profile summary for ${profile.firstName}:
    
Profile Details:
- Name: ${profile.firstName}
- Profession: ${profile.profession}
- Education: ${profile.education}
- City: ${profile.city}
- Interests: ${profile.interests.join(', ')}
${profile.aboutMe ? `- About: ${profile.aboutMe}` : ''}

Requirements:
- Keep it under ${maxLength} characters
- Make it warm and personable
- Highlight positive qualities
- Avoid clichés
- Use third person
- Be culturally appropriate for Indian matrimony

Generate a compelling summary:`;

    try {
      const summary = await this.provider.generateText(prompt);
      return summary.slice(0, maxLength);
    } catch (error) {
      console.error('Error generating profile summary:', error);
      return this.getFallbackSummary(profile);
    }
  }

  /**
   * Generate ice breaker messages for starting conversations
   */
  async suggestIceBreakers(options: GenerateIceBreakerOptions): Promise<string[]> {
    const { userProfile, candidateProfile, commonInterests } = options;
    
    const prompt = `Generate 3 natural, respectful conversation starters for ${userProfile.firstName} to message ${candidateProfile.firstName} on a matrimony platform:

Context:
- ${userProfile.firstName} works in ${userProfile.profession}
- ${candidateProfile.firstName} works in ${candidateProfile.profession} and studied ${candidateProfile.education}
- Common interests: ${commonInterests.join(', ') || 'None identified'}
- User interests: ${userProfile.interests.join(', ')}
- Candidate interests: ${candidateProfile.interests.join(', ')}

Requirements:
- Keep messages under 100 characters each
- Be respectful and culturally appropriate
- Mention shared interests or background when possible
- Avoid pickup lines or overly casual language
- Focus on genuine conversation starters

Generate 3 ice breaker messages:`;

    try {
      const response = await this.provider.generateText(prompt);
      // Parse the response to extract individual messages
      const messages = response
        .split('\n')
        .filter(line => line.trim() && !line.includes(':'))
        .map(msg => msg.replace(/^\d+\.?\s*/, '').trim())
        .slice(0, 3);
      
      return messages.length >= 3 ? messages : this.getFallbackIceBreakers(userProfile, candidateProfile);
    } catch (error) {
      console.error('Error generating ice breakers:', error);
      return this.getFallbackIceBreakers(userProfile, candidateProfile);
    }
  }

  /**
   * Moderate text content for inappropriate material
   */
  async moderateText(text: string): Promise<ModerationResult> {
    try {
      return await this.provider.moderateContent(text);
    } catch (error) {
      console.error('Error moderating content:', error);
      // Fallback to basic keyword filtering
      return this.basicContentModeration(text);
    }
  }

  /**
   * Generate profile headline suggestions
   */
  async generateHeadlines(profile: { profession: string; interests: string[]; personality?: string }): Promise<string[]> {
    const prompt = `Generate 5 catchy, professional matrimony profile headlines for someone who:
- Works in ${profile.profession}
- Interests: ${profile.interests.join(', ')}
${profile.personality ? `- Personality: ${profile.personality}` : ''}

Requirements:
- Keep under 60 characters each
- Be positive and attractive
- Avoid clichés like "simple and decent"
- Make them unique and memorable
- Be culturally appropriate

Generate 5 headlines:`;

    try {
      const response = await this.provider.generateText(prompt);
      const headlines = response
        .split('\n')
        .filter(line => line.trim() && !line.includes(':'))
        .map(headline => headline.replace(/^\d+\.?\s*/, '').trim())
        .slice(0, 5);
      
      return headlines.length >= 3 ? headlines : this.getFallbackHeadlines(profile);
    } catch (error) {
      console.error('Error generating headlines:', error);
      return this.getFallbackHeadlines(profile);
    }
  }

  /**
   * Generate embeddings for profile text for similarity matching
   */
  async generateProfileEmbedding(profileText: string): Promise<number[]> {
    try {
      return await this.provider.generateEmbedding(profileText);
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return a zero vector as fallback
      return new Array(384).fill(0);
    }
  }

  // Fallback methods for when AI service is unavailable
  private getFallbackSummary(profile: GenerateProfileSummaryOptions['profile']): string {
    return `${profile.firstName} is a ${profile.profession} based in ${profile.city}. ${
      profile.interests.length > 0 
        ? `Passionate about ${profile.interests.slice(0, 2).join(' and ')}.` 
        : ''
    } Looking for a life partner who shares similar values and interests.`;
  }

  private getFallbackIceBreakers(
    userProfile: GenerateIceBreakerOptions['userProfile'], 
    candidateProfile: GenerateIceBreakerOptions['candidateProfile']
  ): string[] {
    return [
      `Hi ${candidateProfile.firstName}! I noticed we both work in similar fields. Would love to connect!`,
      `Hello! Your profile caught my attention. Would you like to have a conversation?`,
      `Hi there! I'd be interested to know more about you. Hope to hear from you soon!`
    ];
  }

  private getFallbackHeadlines(profile: { profession: string; interests: string[] }): string[] {
    return [
      `${profile.profession} seeking meaningful connection`,
      `Passionate about ${profile.interests[0] || 'life'} and new experiences`,
      `Looking for a partner to share life's beautiful journey`,
      `Professional with traditional values`,
      `Ready for the next chapter of life`
    ];
  }

  private basicContentModeration(text: string): ModerationResult {
    const inappropriateKeywords = [
      'inappropriate', 'offensive', 'spam', 'scam', 'fake',
      'money', 'cash', 'loan', 'investment', 'business opportunity'
    ];
    
    const lowerText = text.toLowerCase();
    const flaggedKeywords = inappropriateKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );
    
    return {
      flagged: flaggedKeywords.length > 0,
      categories: flaggedKeywords.length > 0 ? ['spam', 'inappropriate'] : [],
      confidence: flaggedKeywords.length > 0 ? 0.8 : 0.1
    };
  }
}

// OpenAI-compatible provider implementation
export class OpenAIProvider implements AIProvider {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async generateText(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0]?.embedding || [];
  }

  async moderateContent(text: string): Promise<ModerationResult> {
    const response = await fetch(`${this.baseURL}/moderations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.results[0];
    
    const scores = Object.values(result.category_scores).filter((score): score is number => typeof score === 'number');
    
    return {
      flagged: result.flagged,
      categories: Object.keys(result.categories).filter(key => result.categories[key]),
      confidence: scores.length > 0 ? Math.max(...scores) : 0,
    };
  }
}

// Factory function to create AI service instance
export function createAIService(): AIService {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
  
  if (!apiKey) {
    console.warn('AI_API_KEY not provided, AI features will use fallbacks');
    // Return a mock provider that always uses fallbacks
    const mockProvider: AIProvider = {
      generateText: async () => { throw new Error('No API key'); },
      generateEmbedding: async () => { throw new Error('No API key'); },
      moderateContent: async () => { throw new Error('No API key'); },
    };
    return new AIService(mockProvider);
  }

  const provider = new OpenAIProvider(apiKey, apiUrl);
  return new AIService(provider);
}
