import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    deliveryPlatforms: [],
    monthlyAverageIncome: '',
    workingHoursPerWeek: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const platforms = formData.deliveryPlatforms;
      if (checked) {
        platforms.push(value);
      } else {
        platforms.splice(platforms.indexOf(value), 1);
      }
      setFormData({ ...formData, deliveryPlatforms: platforms });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        ...formData,
        monthlyAverageIncome: parseFloat(formData.monthlyAverageIncome),
        workingHoursPerWeek: parseFloat(formData.workingHoursPerWeek),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🛡️ GigShield AI</h1>
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Delivery Platforms</label>
            <div className="checkbox-group">
              {['Uber Eats', 'DoorDash', 'Instacart', 'Amazon Flex', 'Other'].map((platform) => (
                <label key={platform} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={platform}
                    onChange={handleChange}
                  />
                  {platform}
                </label>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Monthly Average Income ($)</label>
              <input
                type="number"
                name="monthlyAverageIncome"
                value={formData.monthlyAverageIncome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Working Hours/Week</label>
              <input
                type="number"
                name="workingHoursPerWeek"
                value={formData.workingHoursPerWeek}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
