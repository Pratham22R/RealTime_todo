import React from "react";

const ActivityDrawer = ({ open, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed right-0 top-0 h-screen w-80 md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Activity Log</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl"
          >
            &times;
          </button>
        </div>

        {/* Drawer Content (no vertical scroll) */}
        <div className="p-6 h-full overflow-y-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ActivityDrawer;
