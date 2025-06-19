import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (in production, use a database)
let bottleData = {
  history: [], // Start empty
  total: 0, // Start with 0 bottles
  sessions: 0, // Start with 0 sessions
}

export async function GET() {
  return NextResponse.json(bottleData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different actions
    if (body.action === "decrease") {
      // This is a bottle collection that should decrease rewards
      const bottleCount = Math.abs(body.bottles || 3) // Use absolute value in case it's negative

      const newSession = {
        id: bottleData.history.length + 1,
        sessionType: body.sessionType || "Arduino Collection",
        bottles: bottleCount,
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
        status: body.status || "Completed",
        reward: 1, // Each session costs 1 reward point
      }

      bottleData.history.unshift(newSession)
      bottleData.total += bottleCount
      bottleData.sessions += 1

      console.log("New bottle collection recorded:", newSession)

      // Decrease the reward by 1 for this session (regardless of bottle count)
      try {
        const rewardResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/reward-bottle`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "decrease",
              amount: 1, // Always decrease by 1 per session
              reason: `Session ${newSession.id} completed - ${bottleCount} bottles collected`,
            }),
          },
        )

        if (rewardResponse.ok) {
          const rewardResult = await rewardResponse.json()
          console.log("✅ Reward decreased successfully:", rewardResult)
        } else {
          console.error("❌ Failed to decrease reward:", rewardResponse.status)
        }
      } catch (rewardError) {
        console.error("❌ Error calling reward API:", rewardError)
      }

      return NextResponse.json({
        success: true,
        session: newSession,
        total: bottleData.total,
        message: `Collected ${bottleCount} bottles, reward decreased by 1`,
      })
    } else {
      // Regular bottle collection (backward compatibility)
      const newSession = {
        id: bottleData.history.length + 1,
        sessionType: body.sessionType || "Arduino Collection",
        bottles: body.bottles || 3,
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
        status: body.status || "Completed",
        reward: 1, // Each session costs 1 reward point
      }

      bottleData.history.unshift(newSession)
      bottleData.total += newSession.bottles
      bottleData.sessions += 1

      console.log("New bottle collection recorded:", newSession)

      // Decrease the reward by 1 for this session
      try {
        const rewardResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/reward-bottle`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "decrease",
              amount: 1,
              reason: `Session ${newSession.id} completed`,
            }),
          },
        )

        if (rewardResponse.ok) {
          const rewardResult = await rewardResponse.json()
          console.log("✅ Reward decreased successfully:", rewardResult)
        }
      } catch (rewardError) {
        console.error("❌ Error calling reward API:", rewardError)
      }

      return NextResponse.json({
        success: true,
        session: newSession,
        total: bottleData.total,
      })
    }
  } catch (error) {
    console.error("Error processing bottle data:", error)
    return NextResponse.json({ error: "Failed to process bottle data" }, { status: 500 })
  }
}

export async function DELETE() {
  // Clear all history
  bottleData = {
    history: [],
    total: 0,
    sessions: 0,
  }

  console.log("🗑️ Bottle history cleared")

  return NextResponse.json({ success: true, message: "History cleared" })
}
