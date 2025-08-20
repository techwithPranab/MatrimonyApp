import Subscription from "@/models/Subscription";

export async function getPlansFromModel() {
  // Fetch distinct plans from the Subscription collection
  // For demo, return static plans if none exist
  const plans = await Subscription.aggregate([
    {
      $group: {
        _id: "$plan",
        count: { $sum: 1 }
      }
    }
  ]);
  // You can extend this to return more plan details from your DB
  return plans;
}
