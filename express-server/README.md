# EcoBot Express.js Server

A robust Express.js server for the EcoBot Arduino project with real-time bottle collection tracking, bin status monitoring, and reward system management.

## 🚀 Features

- **RESTful API** for Arduino communication
- **Real-time data tracking** for bottle collections
- **Bin status monitoring** with container level tracking
- **Reward system** with automatic point deduction
- **CORS enabled** for cross-origin requests
- **Security headers** with Helmet.js
- **Request logging** with Morgan
- **Error handling** and validation
- **Health check endpoints**

## 📋 API Endpoints

### Bottle Data
- `GET /api/bottle-data` - Get all bottle collection data
- `POST /api/bottle-data` - Add new bottle collection session
- `DELETE /api/bottle-data` - Clear all bottle history

### Bin Status
- `GET /api/bin-status` - Get current bin status
- `POST /api/bin-status` - Update bin status

### Rewards
- `GET /api/reward-bottle` - Get current reward data
- `POST /api/reward-bottle` - Update rewards (increase/decrease)
- `DELETE /api/reward-bottle` - Reset rewards

### Health Check
- `GET /` - Server information
- `GET /health` - Health check for monitoring

## 🛠 Installation

1. Clone or download the project
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start development server: `npm run dev`
5. Start production server: `npm start`

## 🔧 Configuration

Edit the `.env` file to configure:
- Server port
- CORS settings
- Database connection (future)
- Security settings

## 📊 Usage

The server is designed to work with Arduino Uno R4 WiFi. Update your Arduino code to point to:
\`\`\`
http://your-server-ip:3001/api/
\`\`\`

## 🔒 Security

- Helmet.js for security headers
- CORS protection
- Input validation
- Error handling
- Rate limiting (can be added)

## 📝 Logging

All requests are logged with Morgan. Check console output for:
- API requests and responses
- Error messages
- Status updates
- System events
