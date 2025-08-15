import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../../contexts/GroupContext';
import './GroupSelector.css';

const GroupSelector = () => {
  const { groups, currentGroup, leaveGroup, loading, error } = useGroup();
  const navigate = useNavigate();



  if (loading && groups.length === 0) {
    return (
      <div className="group-selector">
        <div className="loading">Loading groups...</div>
      </div>
    );
  }

  // If no groups exist, show message to go to dashboard
  if (groups.length === 0) {
    return (
      <div className="group-selector">
        <div className="no-groups-message">
          <h3>No Groups Available</h3>
          <p>You need to create or join a group first.</p>
          <button 
            className="go-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group-selector">
      <div className="group-selector-header">
        <h3>Current Group</h3>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {currentGroup ? (
        <div className="current-group-display">
          <div className="group-info-card">
            <div className="group-header">
              <h4>{currentGroup.name}</h4>
              <span className="member-count">{currentGroup.members?.length || 0} members</span>
            </div>
            <div className="group-actions">
              <button 
                className="leave-group-btn"
                onClick={async () => {
                  console.log('Current group object before leave:', currentGroup);
                  if (window.confirm(`Are you sure you want to leave "${currentGroup.name}"?`)) {
                    try {
                      await leaveGroup(currentGroup._id);
                    } catch (err) {
                      console.error('Error leaving group:', err);
                      alert('Error leaving group: ' + (err?.response?.data?.error || err.message));
                    }
                  }
                }}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-group-selected">
          <p>No group selected</p>
          <button 
            className="go-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
          >
            Select Group
          </button>
        </div>
      )}

      {currentGroup && (
        <div className="current-group-info">
          <h4>Current Group: {currentGroup.name}</h4>
          <div className="invite-section">
            <p>Invite others with this link:</p>
            <div className="invite-link">
              <input
                type="text"
                value={`${window.location.origin}/join/${currentGroup.inviteToken}`}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/join/${currentGroup.inviteToken}`
                  );
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
