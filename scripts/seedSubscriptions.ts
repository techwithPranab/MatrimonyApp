import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic profile creation",
      "View up to 50 profiles",
      "Send 5 interests per month",
      "Basic search filters",
      "Community support"
    ],
    popular: false,
    cta: "Get Started",
    icon: "Heart"
  },
  {
    name: "Premium",
    price: "₹1,999",
    period: "month",
    description: "Most popular choice for serious seekers",
    features: [
      "Unlimited profile views",
      "Send unlimited interests",
      "Advanced search filters",
      "See who viewed your profile",
      "Priority customer support",
      "Enhanced profile visibility",
      "Chat with matched profiles"
    ],
    popular: true,
    cta: "Start Premium",
    icon: "Star"
  },
  {
    name: "Elite",
    price: "₹4,999",
    period: "month",
    description: "Premium service with personal assistance",
    features: [
      "Everything in Premium",
      "Dedicated relationship manager",
      "Personalized match recommendations",
      "Profile verification badge",
      "Priority listing in search",
      "Phone consultation",
      "Success guarantee*"
    ],
    popular: false,
    cta: "Go Elite",
    icon: "Crown"
  }
];

async function seedSubscriptions() {
  await connectDB();
  for (const plan of plans) {
    await Subscription.create(plan);
  }
  console.log("Seeded subscription plans");
}

seedSubscriptions().catch((err) => {
  console.error("Error seeding subscriptions:", err);
});
