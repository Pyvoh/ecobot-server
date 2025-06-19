// This should replace your existing app/api/reward-bottle/route.js

// Simple in-memory storage (you can replace this with database later)
const rewardData = {
  totalReward: 15, // Start with 15
  lastUpdated: Date.now(),
}

export async function GET(request) {
  try {
    console.log("📊 Getting reward data:", rewardData)

    return Response.json({
      success: true,
      totalReward: rewardData.totalReward,
      lastUpdated: rewardData.lastUpdated,
    })
  } catch (error) {
    console.error("❌ Error getting reward data:", error)
    return Response.json({ success: false, error: "Failed to get reward data" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    // If this is a new bottle collection, decrease reward by 1
    if (body.action === "collect_bottle") {
      rewardData.totalReward = Math.max(0, rewardData.totalReward - 1)
      rewardData.lastUpdated = Date.now()

      console.log("🍶 Bottle collected, reward decreased to:", rewardData.totalReward)
    }

    return Response.json({
      success: true,
      totalReward: rewardData.totalReward,
      lastUpdated: rewardData.lastUpdated,
    })
  } catch (error) {
    console.error("❌ Error updating reward data:", error)
    return Response.json({ success: false, error: "Failed to update reward data" }, { status: 500 })
  }
}
