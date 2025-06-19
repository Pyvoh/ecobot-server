// Create this new file: app/api/reward-bottle/reset/route.js

// Import the same reward data (you might need to move this to a separate file)
// For now, we'll use a simple approach
const rewardData = {
  totalReward: 15,
  lastUpdated: Date.now(),
}

export async function POST(request) {
  try {
    const body = await request.json()
    const resetValue = body.resetValue || 15

    // Reset the reward data
    rewardData.totalReward = resetValue
    rewardData.lastUpdated = Date.now()

    console.log(`🔄 Reward reset to ${resetValue}`)

    return Response.json({
      success: true,
      totalReward: rewardData.totalReward,
      message: `Reward reset to ${resetValue}`,
      lastUpdated: rewardData.lastUpdated,
    })
  } catch (error) {
    console.error("❌ Error resetting reward:", error)
    return Response.json({ success: false, error: "Failed to reset reward" }, { status: 500 })
  }
}
