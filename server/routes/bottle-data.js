const express = require("express")
const router = express.Router()

// In-memory storage (replace with database in production)
let bottleData = {
  history: [],
  total: 0,
  sessions: 0,
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

// GET /api/bottle-data - Get all bottle data
router.get("/", (req, res) => {
  console.log("📊 GET /api/bottle-data - Fetching bottle data")

  res.json({
    success: true,
    data: bottleData,
    timestamp: formatTimestamp(),
    ...bottleData,
  })
})

// POST /api/bottle-data - Add new bottle collection session
router.post("/", (req, res) => {
  try {
    console.log("📦 POST /api/bottle-data - New bottle collection")
    console.log("Request body:", req.body)

    const {
      sessionType = "Arduino Collection",
      bottles = 3,
      status = "Completed",
      device_id = "ecobot_001",
      timestamp,
    } = req.body

    // Create new session
    const newSession = {
      id: bottleData.history.length + 1,
      sessionType,
      bottles: Number.parseInt(bottles),
      timestamp: timestamp || formatTimestamp(),
      status,
      device_id,
      reward: 1, // Each session costs 1 reward point
      created_at: new Date().toISOString(),
    }

    // Update data
    bottleData.history.unshift(newSession)
    bottleData.total += newSession.bottles
    bottleData.sessions += 1

    console.log("✅ New bottle collection recorded:", newSession)
    console.log(`📊 Updated totals - Bottles: ${bottleData.total}, Sessions: ${bottleData.sessions}`)

    // Simulate reward system update (you can make HTTP request to reward endpoint)
    updateRewardSystem(newSession.id)

    res.status(201).json({
      success: true,
      message: "Bottle collection recorded successfully",
      session: newSession,
      total: bottleData.total,
      sessions: bottleData.sessions,
      timestamp: formatTimestamp(),
    })
  } catch (error) {
    console.error("❌ Error processing bottle data:", error)
    res.status(500).json({
      success: false,
      error: "Failed to process bottle data",
      message: error.message,
      timestamp: formatTimestamp(),
    })
  }
})

// DELETE /api/bottle-data - Clear all history
router.delete("/", (req, res) => {
  console.log("🗑️ DELETE /api/bottle-data - Clearing all history")

  bottleData = {
    history: [],
    total: 0,
    sessions: 0,
  }

  console.log("✅ All bottle data cleared")

  res.json({
    success: true,
    message: "All bottle history cleared",
    timestamp: formatTimestamp(),
  })
})

// Helper function to update reward system
function updateRewardSystem(sessionId) {
  // In a real application, you might make an HTTP request to the reward endpoint
  // or update the database directly
  console.log(`💰 Reward system updated for session ${sessionId} - 1 point deducted`)
}

module.exports = router
