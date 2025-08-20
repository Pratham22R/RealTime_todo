import React from "react";
import { X, Trash2 } from "lucide-react";

const DeleteConfirmModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all sm:p-8">
        {/* Close Button */}
        <button
          onClick={onCancel}
          title="Cancel"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Trash2 size={28} />
        </div>

        {/* Title */}
        <h3 className="mt-4 text-center text-lg font-semibold text-gray-800 sm:text-xl">
          Delete Task?
        </h3>

        {/* Description */}
        <p className="mt-2 text-center text-sm text-gray-600 sm:text-base">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
