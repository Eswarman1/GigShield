# GigShield AI - Complete Setup Guide

## System Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher  
- **MongoDB**: Community Edition or Atlas
- **Git**: For version control

## Installation Steps

### Step 1: Clone/Download Project

```bash
cd bhanupks
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Verify: `mongosh` should connect successfully

#### Option B: MongoDB Atlas (Cloud)
1. Create account at: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env` with your connection string

### Step 3: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your settings if needed
# Default settings work for local development

# Start backend
npm run dev
```

**Expected Output:**
```
MongoDB connected
GigShield backend running on port 5000
```

### Step 4: Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view gigshield-frontend in the browser.
  Local:            http://localhost:3000
```

### Step 5: Verify Installation

1. Open browser: `http://localhost:3000`
2. Login page should load
3. Backend should show successful requests in console

## First Run Walkthrough

### 1. Register Account
- Click "Register"
- Fill in details:
  - Name: John Doe
  - Email: john@example.com
  - Password: demo@123
  - Phone: 1234567890
  - Platforms: Select multiple
  - Income: $3000
  - Hours: 40
- Click "Register"

### 2. Create Policy
- Go to "Policies"
- Click "Create New Policy"
- Set:
  - Coverage: $5,000
  - Deductible: $500
  - Waiting Period: 7
- Accept terms
- Click "Create Policy"
- Click "Activate"

### 3. Submit Claim (after 7 days)
- Go to "Claims"
- Click "Submit New Claim"
- Fill claim details:
  - Type: Income Loss
  - Reason: Platform app crash
  - Before Income: $750
  - After Income: $200
- Check disruption status
- Submit claim

### 4. View Dashboard
- Dashboard shows stats
- Policies count: 1 active
- Monthly income: $3000

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigshield
JWT_SECRET=gigshield_secret_key_2024_secure_token
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB service
# Windows: Services > MongoDB Server > Start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change port in backend/.env
PORT=5001

# Or kill process using port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Set different port in frontend terminal
SET PORT=3001 && npm start  # Windows
PORT=3001 npm start          # Mac/Linux
```

### Issue: CORS Error
**Solution:**
- Ensure backend is running on http://localhost:5000
- Check backend/.env has FRONTEND_URL=http://localhost:3000
- Restart backend server

## Testing API with Curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@test.com",
    "password": "password123",
    "phone": "1234567890",
    "deliveryPlatforms": ["Uber Eats"],
    "monthlyAverageIncome": 3000,
    "workingHoursPerWeek": 40
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123"
  }'
```

## Performance Tips

1. **Database Optimization**
   - Add indexes for frequently queried fields
   - Monitor MongoDB performance

2. **Frontend Optimization**
   - Use production build: `npm run build`
   - Minify CSS and JS

3. **Backend Optimization**
   - Enable compression
   - Implement caching
   - Use connection pooling

## Deployment

### Backend (Heroku)
```bash
cd backend
heroku login
heroku create gigshield-api
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
npm i -g vercel
vercel
```

## Development Tips

1. **Debug Console**
   - Frontend: Chrome DevTools (F12)
   - Backend: Check console output

2. **Database Inspection**
   - Use MongoDB Compass
   - Connect to localhost:27017

3. **API Testing**
   - Use Postman
   - Import API collection from `/docs/api.postman_collection.json`

## Project Features Checklist

- [x] User Registration & Authentication
- [x] Policy Management (Create, Read, Update, Cancel)
- [x] Dynamic Premium Calculation
- [x] Claims Management (Submit, Track, Withdraw)
- [x] Income Disruption Detection
- [x] User Profile Management
- [x] Document Verification
- [x] JWT Authentication
- [x] Password Hashing
- [x] Responsive UI
- [x] Error Handling

## Next Steps

1. Customize the color scheme (see frontend/src/pages/*.css)
2. Add more delivery platforms
3. Implement email notifications
4. Add payment processing
5. Set up admin dashboard
6. Implement real-time data feeds
7. Add analytics and reporting

## Support & Resources

- **Backend Docs**: `/backend/README.md`
- **Frontend Docs**: `/frontend/README.md`
- **API Reference**: See individual README files
- **MongoDB Docs**: https://docs.mongodb.com/
- **React Docs**: https://react.dev/
- **Node.js Docs**: https://nodejs.org/docs/

## Summary

You now have a fully functional GigShield AI application with:
- ✓ Complete backend API
- ✓ Responsive React frontend
- ✓ User authentication
- ✓ Policy management
- ✓ Claims processing
- ✓ Dynamic calculations

Happy coding! 🚀
