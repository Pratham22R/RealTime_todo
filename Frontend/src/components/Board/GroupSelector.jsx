import React, { useState } from 'react';
import { useGroup } from '../../contexts/GroupContext';
import './GroupSelector.css';

const GroupSelector = () => {
  const { groups, currentGroup, selectGroup, createGroup, loading, error } = useGroup();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await createGroup({ name: newGroupName.trim() });
      setNewGroupName('');
      setShowCreateForm(false);
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleGroupSelect = (group) => {
    selectGroup(group);
  };

  if (loading && groups.length === 0) {
    return (
      <div className="group-selector">
        <div className="loading">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="group-selector">
      <div className="group-selector-header">
        <h3>Groups</h3>
        <button
          className="btn-create-group"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ New Group'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {showCreateForm && (
        <form className="create-group-form" onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Enter group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newGroupName.trim()}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      <div className="groups-list">
        {groups.length === 0 ? (
          <div className="no-groups">
            <p>No groups yet. Create your first group to get started!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              className={`group-item ${currentGroup?._id === group._id ? 'active' : ''}`}
              onClick={() => handleGroupSelect(group)}
            >
              <div className="group-info">
                <span className="group-name">{group.name}</span>
                <span className="group-members">{group.members?.length || 0} members</span>
              </div>
              {currentGroup?._id === group._id && (
                <div className="current-indicator">✓</div>
              )}
            </div>
          ))
        )}
      </div>

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
