import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import './CreateClaim.css';

const CreateClaim = () => {
  const { user, token } = useAuth(); // use token from AuthContext
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    claimType: 'Income Loss',
    disruptionReason: '',
    incomeBeforeDisruption: '',
    estimatedIncomeLoss: '',
    disruptionStartDate: '',
    disruptionEndDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [disruption, setDisruption] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check disruption status
  const checkDisruption = async () => {
    if (!token || !user) {
      alert('You must be logged in to check disruption');
      return;
    }

    const incomeBefore = parseFloat(formData.incomeBeforeDisruption);
    const estimatedLoss = parseFloat(formData.estimatedIncomeLoss);

    if (!incomeBefore || !estimatedLoss) {
      alert('Please enter valid income values first');
      return;
    }

    if (estimatedLoss > incomeBefore) {
      alert('Estimated loss cannot exceed income before disruption');
      return;
    }

    try {
      const currentIncome = incomeBefore - estimatedLoss;

      const response = await claimAPI.checkDisruption({
        currentWeeklyIncome: currentIncome,
      });

      setDisruption(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error checking disruption status');
    }
  };

  // Handle claim submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token || !user) {
      setError('You must be logged in to submit a claim');
      return;
    }

    const incomeBefore = parseFloat(formData.incomeBeforeDisruption);
    const estimatedLoss = parseFloat(formData.estimatedIncomeLoss);

    // Validation
    if (!formData.claimType || !formData.disruptionReason) {
      setError('Please fill in all required fields');
      return;
    }

    if (estimatedLoss > incomeBefore) {
      setError('Estimated loss cannot be greater than income before disruption');
      return;
    }

    if (!disruption || !disruption.disrupted) {
      setError('Income disruption not high enough for claim');
      return;
    }

    if (new Date(formData.disruptionEndDate) < new Date(formData.disruptionStartDate)) {
      setError('End date cannot be before start date');
      return;
    }

    setLoading(true);

    try {
      await claimAPI.submitClaim({
        claimType: formData.claimType,
        disruptionType: formData.disruptionReason,
        incomeBeforeDisruption: incomeBefore,
        incomeAfterDisruption: incomeBefore - estimatedLoss,
        estimatedIncomeLoss: estimatedLoss,
        disruptionStartDate: formData.disruptionStartDate,
        disruptionEndDate: formData.disruptionEndDate,
        policyId: user.activePolicy,
      });

      alert('Claim submitted successfully!');
      navigate('/claims');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-claim-container">
      <div className="create-claim-card">
        <h1>Submit Insurance Claim</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Claim Information</h2>

            <div className="form-group">
              <label>Claim Type *</label>
              <select
                name="claimType"
                value={formData.claimType}
                onChange={handleChange}
                required
              >
                <option value="Income Loss">Income Loss Due to Disruption</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reason for Disruption *</label>
              <select
                name="disruptionReason"
                value={formData.disruptionReason}
                onChange={handleChange}
                required
              >
                <option value="">Select disruption</option>
                <option value="Rain">Rain</option>
                <option value="Heatwave">Heatwave</option>
                <option value="Pollution">Pollution</option>
                <option value="Curfew">Curfew</option>
                <option value="Flood">Flood</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date of Disruption *</label>
                <input
                  type="date"
                  name="disruptionStartDate"
                  value={formData.disruptionStartDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date of Disruption *</label>
                <input
                  type="date"
                  name="disruptionEndDate"
                  value={formData.disruptionEndDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Income Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Income Before Disruption *</label>
                <input
                  type="number"
                  name="incomeBeforeDisruption"
                  value={formData.incomeBeforeDisruption}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Estimated Income Loss *</label>
                <input
                  type="number"
                  name="estimatedIncomeLoss"
                  value={formData.estimatedIncomeLoss}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={checkDisruption}
              disabled={!formData.estimatedIncomeLoss || !formData.incomeBeforeDisruption}
            >
              Check Disruption Status
            </button>

            {disruption && (
              <div className="disruption-info">
                <p>
                  <strong>Disruption Detected:</strong> {disruption.disrupted ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Expected Weekly Income:</strong> ${disruption.expectedWeeklyIncome}
                </p>
                <p>
                  <strong>Disruption Percentage:</strong> {disruption.disruptionPercentage}%
                </p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting Claim...' : 'Submit Claim'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/claims')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClaim;