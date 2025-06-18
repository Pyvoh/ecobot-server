const express = require("express")
const router = express.Router()

// In-memory storage for bin status
let binStatus = {
  status: "UNKNOWN",
  message: "No data received",
  timestamp: new Date().toISOString(),
  device_id: "ecobot_001",
  containerLevel: 0,
  last_updated: new Date().toISOString(),
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

// GET /api/bin-status - Get current bin status
router.get("/", (req, res) => {
  console.log("🗑️ GET /api/bin-status - Fetching bin status")

  res.json({
    success: true,
    data: binStatus,
    formatted_timestamp: formatTimestamp(new Date(binStatus.timestamp)),
    ...binStatus,
  })
})

// POST /api/bin-status - Update bin status
router.post("/", (req, res) => {
  try {
    console.log("🗑️ POST /api/bin-status - Updating bin status")
    console.log("Request body:", req.body)

    const { status, message, device_id = "ecobot_001", containerLevel, timestamp } = req.body

    // Update bin status
    const previousStatus = binStatus.status

    binStatus = {
      status: status || binStatus.status,
      message: message || binStatus.message,
      timestamp: timestamp || new Date().toISOString(),
      device_id,
      containerLevel: containerLevel !== undefined ? Number.parseFloat(containerLevel) : binStatus.containerLevel,
      last_updated: new Date().toISOString(),
    }

    console.log(`📊 Bin status updated: ${previousStatus} → ${binStatus.status}`)
    console.log(`📏 Container level: ${binStatus.containerLevel}cm`)

    // Log special status changes
    if (status === "full" && previousStatus !== "full") {
      console.log("🚨 CONTAINER FULL - Alert triggered!")
    } else if (status === "empty" && previousStatus !== "empty") {
      console.log("✅ CONTAINER EMPTY - Ready for use")
    } else if (status === "connected") {
      console.log("🔗 Device connected and operational")
    }

    res.json({
      success: true,
      message: "Bin status updated successfully",
      previous_status: previousStatus,
      current_status: binStatus.status,
      data: binStatus,
      formatted_timestamp: formatTimestamp(new Date(binStatus.timestamp)),
    })
  } catch (error) {
    console.error("❌ Error updating bin status:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update bin status",
      message: error.message,
      timestamp: formatTimestamp(),
    })
  }
})

module.exports = router
