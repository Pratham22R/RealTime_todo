import React from 'react';
import './ActivityDrawer.css';

const ActivityDrawer = ({ open, onClose, children }) => {
  return (
    <div className={`activity-drawer-backdrop${open ? ' open' : ''}`} onClick={onClose}>
      <div
        className={`activity-drawer${open ? ' open' : ''}`}
        onClick={e => e.stopPropagation()}
        style={{ height: '100vh' }}
      >
        <button className="drawer-close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="drawer-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ActivityDrawer;
