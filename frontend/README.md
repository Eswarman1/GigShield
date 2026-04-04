# GigShield AI - Frontend

## 🛡️ AI-Powered Parametric Income Protection for Gig Delivery Workers

### Features

- **User Authentication**: Secure login and registration
- **Dashboard**: Overview of policies and account status
- **Policy Management**: Create and manage insurance policies
- **Claims Management**: Submit and track claims
- **Profile Management**: Complete and verify user profile
- **Real-time Income Disruption Detection**: Check income disruption status
- **Responsive Design**: Works on desktop and mobile devices

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API configuration (if needed)**
   
   Edit `src/utils/api.js` to match your backend URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

### Running the Frontend

**Development mode:**
```bash
npm start
```

The frontend will open at `http://localhost:3000`

**Production build:**
```bash
npm run build
```

### Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Policies.js
│   │   ├── CreatePolicy.js
│   │   ├── Claims.js
│   │   ├── CreateClaim.js
│   │   ├── Profile.js
│   │   └── (CSS files)
│   ├── components/
│   ├── utils/
│   │   ├── api.js
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.js
│   └── (CSS files)
└── package.json
```

### Pages

#### Authentication
- **Login** - User login page
- **Register** - New user registration with profile setup

#### Main Application
- **Dashboard** - Main overview with statistics and quick actions
- **Policies** - View all policies with status and actions
- **Create Policy** - Create new insurance policy with coverage details
- **Claims** - View all submitted claims with status tracking
- **Create Claim** - Submit new insurance claim
- **Profile** - Manage user profile and verification

### Key Features

#### 1. User Registration
- First name, last name, email, password
- Phone number
- Delivery platforms (multi-select)
- Monthly average income
- Working hours per week

#### 2. Policy Management
- Create policies with custom coverage amounts
- Set deductibles and waiting periods
- View policy details and status
- Activate or cancel policies
- Automatic premium calculation

#### 3. Claims Management
- Submit claims with income disruption details
- Track claim status (Submitted → Under Review → Approved/Rejected → Paid)
- Withdraw claims if needed
- Real-time disruption detection

#### 4. Profile Management
- Update personal and work information
- Banking information (encrypted)
- Verify identity and documents
- View verification status

### API Integration

The frontend uses Axios with interceptors for:
- Automatic JWT token injection in headers
- Error handling
- Request/response logging

### Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token added to all subsequent API requests
5. If token expires, user is redirected to login

### Styling

- Modern, light color palette
- Responsive design with CSS Grid and Flexbox
- Gradient backgrounds for premium feel
- Smooth transitions and hover effects
- Mobile-first approach

### Color Scheme

- Primary: #667eea (Purple/Blue)
- Secondary: #764ba2 (Darker Purple)
- Success: #4caf50 (Green)
- Danger: #f44336 (Red)
- Background: #f8f9fa (Light Gray)

### Components

#### AuthContext
Manages user authentication state:
- User data
- Token management
- Login/logout functions
- Loading states

#### API Client
Centralized API communication:
- All endpoints defined
- Automatic token management
- Error handling

### Testing

1. Open browser to `http://localhost:3000`
2. Register a new account
3. Create a policy
4. Submit a claim
5. Check disruption status
6. View profile and verify information

### Build

Create an optimized production build:
```bash
npm run build
```

This creates a `build` folder ready for deployment.

### Troubleshooting

**Port 3000 already in use:**
```bash
Set PORT=3001 && npm start
```

**Backend not responding:**
- Ensure backend is running on `http://localhost:5000`
- Check MongoDB connection
- Verify `.env` configuration

**CORS errors:**
- Ensure backend CORS is configured to accept localhost:3000
- Check backend `.env` FRONTEND_URL setting

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### License

MIT License

---

For backend code, see the `backend` directory.
