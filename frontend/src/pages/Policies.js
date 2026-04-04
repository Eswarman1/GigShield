import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { policyAPI } from '../utils/api';
import './Policies.css';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await policyAPI.getPolicies();
      setPolicies(response.data.policies);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (policyId) => {
    try {
      await policyAPI.activatePolicy(policyId);
      fetchPolicies();
      alert('Policy activated successfully!');
    } catch (error) {
      alert('Error activating policy: ' + error.response?.data?.message);
    }
  };

  const handleCancel = async (policyId) => {
    if (window.confirm('Are you sure you want to cancel this policy?')) {
      try {
        await policyAPI.cancelPolicy(policyId);
        fetchPolicies();
        alert('Policy cancelled successfully!');
      } catch (error) {
        alert('Error cancelling policy: ' + error.response?.data?.message);
      }
    }
  };

  if (loading) {
    return <div className="policies-container"><p>Loading...</p></div>;
  }

  return (
    <div className="policies-container">
      <div className="policies-header">
        <h1>Insurance Policies</h1>
        <button onClick={() => navigate('/policies/new')} className="btn btn-primary">
          + Create New Policy
        </button>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state">
          <p>No policies found. Create your first policy now!</p>
        </div>
      ) : (
        <div className="policies-grid">
          {policies.map((policy) => (
            <div key={policy._id} className="policy-card">
              <div className="policy-header">
                <h3>Policy: {policy.policyNumber}</h3>
                <span className={`status-badge status-${policy.status.toLowerCase()}`}>
                  {policy.status}
                </span>
              </div>
              <div className="policy-details">
                <div className="detail-row">
                  <span>Coverage Amount:</span>
                  <strong>${policy.coverageAmount}</strong>
                </div>
                <div className="detail-row">
                  <span>Premium (Monthly):</span>
                  <strong>${(policy.calculatedPremium * 30).toFixed(2)}</strong>
                </div>
                <div className="detail-row">
                  <span>Deductible:</span>
                  <strong>${policy.deductibleAmount}</strong>
                </div>
                <div className="detail-row">
                  <span>Waiting Period:</span>
                  <strong>{policy.waitingPeriodDays} days</strong>
                </div>
                {policy.startDate && (
                  <div className="detail-row">
                    <span>Active Since:</span>
                    <strong>{new Date(policy.startDate).toLocaleDateString()}</strong>
                  </div>
                )}
              </div>
              <div className="policy-actions">
                {policy.status === 'Pending' && (
                  <button onClick={() => handleActivate(policy._id)} className="btn btn-success">
                    Activate
                  </button>
                )}
                {policy.status === 'Active' && (
                  <button onClick={() => handleCancel(policy._id)} className="btn btn-danger">
                    Cancel
                  </button>
                )}
                <button onClick={() => navigate(`/policies/${policy._id}`)} className="btn btn-secondary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Policies;
