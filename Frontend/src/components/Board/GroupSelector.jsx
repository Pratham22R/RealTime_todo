import React from "react";
import { useNavigate } from "react-router-dom";
import { useGroup } from "../../contexts/GroupContext";

const GroupSelector = () => {
  const { groups, currentGroup, leaveGroup, loading, error } = useGroup();
  const navigate = useNavigate();

  if (loading && groups.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-600">
        <span className="animate-pulse">Loading groups...</span>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          No Groups Available
        </h3>
        <p className="text-gray-500 text-sm mt-2">
          You need to create or join a group first.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:opacity-90"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {currentGroup ? (
        <div className="rounded-xl shadow-md bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800">
              {currentGroup.name}
            </h4>
            <span className="text-sm text-gray-500">
              {currentGroup.members?.length || 0} members
            </span>
          </div>
          <button
            className="w-full py-2 mt-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
            onClick={async () => {
              try {
                await leaveGroup(currentGroup._id);
              } catch (err) {
                alert(
                  "Error leaving group: " +
                  (err?.response?.data?.error || err.message)
                );
              }
            }}
          >
            Leave Group
          </button>
        </div>
      ) : (
        <div className="text-center p-6 border rounded-xl bg-gray-50">
          <p className="text-gray-600">No group selected</p>
          <button
            className="mt-3 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => navigate("/dashboard")}
          >
            Select Group
          </button>
        </div>
      )}

      {currentGroup && (
        <div className="rounded-xl shadow-md bg-white p-5">
          <h4 className="font-semibold text-gray-800 mb-2">
            Invite to {currentGroup.name}
          </h4>
          <p className="text-sm text-gray-500 mb-3">
            Share this link with others:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={`${window.location.origin}/join/${currentGroup.inviteToken}`}
              readOnly
              className="flex-1 px-3 py-2 border rounded-lg text-gray-700 text-sm bg-gray-50"
            />
            <button
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
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
      )}
    </div>
  );
};

export default GroupSelector;
