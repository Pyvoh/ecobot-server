import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for rewards
let rewardData = {
  totalReward: 15, // Start with 15 rewards
  rewardHistory: [], // Start empty
}

export async function GET() {
  console.log("📊 GET reward data - Current total:", rewardData.totalReward)
  return NextResponse.json(rewardData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📥 POST reward data received:", body)

    // Handle reset action
    if (body.action === "reset") {
      const resetValue = body.resetValue || 15
      rewardData = {
        totalReward: resetValue,
        rewardHistory: [],
      }

      console.log(`🔄 Reward reset to ${resetValue}`)

      return NextResponse.json({
        success: true,
        totalReward: rewardData.totalReward,
        action: "reset",
        message: `Reward reset to ${resetValue}`,
      })
    }

    if (body.action === "decrease") {
      // Decrease rewards (for completed sessions)
      const amount = body.amount || 1
      const previousReward = rewardData.totalReward

      console.log(`💰 BEFORE decrease: ${previousReward}, decreasing by: ${amount}`)

      const newReward = {
        id: rewardData.rewardHistory.length + 1,
        amount: -amount, // Negative amount for decrease
        timestamp:
          body.timestamp ||
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Manila", // UTC+8
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
        reason: body.reason || "Session completed - reward used",
      }

      rewardData.rewardHistory.unshift(newReward)
      rewardData.totalReward = Math.max(0, rewardData.totalReward - amount) // Don't go below 0

      console.log(`💰 AFTER decrease: ${rewardData.totalReward} (was ${previousReward}, decreased by ${amount})`)

      return NextResponse.json({
        success: true,
        reward: newReward,
        totalReward: rewardData.totalReward,
        previousReward: previousReward,
        action: "decreased",
        message: `Reward decreased from ${previousReward} to ${rewardData.totalReward}`,
      })
    } else {
      // Add rewards (for manual additions or bonuses)
      const newReward = {
        id: rewardData.rewardHistory.length + 1,
        amount: body.amount || 1,
        timestamp:
          body.timestamp ||
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Manila", // UTC+8
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
        reason: body.reason || "Reward added",
      }

      rewardData.rewardHistory.unshift(newReward)
      rewardData.totalReward += newReward.amount

      console.log("✅ Reward added:", newReward, "New total:", rewardData.totalReward)

      return NextResponse.json({
        success: true,
        reward: newReward,
        totalReward: rewardData.totalReward,
        action: "increased",
      })
    }
  } catch (error) {
    console.error("❌ Error processing reward:", error)
    return NextResponse.json({ error: "Failed to process reward" }, { status: 500 })
  }
}

export async function DELETE() {
  // Reset rewards to 0 (this is different from the reset action above)
  rewardData = {
    totalReward: 0,
    rewardHistory: [],
  }

  console.log("🗑️ Rewards reset to 0")

  return NextResponse.json({ success: true, message: "Rewards reset to 0" })
}
