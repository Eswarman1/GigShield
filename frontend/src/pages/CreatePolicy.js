import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { policyAPI } from '../utils/api';
import './CreatePolicy.css';

const CreatePolicy = () => {
  const [formData, setFormData] = useState({
    coverageAmount: 5000,
    waitingPeriodDays: 7,
    deductibleAmount: 500,
    premiumFrequency: 'Daily',
    startDate: new Date().toISOString().split('T')[0],
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const response = await policyAPI.createPolicy({
        ...formData,
        coverageAmount: parseInt(formData.coverageAmount),
        waitingPeriodDays: parseInt(formData.waitingPeriodDays),
        deductibleAmount: parseInt(formData.deductibleAmount),
      });
      alert('Policy created successfully! Check the premium details.');
      navigate('/policies');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-policy-container">
      <div className="create-policy-card">
        <h1>Create Insurance Policy</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Coverage Details</h2>
            <div className="form-group">
              <label>Coverage Amount ($)</label>
              <input
                type="number"
                name="coverageAmount"
                value={formData.coverageAmount}
                onChange={handleChange}
                min="1000"
                max="50000"
                step="1000"
                required
              />
              <small>Maximum coverage: $50,000</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Waiting Period (Days)</label>
                <input
                  type="number"
                  name="waitingPeriodDays"
                  value={formData.waitingPeriodDays}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  required
                />
              </div>
              <div className="form-group">
                <label>Deductible ($)</label>
                <input
                  type="number"
                  name="deductibleAmount"
                  value={formData.deductibleAmount}
                  onChange={handleChange}
                  min="100"
                  max="5000"
                  step="100"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Premium Frequency</label>
              <select
                name="premiumFrequency"
                value={formData.premiumFrequency}
                onChange={handleChange}
                required
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Terms & Conditions</h2>
            <div className="terms-box">
              <p>
                By accepting, you agree to:
                <ul>
                  <li>• Coverage is provided upon policy activation</li>
                  <li>• Income disruption claims must be submitted within 30 days</li>
                  <li>• Waiting period applies to first claim only</li>
                  <li>• Maximum payout is limited to coverage amount minus deductible</li>
                  <li>• Eligibility verification required for claim approval</li>
                </ul>
              </p>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              I accept all terms and conditions
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Policy...' : 'Create Policy'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/policies')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePolicy;
