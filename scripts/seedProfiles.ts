import connectDB from "@/lib/db";
import Profile from "@/models/Profile";

const maleNames = [
  "Amit", "Rahul", "Sourav", "Vikram", "Rohit", "Ankit", "Sandeep", "Manish", "Pranab", "Arjun",
  "Kunal", "Sumit", "Deepak", "Raj", "Abhishek", "Nikhil", "Vivek", "Saurabh", "Harsh", "Aditya",
  "Shubham", "Pankaj", "Aakash", "Varun", "Yash", "Rajat", "Gaurav", "Siddharth", "Mayank", "Tarun",
  "Dev", "Parth", "Rishi", "Aman", "Dhruv", "Kartik", "Sanket", "Rajat", "Nitin", "Rakesh",
  "Satyam", "Shivam", "Anshul", "Ravindra", "Vikas", "Praveen", "Ashish", "Suraj", "Mohit", "Jatin"
];

const femaleNames = [
  "Priya", "Neha", "Pooja", "Riya", "Ankita", "Shreya", "Sneha", "Aishwarya", "Sakshi", "Simran",
  "Kritika", "Isha", "Rashmi", "Swati", "Divya", "Nikita", "Megha", "Komal", "Ritu", "Tanya",
  "Sonam", "Payal", "Bhavna", "Aarti", "Preeti", "Monika", "Kajal", "Nidhi", "Shweta", "Pallavi",
  "Deepika", "Manisha", "Radhika", "Surbhi", "Anjali", "Kirti", "Mansi", "Sheetal", "Vaishali", "Juhi",
  "Ruchi", "Sonal", "Ekta", "Namrata", "Trisha", "Rupali", "Chhavi", "Meenakshi", "Shilpa", "Vidhi"
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCity() {
  const cities = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
  return cities[getRandomInt(0, cities.length - 1)];
}

function getRandomProfession() {
  const professions = ["Engineer", "Doctor", "Teacher", "Designer", "Developer", "Manager", "Artist", "Writer", "Consultant", "Entrepreneur"];
  return professions[getRandomInt(0, professions.length - 1)];
}

function getRandomDateOfBirth() {
  const start = new Date(1990, 0, 1).getTime();
  const end = new Date(2003, 0, 1).getTime();
  return new Date(getRandomInt(start, end));
}

function getRandomHeight() {
  return getRandomInt(150, 190);
}

function getRandomMaritalStatus() {
  const statuses = ["Never married", "Divorced", "Widowed"];
  return statuses[getRandomInt(0, statuses.length - 1)];
}

function getRandomLanguages() {
  const languages = ["Hindi", "English", "Bengali", "Tamil", "Marathi"];
  return [languages[getRandomInt(0, languages.length - 1)]];
}

function getRandomReligion() {
  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist"];
  return religions[getRandomInt(0, religions.length - 1)];
}

function getRandomCommunity() {
  const communities = ["Brahmin", "Kshatriya", "Vaishya", "Other"];
  return communities[getRandomInt(0, communities.length - 1)];
}

function getRandomEducation() {
  const education = ["Bachelor's", "Master's", "PhD", "Diploma"];
  return education[getRandomInt(0, education.length - 1)];
}

function getRandomDiet() {
  const diets = ["Vegetarian", "Non-vegetarian", "Vegan"];
  return diets[getRandomInt(0, diets.length - 1)];
}

function getRandomSmoking() {
  const smoking = ["Never", "Occasionally", "Regularly"];
  return smoking[getRandomInt(0, smoking.length - 1)];
}

function getRandomDrinking() {
  const drinking = ["Never", "Socially", "Regularly"];
  return drinking[getRandomInt(0, drinking.length - 1)];
}

function getRandomPhotos(gender: string, idx: number) {
  return [{
    url: `/avatars/${gender}${(idx % 10) + 1}.png`,
    isDefault: true,
    uploadedAt: new Date(),
  }];
}

function getDefaultPartnerPreferences() {
  return {
    ageRange: { min: 22, max: 35 },
    heightRange: { min: 150, max: 190 },
    maritalStatus: ["Never married"],
    religion: ["Hindu"],
    community: [],
    education: ["Bachelor's", "Master's"],
    profession: [],
    smoking: ["Never"],
    drinking: ["Never", "Socially"],
    diet: ["Vegetarian"],
    location: { country: "India", state: "", city: "" },
  };
}

function getDefaultPrivacy() {
  return {
    showProfile: true,
    showPhotos: "all",
    showContact: "mutual_interest",
    allowMessages: true,
  };
}

function getDefaultVerification() {
  return {
    email: true,
    phone: false,
    governmentId: false,
    education: false,
    profession: false,
  };
}

async function seedProfiles() {
  await connectDB();
  const profiles = [];

  for (let i = 0; i < 50; i++) {
    profiles.push({
      userId: `male${i + 1}`,
      firstName: maleNames[i],
      lastName: "Kumar",
      name: `${maleNames[i]} Kumar`,
      dateOfBirth: getRandomDateOfBirth(),
      gender: "male",
      height: getRandomHeight(),
      maritalStatus: getRandomMaritalStatus(),
      hasChildren: false,
      languages: getRandomLanguages(),
      country: "India",
      state: "Delhi",
      city: getRandomCity(),
      religion: getRandomReligion(),
      community: getRandomCommunity(),
      education: getRandomEducation(),
      profession: getRandomProfession(),
      currency: "INR",
      diet: getRandomDiet(),
      smoking: getRandomSmoking(),
      drinking: getRandomDrinking(),
      aboutMe: `Hi, I'm ${maleNames[i]} from ${getRandomCity()}.`,
      interests: ["Music", "Travel", "Sports"],
      photos: getRandomPhotos("male", i),
      partnerPreferences: getDefaultPartnerPreferences(),
      privacy: getDefaultPrivacy(),
      verification: getDefaultVerification(),
      completenessScore: 80,
      isActive: true,
      isPremium: false,
      lastActiveAt: new Date(),
    });
  }

  for (let i = 0; i < 50; i++) {
    profiles.push({
      userId: `female${i + 1}`,
      firstName: femaleNames[i],
      lastName: "Sharma",
      name: `${femaleNames[i]} Sharma`,
      dateOfBirth: getRandomDateOfBirth(),
      gender: "female",
      height: getRandomHeight(),
      maritalStatus: getRandomMaritalStatus(),
      hasChildren: false,
      languages: getRandomLanguages(),
      country: "India",
      state: "Delhi",
      city: getRandomCity(),
      religion: getRandomReligion(),
      community: getRandomCommunity(),
      education: getRandomEducation(),
      profession: getRandomProfession(),
      currency: "INR",
      diet: getRandomDiet(),
      smoking: getRandomSmoking(),
      drinking: getRandomDrinking(),
      aboutMe: `Hi, I'm ${femaleNames[i]} from ${getRandomCity()}.`,
      interests: ["Music", "Travel", "Cooking"],
      photos: getRandomPhotos("female", i),
      partnerPreferences: getDefaultPartnerPreferences(),
      privacy: getDefaultPrivacy(),
      verification: getDefaultVerification(),
      completenessScore: 80,
      isActive: true,
      isPremium: false,
      lastActiveAt: new Date(),
    });
  }

  for (const profile of profiles) {
    await Profile.create(profile);
  }

  console.log("Seeded 100 profiles (50 male, 50 female)");
}

seedProfiles().catch((err) => {
  console.error("Error seeding profiles:", err);
});
