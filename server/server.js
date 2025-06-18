const express = require("express")
const cors = require("cors")

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Import and use routes
try {
  const bottleRoutes = require("./routes/bottle-data")
  const binStatusRoutes = require("./routes/bin-status")
  const rewardRoutes = require("./routes/reward-bottle")
  
  app.use("/api/bottle-data", bottleRoutes)
  app.use("/api/bin-status", binStatusRoutes)
  app.use("/api/reward-bottle", rewardRoutes)
  
  console.log("✅ All routes loaded successfully")
} catch (error) {
  console.error("❌ Error loading routes:", error.message)
}

// Main route
app.get("/", (req, res) => {
  res.json({
    message: "EcoBot Express.js Server is running! 🤖",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET/POST /api/bottle-data",
      "GET/POST /api/bin-status", 
      "GET/POST /api/reward-bottle"
    ]
  })
})

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message
  })
})

// Start server
app.listen(PORT, () => {
  console.log("🚀 EcoBot Express.js Server Started!")
  console.log(`📡 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log("📋 Available endpoints:")
  console.log("   - GET/POST /api/bottle-data")
  console.log("   - GET/POST /api/bin-status")
  console.log("   - GET/POST /api/reward-bottle")
  console.log("✅ Ready to receive Arduino requests!")
})