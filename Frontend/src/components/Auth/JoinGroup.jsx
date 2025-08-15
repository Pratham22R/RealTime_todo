import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGroup } from '../../contexts/GroupContext';
import './JoinGroup.css';

const JoinGroup = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { joinGroup, error } = useGroup();
  const [joinStatus, setJoinStatus] = useState('joining');

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { 
        state: { 
          redirectTo: `/join/${token}`,
          message: 'Please log in to join the group'
        } 
      });
      return;
    }

    if (token) {
      handleJoinGroup();
    }
  }, [token, isAuthenticated, navigate]);

  const handleJoinGroup = async () => {
    try {
      setJoinStatus('joining');
      await joinGroup(token);
      setJoinStatus('success');
      
      // Redirect to dashboard after successful join
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setJoinStatus(err, 'error');
    }
  };

  const renderContent = () => {
    switch (joinStatus) {
      case 'joining':
        return (
          <div className="join-status joining">
            <div className="loading-spinner"></div>
            <h2>Joining Group...</h2>
            <p>Please wait while we add you to the group.</p>
          </div>
        );

      case 'success':
        return (
          <div className="join-status success">
            <div className="success-icon">✓</div>
            <h2>Successfully Joined!</h2>
            <p>You have been added to the group. Redirecting to the board...</p>
          </div>
        );

      case 'error':
        return (
          <div className="join-status error">
            <div className="error-icon">✗</div>
            <h2>Failed to Join Group</h2>
            <p>{error || 'The invite link may be invalid or expired.'}</p>
            <div className="action-buttons">
              <button onClick={() => navigate('/board')} className="btn-primary">
                Go to Board
              </button>
              <button onClick={() => window.history.back()} className="btn-secondary">
                Go Back
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="join-group-container">
      <div className="join-group-card">
        {renderContent()}
      </div>
    </div>
  );
};

export default JoinGroup;
