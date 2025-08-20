import React, { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";
import { useNavigate } from "react-router-dom";
import { useGroup } from "../../contexts/GroupContext";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Users, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    groups,
    currentGroup,
    selectGroup,
    joinGroup,
    leaveGroup,
    createGroup,
    loading,
    error,
  } = useGroup();

  const [joinUrl, setJoinUrl] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!joinUrl.trim()) return;

    try {
      setJoining(true);
      setJoinError("");

      const urlParts = joinUrl.trim().split("/");
      const token = urlParts[urlParts.length - 1];

      if (!token) {
        setJoinError("Invalid invite URL. Please check the link.");
        return;
      }

      await joinGroup(token);
      setJoinUrl("");
    } catch (err) {
      setJoinError(err.response?.data?.error || "Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  const handleGroupClick = (group) => {
    selectGroup(group);
    navigate("/board");
  };

  const handleCreateGroupSubmit = async (groupName) => {
    setCreating(true);
    try {
      await createGroup({ name: groupName });
      setShowCreateModal(false);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-medium">Loading your dashboard...</p>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your groups and collaborate with your team
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Create New Group
          </button>
        </div>

        {/* Join Group Section */}
        <div className="bg-white shadow rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Join a Group</h2>
          <p className="text-gray-500 mb-4 text-sm">
            Paste an invite link to join a group
          </p>
          <form
            onSubmit={handleJoinGroup}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="url"
              placeholder="https://yourapp.com/join/abc123..."
              value={joinUrl}
              onChange={(e) => setJoinUrl(e.target.value)}
              disabled={joining}
              className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={joining || !joinUrl.trim()}
              className="bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700 transition disabled:opacity-50"
            >
              {joining ? "Joining..." : "Join Group"}
            </button>
          </form>
          {joinError && (
            <div className="text-red-600 mt-2 text-sm font-medium">
              {joinError}
            </div>
          )}
        </div>

        {/* Groups Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Groups</h2>
          {groups.length === 0 ? (
            <div className="bg-gray-50 border rounded-2xl p-8 flex flex-col items-center text-center">
              <Users size={48} className="text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No groups yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first group or join an existing one to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div
                  key={group._id}
                  onClick={() => handleGroupClick(group)}
                  className={`p-5 border rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition ${
                    currentGroup?._id === group._id
                      ? "border-blue-500 bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">{group.name}</h3>
                    <span className="text-sm text-gray-500">
                      {group.members?.length || 0} members
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      {group.creator === user?.id ? "Creator" : "Member"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Are you sure you want to leave "${group.name}"?`
                            )
                          ) {
                            await leaveGroup(group._id);
                          }
                        }}
                        className="text-red-500 hover:text-red-600 font-bold"
                        title="Leave Group"
                      >
                        ×
                      </button>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mt-6 rounded-xl">
            <p className="mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
