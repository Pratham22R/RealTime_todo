import { useState, useEffect, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Edit, Trash2, UserPlus } from "lucide-react";
import gsap from "gsap";

const TaskCard = ({ task, index, onEdit, onDelete, onSmartAssign, isMoving }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dateRef = useRef(null);
  const actionsRef = useRef(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Animate with GSAP
  useEffect(() => {
    if (isHovered) {
      gsap.to(dateRef.current, {
        x: 50, // move out smoothly
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(actionsRef.current, {
        opacity: 1,
        x: 0,
        pointerEvents: "auto",
        duration: 0.4,
        ease: "power2.out",
        delay: 0.1,
      });
    } else {
      gsap.to(dateRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
        delay: 0.1,
      });
      gsap.to(actionsRef.current, {
        opacity: 0,
        x: 30, // slide out smoothly
        pointerEvents: "none",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isHovered]);


  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 
            hover:shadow-md ${snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400" : ""} 
            ${isMoving ? "opacity-70" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Moving overlay */}
          {isMoving && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10 rounded-xl">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-gray-800 text-base sm:text-lg">{task.title}</h3>
            <div
              className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${getPriorityColor(
                task.priority
              )}`}
            >
              {getPriorityLabel(task.priority)}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="mt-2 text-sm text-gray-600">{task.description}</p>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {task.assignedUser && (
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {task.assignedUser.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-sm text-gray-700">
                    {task.assignedUser.username}
                  </span>
                </div>
              )}
            </div>

            {/* Animate container (date + actions share same space) */}
            <div className="relative flex items-center justify-end w-40 overflow-hidden">
              {/* Date */}
              <div
                ref={dateRef}
                className="absolute right-0 whitespace-nowrap text-xs text-gray-500"
              >
                {formatDate(task.updatedAt)}
              </div>

              {/* Actions */}
              <div
                ref={actionsRef}
                className="flex gap-2 opacity-0 pointer-events-none"
              >
                <button
                  onClick={() => onEdit(task)}
                  title="Edit task"
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onSmartAssign(task._id)}
                  title="Smart Assign"
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-green-600 transition"
                >
                  <UserPlus size={16} />
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  title="Delete task"
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>


          {/* Version Indicator */}
          <div className="mt-2 text-right text-[10px] text-gray-400">v{task.version}</div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
