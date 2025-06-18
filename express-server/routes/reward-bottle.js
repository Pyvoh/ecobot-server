const express = require("express")
const router = express.Router()

// In-memory storage for rewards
let rewardData = {
  totalReward: 15, // Start with 15 rewards
  rewardHistory: [],
}

// Utility function for timezone formatting
function formatTimestamp(date = new Date()) {
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Manila", // UTC+8
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
}

// GET /api/reward-bottle - Get current reward data
router.get("/", (req, res) => {
  console.log("💰 GET /api/reward-bottle - Fetching reward data")

  res.json({
    success: true,
    data: rewardData,
    timestamp: formatTimestamp(),
    ...rewardData,
  })
})

// POST /api/reward-bottle - Update rewards
router.post("/", (req, res) => {
  try {
    console.log("💰 POST /api/reward-bottle - Processing reward update")
    console.log("Request body:", req.body)

    const { action = "increase", amount = 1, reason, timestamp } = req.body

    const rewardAmount = Number.parseInt(amount)
    const previousTotal = rewardData.totalReward

    if (action === "decrease") {
      // Decrease rewards (for completed sessions)
      const newReward = {
        id: rewardData.rewardHistory.length + 1,
        amount: -rewardAmount, // Negative amount for decrease
        timestamp: timestamp || formatTimestamp(),
        reason: reason || "Session completed - reward used",
        action: "decrease",
        created_at: new Date().toISOString(),
      }

      rewardData.rewardHistory.unshift(newReward)
      rewardData.totalReward = Math.max(0, rewardData.totalReward - rewardAmount)

      console.log(`📉 Reward decreased: -${rewardAmount} points`)
      console.log(`💰 Total rewards: ${previousTotal} → ${rewardData.totalReward}`)

      res.json({
        success: true,
        message: "Reward decreased successfully",
        reward: newReward,
        totalReward: rewardData.totalReward,
        previous_total: previousTotal,
        action: "decreased",
        timestamp: formatTimestamp(),
      })
    } else {
      // Add rewards (for manual additions or bonuses)
      const newReward = {
        id: rewardData.rewardHistory.length + 1,
        amount: rewardAmount,
        timestamp: timestamp || formatTimestamp(),
        reason: reason || "Reward added",
        action: "increase",
        created_at: new Date().toISOString(),
      }

      rewardData.rewardHistory.unshift(newReward)
      rewardData.totalReward += rewardAmount

      console.log(`📈 Reward increased: +${rewardAmount} points`)
      console.log(`💰 Total rewards: ${previousTotal} → ${rewardData.totalReward}`)

      res.json({
        success: true,
        message: "Reward added successfully",
        reward: newReward,
        totalReward: rewardData.totalReward,
        previous_total: previousTotal,
        action: "increased",
        timestamp: formatTimestamp(),
      })
    }
  } catch (error) {
    console.error("❌ Error processing reward:", error)
    res.status(500).json({
      success: false,
      error: "Failed to process reward",
      message: error.message,
      timestamp: formatTimestamp(),
    })
  }
})

// DELETE /api/reward-bottle - Reset rewards
router.delete("/", (req, res) => {
  console.log("🗑️ DELETE /api/reward-bottle - Resetting rewards")

  const previousTotal = rewardData.totalReward

  rewardData = {
    totalReward: 0,
    rewardHistory: [],
  }

  console.log(`💰 Rewards reset: ${previousTotal} → 0`)

  res.json({
    success: true,
    message: "Rewards reset successfully",
    previous_total: previousTotal,
    current_total: 0,
    timestamp: formatTimestamp(),
  })
})

module.exports = router
