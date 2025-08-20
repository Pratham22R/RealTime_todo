import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useGroup } from "../../contexts/GroupContext";

const JoinGroup = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { joinGroup, error } = useGroup();
  const [joinStatus, setJoinStatus] = useState("joining");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          redirectTo: `/join/${token}`,
          message: "Please log in to join the group",
        },
      });
      return;
    }

    if (token) {
      handleJoinGroup();
    }
  }, [token, isAuthenticated, navigate]);

  const handleJoinGroup = async () => {
    try {
      setJoinStatus("joining");
      await joinGroup(token);
      setJoinStatus("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setJoinStatus(err + " error");
    }
  };

  const renderContent = () => {
    switch (joinStatus) {
      case "joining":
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Joining Group...
            </h2>
            <p className="text-gray-500">
              Please wait while we add you to the group.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Successfully Joined!
            </h2>
            <p className="text-gray-500">
              You have been added to the group. Redirecting to the board...
            </p>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl font-bold">
              ✗
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Failed to Join Group
            </h2>
            <p className="text-gray-500">
              {error || "The invite link may be invalid or expired."}
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => navigate("/board")}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Go to Board
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
              >
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default JoinGroup;
