# GigShield AI - Backend

## 🛡️ AI-Powered Parametric Income Protection for Gig Delivery Workers

### Features

- **User Registration & Authentication**: Secure JWT-based authentication
- **Policy Management**: Create, activate, and manage insurance policies
- **Dynamic Premium Calculation**: AI-driven pricing based on income, working hours, and risk factors
- **Claims Management**: Submit, track, and manage insurance claims
- **Income Disruption Detection**: Real-time monitoring for income disruptions
- **User Profile Management**: Complete profile with verification status

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB running on localhost:27017

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env` file with your settings:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gigshield
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

### Running the Backend

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend will be running on `http://localhost:5000`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/verify-identity` - Verify user identity
- `POST /api/users/verify-documents` - Verify documents

#### Policies
- `GET /api/policies` - Get all user policies
- `GET /api/policies/:id` - Get policy by ID
- `POST /api/policies` - Create new policy
- `POST /api/policies/:id/activate` - Activate policy
- `POST /api/policies/:id/cancel` - Cancel policy
- `POST /api/policies/:id/recalculate-premium` - Recalculate premium

#### Claims
- `GET /api/claims` - Get all user claims
- `GET /api/claims/:id` - Get claim by ID
- `POST /api/claims` - Submit new claim
- `POST /api/claims/:id/update-status` - Update claim status
- `POST /api/claims/:id/withdraw` - Withdraw claim
- `POST /api/claims/check-disruption` - Check income disruption

### Database Models

#### User
- Personal information (name, email, phone)
- Delivery platforms and work details
- Banking information
- Verification status

#### Policy
- Coverage amount and terms
- Premium calculations
- Policy status and dates
- Disruption risk factors

#### Claim
- Claim details and amounts
- Income disruption information
- Claim status and timeline
- Supporting documents

### Premium Calculation

Dynamic premium calculation based on:
- Base monthly income
- Working hours per week
- Risk factors
- Volume multiplier
- Policy coverage amount

Formula: `basePremium * hourlyAdjustment * riskAdjustment * volumeMultiplier`

### Testing

Test the API using Postman or cURL. Example:

```bash
# Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "deliveryPlatforms": ["Uber Eats", "DoorDash"],
    "monthlyAverageIncome": 3000,
    "workingHoursPerWeek": 40
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Token expiration (30 days)
- Request validation
- CORS enabled

### Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### License

MIT License

---

For frontend code, see the `frontend` directory.
