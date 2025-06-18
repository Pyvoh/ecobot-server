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
      return await response.json()
    } catch (error) {
      console.error("❌ Failed to fetch reward data:", error)
      throw error
    }
  },

  // Reset reward to initial value
  resetReward: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reward-bottle/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetValue: 15 }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("❌ Failed to reset reward:", error)
      throw error
    }
  },
}
