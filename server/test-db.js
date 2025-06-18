const mongoose = require('mongoose')
require('dotenv').config()

const testConnection = async () => {
  try {
    console.log('🧪 Testing MongoDB connection...')
    console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'))
    
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connection successful!')
    
    // Test creating a document
    const TestSchema = new mongoose.Schema({ message: String, timestamp: Date })
    const Test = mongoose.model('Test', TestSchema)
    
    const testDoc = new Test({
      message: 'EcoBot database test',
      timestamp: new Date()
    })
    
    await testDoc.save()
    console.log('✅ Test document created successfully!')
    
    // Clean up
    await Test.deleteOne({ _id: testDoc._id })
    console.log('✅ Test document cleaned up')
    
    await mongoose.disconnect()
    console.log('✅ Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    process.exit(1)
  }
}

testConnection()