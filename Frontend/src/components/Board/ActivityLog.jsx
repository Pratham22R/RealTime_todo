import { useState, useEffect, useRef, useCallback } from "react";
import { actionsAPI, usersAPI, tasksAPI } from "../../services/api";
import { useGroup } from "../../contexts/GroupContext";
import socketService from "../../services/socket";
import {
  FileText,
  Edit,
  Trash2,
  UserPlus,
  LogIn,
  RefreshCw,
} from "lucide-react";

const PAGE_SIZE = 20;

const ActivityLog = () => {
  const { currentGroup } = useGroup();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const loadingRef = useRef(false);

  const loadActivities = useCallback(
    async (pageNum = 1) => {
      if (!currentGroup || loadingRef.current) return;
      loadingRef.current = true;
      try {
        setLoading(true);
        const response = await actionsAPI.getAll(currentGroup._id, {
          page: pageNum,
          limit: PAGE_SIZE,
        });

        let newData = response.data || [];

        // Fetch all users once
        const userRes = await usersAPI.getAll();
        const usersMap = {};
        userRes.data.forEach((u) => {
          usersMap[u._id] = u;
        });

        // Replace user IDs with user objects
        newData = newData.map((log) => {
          if (typeof log.user === "string") {
            return { ...log, user: usersMap[log.user] || { username: "Unknown" } };
          }
          return log;
        });

        if (pageNum === 1) {
          setActivities(newData);
        } else {
          setActivities((prev) => [...prev, ...newData]);
        }

        setHasMore(newData.length === PAGE_SIZE);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [currentGroup]
  );


  // Initial + refresh
  useEffect(() => {
    if (!currentGroup) return;
    socketService.connect();
    setPage(1);
    loadActivities(1);

    const handleActivityLog = async (log) => {
      let enrichedLog = { ...log };

      try {
        // Ensure user is full object
        if (typeof enrichedLog.user === "string") {
          const userRes = await usersAPI.getAll();
          const found = userRes.data.find((u) => u._id === enrichedLog.user);
          if (found) enrichedLog.user = found;
          else enrichedLog.user = { username: "Unknown" };
        }

        // Ensure task is full object
        if (typeof enrichedLog.taskId === "string") {
          const taskRes = await tasksAPI.get(enrichedLog.taskId);
          if (taskRes.data) enrichedLog.taskId = taskRes.data;
        }
      } catch (err) {
        console.error("Error enriching activity log:", err);
      }

      // prepend real-time updates
      setActivities((prev) => [enrichedLog, ...prev]);
    };


    socketService.offActivityLogUpdated();
    socketService.onActivityLogUpdated(handleActivityLog);

    return () => {
      socketService.offActivityLogUpdated();
    };
  }, [currentGroup, loadActivities]);

  // Infinite Scroll handler
  const handleScroll = () => {
    if (!listRef.current || loadingRef.current || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prev) => {
        const nextPage = prev + 1;
        loadActivities(nextPage);
        return nextPage;
      });
    }
  };

  useEffect(() => {
    const ref = listRef.current;
    if (!ref) return;
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  // Utils
  const getActionIcon = (action) => {
    switch (action) {
      case "Task created":
        return <FileText size={16} />;
      case "Task updated":
        return <Edit size={16} />;
      case "Task deleted":
        return <Trash2 size={16} />;
      case "User registered":
        return <UserPlus size={16} />;
      case "User logged in":
        return <LogIn size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Task created":
        return "bg-green-100 text-green-600";
      case "Task updated":
        return "bg-blue-100 text-blue-600";
      case "Task deleted":
        return "bg-red-100 text-red-600";
      case "User registered":
        return "bg-yellow-100 text-yellow-600";
      case "User logged in":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  };

  const formatDetails = (details) => {
    if (!details) return "";
    const taskMatch = details.match(/:\s*(.+)$/);
    return taskMatch ? taskMatch[1] : details;
  };

  if (!currentGroup) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>Select a group to view activities</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 border-b border-gray-200">
        <button
          onClick={() => {
            setPage(1);
            loadActivities(1);
          }}
          title="Refresh activities"
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <RefreshCw size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Activity List */}
      <div
        ref={listRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto"
        style={{ overscrollBehavior: "contain" }}
      >
        {activities.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No activities yet</p>
            <small className="text-gray-400">
              Actions will appear here as they happen
            </small>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity._id || index}
              className="flex items-start p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100"
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${getActionColor(
                  activity.action
                )}`}
              >
                {getActionIcon(activity.action)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-semibold text-gray-800">
                    {activity.user?.username || "Unknown User"}
                  </span>{" "}
                  <span className="text-gray-600">
                    {activity.action.toLowerCase()}
                  </span>
                  {activity.taskId && (
                    <span className="italic text-gray-700">
                      {" "}
                      "{activity.taskId.title || "Unknown Task"}"
                    </span>
                  )}
                </div>

                {activity.details && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDetails(activity.details)}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loader at bottom */}
        {loading && (
          <div className="flex justify-center py-4 text-gray-500">
            Loading more...
          </div>
        )}
        {!hasMore && activities.length > 0 && (
          <div className="flex justify-center py-4 text-gray-400 text-sm">
            No more activities
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
