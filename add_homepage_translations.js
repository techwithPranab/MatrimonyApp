const fs = require('fs');
const path = require('path');

const homePageSection = {
  "HomePage": {
    "welcomeTitle": "Find Your Perfect Life Partner",
    "welcomeSubtitle": "India's most trusted matrimony platform with millions of verified profiles",
    "getStarted": "Get Started",
    "howItWorks": "How It Works",
    "createProfile": "Create Profile",
    "findMatches": "Find Matches",
    "connectChat": "Connect & Chat",
    "successStories": "Success Stories",
    "trustedBy": "Trusted by millions",
    "verifiedProfiles": "Verified Profiles",
    "privateSafe": "Private & Safe",
    "freeToJoin": "Free to Join"
  },
  "Navigation": {
    "home": "Home",
    "login": "Login",
    "signup": "Sign Up"
  }
};

const languages = ['ta', 'te', 'mr', 'gu', 'kn', 'pa', 'or', 'as', 'ml'];

languages.forEach(lang => {
  const filePath = path.join('./i18n/messages', `${lang}.json`);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    let jsonContent = JSON.parse(content);
    
    // Add HomePage and Navigation sections at the beginning
    jsonContent = { ...homePageSection, ...jsonContent };
    
    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});

console.log('All language files updated!');
