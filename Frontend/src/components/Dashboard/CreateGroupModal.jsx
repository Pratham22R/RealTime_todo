import React, { useState } from 'react';
import './CreateGroupModal.css';

const CreateGroupModal = ({ open, onClose, onCreate, loading }) => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    setError('');
    await onCreate(groupName);
    setGroupName('');
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="create-group-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Create New Group</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="group-name" className="modal-label">Group Name</label>
          <input
            id="group-name"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className="group-name-input"
            disabled={loading}
            autoFocus
          />
          {error && <div className="modal-error">{error}</div>}
          <button type="submit" className="modal-create-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
