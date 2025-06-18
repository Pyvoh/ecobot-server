// Create this new file: app/api/reward-bottle/reset/route.js

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const resetValue = body.resetValue || 15;

    // Here you would reset your reward data in your database/storage
    // For example, if you're using a simple variable or file storage:
    
    // Reset the reward to 15 (adjust this based on how you store your data)
    // If you're using a database, update the record
    // If you're using a file, write the new value
    // If you're using a global variable, reset it
    
    console.log(`🔄 Resetting reward to ${resetValue}`);
    
    // Example response - adjust based on your data structure
    const response = {
      success: true,
      totalReward: resetValue,
      message: `Reward reset to ${resetValue}`,
      timestamp: Date.now()
    };

    return Response.json(response);
    
  } catch (error) {
    console.error('❌ Error resetting reward:', error);
    return Response.json(
      { success: false, error: 'Failed to reset reward' }, 
      { status: 500 }
    );
  }
}