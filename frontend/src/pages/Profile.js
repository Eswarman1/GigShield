import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setFormData(response.data.user);
    } catch (err) {
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const platforms = formData.deliveryPlatforms || [];
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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (window.confirm('Proceed with identity verification?')) {
      try {
        await userAPI.verifyIdentity();
        fetchProfile();
        alert('Identity verified successfully!');
      } catch (err) {
        alert('Error verifying identity: ' + err.response?.data?.message);
      }
    }
  };

  const handleVerifyDocuments = async () => {
    if (window.confirm('Proceed with document verification?')) {
      try {
        await userAPI.verifyDocuments();
        fetchProfile();
        alert('Documents verified successfully!');
      } catch (err) {
        alert('Error verifying documents: ' + err.response?.data?.message);
      }
    }
  };

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData?.firstName || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData?.lastName || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData?.email || ''} disabled />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Work Information</h2>
            <div className="form-group">
              <label>Delivery Platforms</label>
              <div className="checkbox-group">
                {['Uber Eats', 'DoorDash', 'Instacart', 'Amazon Flex', 'Other'].map((platform) => (
                  <label key={platform} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={platform}
                      checked={formData?.deliveryPlatforms?.includes(platform) || false}
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
                  value={formData?.monthlyAverageIncome || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Working Hours/Week</label>
                <input
                  type="number"
                  name="workingHoursPerWeek"
                  value={formData?.workingHoursPerWeek || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Banking Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Bank Account Number</label>
                <input
                  type="password"
                  name="bankAccountNumber"
                  value={formData?.bankAccountNumber || ''}
                  onChange={handleChange}
                  placeholder="****"
                />
              </div>
              <div className="form-group">
                <label>Routing Number</label>
                <input
                  type="password"
                  name="bankRoutingNumber"
                  value={formData?.bankRoutingNumber || ''}
                  onChange={handleChange}
                  placeholder="****"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Verification Status</h2>
            <div className="verification-status">
              <div className="status-item">
                <span>Identity Verified:</span>
                <span className={formData?.identityVerified ? 'verified' : 'not-verified'}>
                  {formData?.identityVerified ? '✓ Yes' : '✗ No'}
                </span>
                {!formData?.identityVerified && (
                  <button type="button" onClick={handleVerifyIdentity} className="btn btn-small btn-secondary">
                    Verify Now
                  </button>
                )}
              </div>
              <div className="status-item">
                <span>Documents Verified:</span>
                <span className={formData?.documentVerified ? 'verified' : 'not-verified'}>
                  {formData?.documentVerified ? '✓ Yes' : '✗ No'}
                </span>
                {!formData?.documentVerified && (
                  <button type="button" onClick={handleVerifyDocuments} className="btn btn-small btn-secondary">
                    Verify Now
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
