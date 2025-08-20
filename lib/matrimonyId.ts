import User from '@/models/User';
import Profile from '@/models/Profile';

/**
 * Generates a random matrimony ID with format: ABC12345
 * First 3 characters are alphabets, remaining 5 are digits
 */
function generateMatrimonyId(): string {
  // Generate 3 random uppercase letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 5 random digits
  for (let i = 0; i < 5; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  
  return result;
}

/**
 * Generates a unique matrimony ID by checking against existing IDs in the database
 */
export async function generateUniqueMatrimonyId(): Promise<string> {
  let matrimonyId: string;
  let isUnique = false;
  
  while (!isUnique) {
    matrimonyId = generateMatrimonyId();
    
    // Check if this ID already exists in User or Profile collections
    const existingUser = await User.findOne({ matrimonyId });
    const existingProfile = await Profile.findOne({ matrimonyId });
    
    if (!existingUser && !existingProfile) {
      isUnique = true;
    }
  }
  
  return matrimonyId!;
}

/**
 * Validates matrimony ID format
 */
export function validateMatrimonyId(matrimonyId: string): boolean {
  const regex = /^[A-Z]{3}\d{5}$/;
  return regex.test(matrimonyId);
}
