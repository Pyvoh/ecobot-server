import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for rewards - MAKE SURE THIS IS GLOBAL
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
    console.log("📥 Current rewardData.totalReward BEFORE processing:", rewardData.totalReward)

    // Handle reset action FIRST - FIXED VERSION
    if (body.action === "reset") {
      const resetValue = body.resetValue || 15

      console.log(`🔄 RESET ACTION: Setting reward to EXACTLY ${resetValue}`)
      console.log(`🔄 BEFORE reset - totalReward was: ${rewardData.totalReward}`)

      // COMPLETELY REPLACE the rewardData object
      rewardData = {
        totalReward: resetValue, // Set to EXACTLY the reset value
        rewardHistory: [], // Clear history
      }

      console.log(`🔄 AFTER reset - totalReward is now: ${rewardData.totalReward}`)
      console.log(`✅ Reward successfully reset to EXACTLY ${rewardData.totalReward}`)

      return NextResponse.json({
        success: true,
        totalReward: rewardData.totalReward,
        action: "reset",
        message: `Reward reset to exactly ${resetValue}`,
        debug: {
          requestedValue: resetValue,
          actualValue: rewardData.totalReward,
          isCorrect: rewardData.totalReward === resetValue,
        },
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
      const amount = body.amount || 1
      const previousReward = rewardData.totalReward

      console.log(`➕ ADD ACTION: ${previousReward} + ${amount}`)

      const newReward = {
        id: rewardData.rewardHistory.length + 1,
        amount: amount,
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
      rewardData.totalReward += amount

      console.log(`✅ Reward increased from ${previousReward} to ${rewardData.totalReward}`)

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
      console.error("❌ Available actions: reset, decrease, increase, add")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use 'reset', 'decrease', 'increase', or 'add'",
          currentReward: rewardData.totalReward,
          receivedAction: body.action,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("❌ Error processing reward:", error)
    return NextResponse.json(
      {
        error: "Failed to process reward",
        currentReward: rewardData.totalReward,
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  console.log("🗑️ DELETE: Resetting to 0")

  rewardData = {
    totalReward: 0,
    rewardHistory: [],
  }

  console.log("🗑️ Rewards reset to 0 via DELETE")

  return NextResponse.json({
    success: true,
    message: "Rewards reset to 0",
    totalReward: rewardData.totalReward,
  })
}
