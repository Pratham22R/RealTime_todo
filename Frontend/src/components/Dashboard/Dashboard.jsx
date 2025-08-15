import React, { useState } from 'react';
import CreateGroupModal from './CreateGroupModal';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Users, ArrowRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { groups, currentGroup, selectGroup, joinGroup, leaveGroup, createGroup, loading, error } = useGroup();
  const [joinUrl, setJoinUrl] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!joinUrl.trim()) return;

    try {
      setJoining(true);
      setJoinError('');
      
      // Extract token from URL
      const urlParts = joinUrl.trim().split('/');
      const token = urlParts[urlParts.length - 1];
      
      if (!token) {
        setJoinError('Invalid invite URL. Please check the link.');
        return;
      }

      await joinGroup(token);
      setJoinUrl('');
      setJoinError('');
    } catch (err) {
      setJoinError(err.response?.data?.error || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  const handleGroupClick = (group) => {
    selectGroup(group);
    navigate('/board');
  };

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  const handleCreateGroupSubmit = async (groupName) => {
    setCreating(true);
    try {
      await createGroup({ name: groupName });
      setShowCreateModal(false);
    } catch {
      // error handled in context
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <CreateGroupModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateGroupSubmit}
        loading={creating}
      />
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.username}!</h1>
            <p>Manage your groups and collaborate with your team</p>
          </div>
          <button className="create-group-btn" onClick={handleCreateGroup}>
            <Plus size={20} />
            Create New Group
          </button>
        </div>

        {/* Join Group Section */}
        <div className="join-group-section">
          <h2>Join a Group</h2>
          <p>Paste an invite link to join a group</p>
          <form onSubmit={handleJoinGroup} className="join-form">
            <input
              type="url"
              placeholder="https://yourapp.com/join/abc123..."
              value={joinUrl}
              onChange={(e) => setJoinUrl(e.target.value)}
              disabled={joining}
              className="join-input"
            />
            <button type="submit" disabled={joining || !joinUrl.trim()} className="join-btn">
              {joining ? 'Joining...' : 'Join Group'}
            </button>
          </form>
          {joinError && <div className="join-error">{joinError}</div>}
        </div>

        {/* Groups Section */}
        <div className="groups-section">
          <h2>Your Groups</h2>
          {groups.length === 0 ? (
            <div className="no-groups">
              <Users size={48} />
              <h3>No groups yet</h3>
              <p>Create your first group or join an existing one to get started</p>
              <button className="create-first-group-btn" onClick={handleCreateGroup}>
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className="groups-grid">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className={`group-card ${currentGroup?._id === group._id ? 'active' : ''}`}
                  onClick={() => handleGroupClick(group)}
                >
                  <div className="group-card-header">
                    <h3>{group.name}</h3>
                    <span className="member-count">
                      {group.members?.length || 0} members
                    </span>
                  </div>
                  <div className="group-card-footer">
                    <span className="group-role">
                      {group.creator === user?.id ? 'Creator' : 'Member'}
                    </span>
                    <div className="group-actions">
                      <button
                        className="leave-group-btn-small"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to leave "${group.name}"?`)) {
                            await leaveGroup(group._id);
                          }
                        }}
                        title="Leave Group"
                      >
                        ×
                      </button>
                      <ArrowRight size={16} className="arrow-icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
