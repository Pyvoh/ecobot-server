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
    console.log("📥 POST reward data received:", JSON.stringify(body, null, 2))

    // Handle reset action FIRST
    if (body.action === "reset") {
      const resetValue = body.resetValue || 15

      console.log(`🔄 RESET ACTION: Setting reward to ${resetValue}`)

      rewardData = {
        totalReward: resetValue,
        rewardHistory: [],
      }

      console.log(`✅ Reward successfully reset to ${rewardData.totalReward}`)

      return NextResponse.json({
        success: true,
        totalReward: rewardData.totalReward,
        action: "reset",
        message: `Reward reset to ${resetValue}`,
      })
    }

    // Handle decrease action
    else if (body.action === "decrease") {
      const amount = body.amount || 1
      const previousReward = rewardData.totalReward

      console.log(`💰 DECREASE ACTION: ${previousReward} - ${amount}`)

      const newReward = {
        id: rewardData.rewardHistory.length + 1,
        amount: -amount, // Negative amount for decrease
        timestamp:
          body.timestamp ||
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Manila",
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
      rewardData.totalReward = Math.max(0, rewardData.totalReward - amount)

      console.log(`✅ Reward decreased from ${previousReward} to ${rewardData.totalReward}`)

      return NextResponse.json({
        success: true,
        reward: newReward,
        totalReward: rewardData.totalReward,
        previousReward: previousReward,
        action: "decreased",
        message: `Reward decreased from ${previousReward} to ${rewardData.totalReward}`,
      })
    }

    // Handle add/increase action
    else if (body.action === "increase" || body.action === "add") {
      const newReward = {
        id: rewardData.rewardHistory.length + 1,
        amount: body.amount || 1,
        timestamp:
          body.timestamp ||
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Manila",
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

    // If no valid action is provided
    else {
      console.error("❌ Invalid action provided:", body.action)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use 'reset', 'decrease', 'increase', or 'add'",
        },
        { status: 400 },
      )
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

  console.log("🗑️ Rewards reset to 0 via DELETE")

  return NextResponse.json({ success: true, message: "Rewards reset to 0" })
}
