# GigShield AI - Quick Reference Guide

## 🚀 Quick Start Commands

### First Time Setup (Choose One)

#### Option 1: Full Setup (Recommended)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

#### Option 2: If Dependencies Already Installed
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

---

## 📍 URLs

| Component | URL |
|-----------|-----|
| Frontend App | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

---

## 👤 Demo Account

You can create your own account at registration, or use test data:

```
Email: test@demo.com
Password: demo@123
```

---

## 🔑 Key Features Quick Access

### Registration
1. Go to http://localhost:3000
2. Click "Register"
3. Fill form and submit
4. Automatically logged in

### Create Policy
1. Dashboard → Policies
2. Click "Create New Policy"
3. Set coverage ($1,000-$50,000)
4. Accept terms
5. Click "Create" then "Activate"

### Submit Claim
1. Dashboard → Claims
2. Click "Submit New Claim"
3. Enter disruption details
4. Check disruption status
5. Submit claim

### Manage Profile
1. Dashboard → Profile
2. Update information
3. Verify identity & documents
4. Save changes

---

## 📊 API Endpoints Quick Reference

### Auth
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # User login
GET    /api/auth/me             # Get current user
```

### User
```
GET    /api/users/profile       # Get profile
PUT    /api/users/profile       # Update profile
POST   /api/users/verify-identity
POST   /api/users/verify-documents
```

### Policies
```
GET    /api/policies            # Get all policies
POST   /api/policies            # Create policy
GET    /api/policies/:id        # Get policy details
POST   /api/policies/:id/activate
POST   /api/policies/:id/cancel
POST   /api/policies/:id/recalculate-premium
```

### Claims
```
GET    /api/claims              # Get all claims
POST   /api/claims              # Submit claim
GET    /api/claims/:id          # Get claim details
POST   /api/claims/check-disruption
POST   /api/claims/:id/withdraw
POST   /api/claims/:id/update-status
```

---

## 🛠️ Common Commands

### Backend Commands
```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Check npm version
npm --version

# Install specific package
npm install package-name
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## 🔍 Testing with Curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@test.com",
    "password":"password123",
    "phone":"1234567890",
    "deliveryPlatforms":["Uber Eats"],
    "monthlyAverageIncome":3000,
    "workingHoursPerWeek":40
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@test.com",
    "password":"password123"
  }'
```

### Get User Profile (Replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not connected:
# Windows: Start MongoDB service in Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Backend (Port 5000)
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Frontend (Port 3000)
SET PORT=3001 && npm start  # Windows
PORT=3001 npm start          # Mac/Linux
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### CORS Errors
1. Ensure backend is running
2. Check .env FRONTEND_URL is correct
3. Restart backend server
4. Clear browser cache (Ctrl+Shift+Del)

---

## 📁 Project Structure

```
bhanupks/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── README.md
├── SETUP_GUIDE.md
└── COMPLETION_CHECKLIST.md
```

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigshield
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎨 Customization

### Change Colors
Edit `frontend/src/pages/*.css`:
```css
.btn-primary {
  background: #667eea;  /* Change this */
}
```

### Add Delivery Platforms
Edit `backend/models/User.js` and `frontend/src/pages/Register.js`:
```javascript
enum: ['Uber Eats', 'DoorDash', 'YourPlatform']
```

### Change Premium Formula
Edit `backend/utils/calculations.js`:
```javascript
const calculateDynamicPremium = (...) => {
  // Modify calculation here
}
```

---

## 🔐 Security Tips

1. **Change JWT Secret** in `.env`
   ```
   JWT_SECRET=generate_strong_random_string
   ```

2. **Secure Database**
   - Use strong MongoDB password
   - Enable authentication
   - Restrict IP access

3. **API Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Add request logging

4. **Frontend Security**
   - Don't store sensitive data in localStorage
   - Use secure cookies
   - Validate all inputs

---

## 📦 Deployment Checklist

- [ ] All endpoints tested
- [ ] Error handling complete
- [ ] Environment variables set
- [ ] MongoDB secured
- [ ] JWT secret changed
- [ ] Frontend build optimized
- [ ] SSL certificate ready (production)
- [ ] Database backups configured
- [ ] Monitoring set up

---

## 🚀 Deployment Options

### Backend (Heroku)
```bash
heroku login
heroku create app-name
git push heroku main
```

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Backend (Railway)
```bash
npm install -g @railway/cli
railway up
```

### Full Stack (Docker)
Create `Dockerfile` and `docker-compose.yml` in root

---

## 📚 Learning Resources

- **MongoDB**: https://docs.mongodb.com/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Node.js**: https://nodejs.org/
- **JWT**: https://jwt.io/

---

## 💡 Tips & Tricks

### Debug Backend
1. Add console.log() statements
2. Check `/tmp/logs.txt` or console output
3. Use MongoDB Compass to inspect data
4. Use Postman to test endpoints

### Debug Frontend
1. Open Chrome DevTools (F12)
2. Check Console tab for errors
3. Use React DevTools extension
4. Network tab to see API calls

### Performance Optimization
1. Use React.memo() for components
2. Implement lazy loading
3. Optimize images
4. Minify CSS and JS
5. Enable gzip compression

---

## 🎓 Learning Path

1. **Understand Database Schema**
   - Review models in backend/models/

2. **Learn API Endpoints**
   - Test with Postman or Curl
   - Check backend/routes/

3. **Explore Frontend Components**
   - Review React components
   - Understand AuthContext flow

4. **Modify Features**
   - Change colors and styles
   - Add new policies or claim types
   - Extend user profile

5. **Deploy Application**
   - Set up production database
   - Configure environment variables
   - Deploy backend and frontend

---

## 🆘 Getting Help

### If Something Doesn't Work

1. **Check Error Messages**
   - Browser console (F12)
   - Backend terminal output

2. **Verify Setup**
   - Backend running? Port 5000?
   - Frontend running? Port 3000?
   - MongoDB running? Port 27017?

3. **Review Logs**
   - Check backend terminal
   - Check browser console
   - Check network requests (F12 → Network)

4. **Try Solutions**
   - Restart servers
   - Clear cache (Ctrl+Shift+Del)
   - Reinstall dependencies
   - Check environment variables

5. **Last Resort**
   - Delete node_modules
   - Delete package-lock.json
   - `npm install` again
   - Restart backend and frontend

---

## ✅ Success Indicators

You'll know it's working when:

- ✓ Can register new account
- ✓ Can login with credentials
- ✓ Can create insurance policy
- ✓ Can view policies with status
- ✓ Can submit insurance claim
- ✓ Can check claim status
- ✓ Can update profile
- ✓ Dashboard shows correct data
- ✓ No console errors
- ✓ API responses are fast

---

**GigShield AI is Ready to Use! 🎉**

For detailed information, see:
- SETUP_GUIDE.md
- backend/README.md
- frontend/README.md
- COMPLETION_CHECKLIST.md

