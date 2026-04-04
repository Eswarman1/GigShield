import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, policyAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, policiesRes] = await Promise.all([
        userAPI.getProfile(),
        policyAPI.getPolicies(),
      ]);
      setUserProfile(profileRes.data.user);
      setPolicies(policiesRes.data.policies);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">🛡️ GigShield AI</div>
        <div className="navbar-menu">
          <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'}>
            Dashboard
          </button>
          <button onClick={() => navigate('/policies')} className="nav-btn">Policies</button>
          <button onClick={() => navigate('/claims')} className="nav-btn">Claims</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h1>Welcome, {userProfile?.firstName}!</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Active Policies</div>
                <div className="stat-value">{policies.filter(p => p.status === 'Active').length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Monthly Income</div>
                <div className="stat-value">${userProfile?.monthlyAverageIncome || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Working Hours/Week</div>
                <div className="stat-value">{userProfile?.workingHoursPerWeek || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Identity Verified</div>
                <div className="stat-value">{userProfile?.identityVerified ? '✓' : '✗'}</div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <button onClick={() => navigate('/policies/new')} className="btn btn-primary">
                Create Policy
              </button>
              <button onClick={() => navigate('/claims/new')} className="btn btn-secondary">
                Submit Claim
              </button>
              <button onClick={() => navigate('/profile')} className="btn btn-secondary">
                Complete Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
