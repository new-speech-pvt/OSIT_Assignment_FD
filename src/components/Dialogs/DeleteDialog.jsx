import React, { useState } from "react";
import Dialog from "../Common/Dialog"; // 👈 apne path ke hisab se adjust kar lena
import { RxCross2 } from "react-icons/rx";
import { Trash2 } from "lucide-react";
import { axiosClient } from "../../Utils/axiosClient";

const DeleteDialog = ({ open, onClose, eventId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/events/${eventId}`);
      onDeleteSuccess?.(eventId); // parent me UI update karne ke liye callback
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog onclose={onClose} showIcon={false} clickAwayToClose={true} width="400px">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trash2 className="text-red-500 w-6 h-6" />
            <h2 className="text-lg font-semibold text-red-600">Delete Event</h2>
          </div>
          <RxCross2
            onClick={onClose}
            size={22}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          />
        </div>

        {/* Body */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Are you sure you want to delete this event? <br />
          <span className="text-sm text-gray-500">
            This action cannot be undone.
          </span>
        </p>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-70"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
