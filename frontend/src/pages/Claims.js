import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimAPI } from '../utils/api';
import './Claims.css';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await claimAPI.getClaims();
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (claimId) => {
    if (window.confirm('Are you sure you want to withdraw this claim?')) {
      try {
        await claimAPI.withdrawClaim(claimId);
        fetchClaims();
        alert('Claim withdrawn successfully!');
      } catch (error) {
        alert('Error withdrawing claim: ' + error.response?.data?.message);
      }
    }
  };

  if (loading) {
    return <div className="claims-container"><p>Loading...</p></div>;
  }

  return (
    <div className="claims-container">
      <div className="claims-header">
        <h1>Insurance Claims</h1>
        <button onClick={() => navigate('/claims/new')} className="btn btn-primary">
          + Submit New Claim
        </button>
      </div>

      {claims.length === 0 ? (
        <div className="empty-state">
          <p>No claims submitted yet. Submit your first claim if you experience income disruption!</p>
        </div>
      ) : (
        <div className="claims-table">
          <table>
            <thead>
              <tr>
                <th>Claim Number</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim._id}>
                  <td>{claim.claimNumber}</td>
                  <td>{claim.claimType}</td>
                  <td>${claim.claimAmount?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge status-${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => navigate(`/claims/${claim._id}`)} className="btn-small">
                      View
                    </button>
                    {['Submitted', 'Under Review'].includes(claim.status) && (
                      <button onClick={() => handleWithdraw(claim._id)} className="btn-small btn-danger">
                        Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Claims;
