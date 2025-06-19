import { type NextRequest, NextResponse } from "next/server"

// Import the same rewardData from the parent route
// Since we can't directly import it, we'll make an API call to the main route to reset it

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const resetValue = body.resetValue || 15

    console.log(`🔄 Resetting reward to ${resetValue}`)

    // Call the DELETE endpoint to reset, then set to our desired value
    const deleteResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/reward-bottle`,
      {
        method: "DELETE",
      },
    ).catch(() => null)

    // Now add the reset value
    const addResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/reward-bottle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: resetValue,
        reason: "History cleared - reward reset",
      }),
    }).catch(() => null)

    return NextResponse.json({
      success: true,
      totalReward: resetValue,
      message: `Reward reset to ${resetValue}`,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("❌ Error resetting reward:", error)
    return NextResponse.json({ success: false, error: "Failed to reset reward" }, { status: 500 })
  }
}
