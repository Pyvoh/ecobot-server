// API configuration for Render deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

console.log("🔗 API Base URL:", API_BASE_URL)

export const api = {
  // Bin status endpoints
  getBinStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bin-status`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("❌ Failed to fetch bin status:", error)
      throw error
    }
  },

  updateBinStatus: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bin-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("❌ Failed to update bin status:", error)
      throw error
    }
  },

  // Bottle data endpoints
  getBottleData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bottle-data`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("❌ Failed to fetch bottle data:", error)
      throw error
    }
  },

  clearBottleData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bottle-data`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("❌ Failed to clear bottle data:", error)
      throw error
    }
  },

  // Reward endpoints
  getRewardData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reward-bottle`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("📊 API: Fetched reward data:", data)
      return data
    } catch (error) {
      console.error("❌ Failed to fetch reward data:", error)
      throw error
    }
  },

  // Reset reward to 15
  resetReward: async () => {
    try {
      console.log("🔄 Frontend: Starting reset reward process...")

      const requestBody = {
        action: "reset",
        resetValue: 15,
      }

      console.log("📤 Frontend: Sending reset request:", requestBody)
      console.log("🔗 Frontend: API URL:", `${API_BASE_URL}/api/reward-bottle`)

      const response = await fetch(`${API_BASE_URL}/api/reward-bottle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("📡 Frontend: Reset response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Frontend: Reset failed:", response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Frontend: Reset successful:", result)

      // Verify the reset worked by fetching the data again
      setTimeout(async () => {
        try {
          const verifyData = await api.getRewardData()
          console.log("🔍 Frontend: Verification - reward after reset:", verifyData.totalReward)
        } catch (verifyError) {
          console.error("❌ Frontend: Failed to verify reset:", verifyError)
        }
      }, 500)

      return result
    } catch (error) {
      console.error("❌ Failed to reset reward:", error)
      throw error
    }
  },
}
