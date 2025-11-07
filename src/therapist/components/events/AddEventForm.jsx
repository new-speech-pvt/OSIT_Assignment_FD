import React, { useState, useEffect, useMemo } from "react";
import { axiosClient } from "../../../Utils/axiosClient";
import toast from "react-hot-toast";

const initialForm = {
  eventName: "",
  startDate: "",
  endDate: "",
  submissionExpiry: "",
  location: "",
};

const AddEventForm = ({
  onCancel,
  initialData = null,
  isEdit = false,
  updateEvents,
}) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddOrEditEvent = async (eventData, isEdit) => {
    setLoading(true);
    try {
      if (isEdit) {
        //  UPDATE existing event
        const response = await axiosClient.put(`/events/${eventData._id}`, {
          name: eventData.eventName,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          submissionExpiry: eventData.submissionExpiry,
          location: eventData.location,
        });

        const updatedEvent = response.data.data;
        console.log("Event updated:", updatedEvent);

        //  Replace the old event with updated one
        updateEvents(updatedEvent);

        toast.success("Event updated successfully!!");
      } else {
        //  CREATE new event
        const response = await axiosClient.post("/events", {
          name: eventData.eventName,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          submissionExpiry: eventData.submissionExpiry,
          location: eventData.location,
        });

        const newEvent = response.data.data;
        console.log("Event created:", newEvent);
        updateEvents(newEvent);
        toast.success("Event created successfully!!");
      }
      onCancel();
    } catch (error) {
      console.error(
        "Error saving event:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong while saving event!");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Prefill data when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        eventName: initialData.name || "",
        startDate: initialData.startDate?.split("T")[0] || "",
        endDate: initialData.endDate?.split("T")[0] || "",
        submissionExpiry: initialData.submissionExpiry || "",
        location: initialData.location || "",
      });
    }
  }, [initialData]);

  // 🟡 Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // 🔵 Deep comparison for accurate dirty check
  const isFormDirty = useMemo(() => {
    if (!isEdit || !initialData) return true; // Add mode -> always enabled

    const normalizeValue = (val) =>
      val === null || val === undefined ? "" : String(val).trim();

    const normalizedInitial = {
      eventName: normalizeValue(initialData.name),
      startDate: normalizeValue(initialData.startDate?.split("T")[0]),
      endDate: normalizeValue(initialData.endDate?.split("T")[0]),
      submissionExpiry: normalizeValue(initialData.submissionExpiry),
      location: normalizeValue(initialData.location),
    };

    const isSame = Object.keys(form).every(
      (key) =>
        normalizeValue(form[key]) === normalizeValue(normalizedInitial[key])
    );

    return !isSame; // dirty only if something differs
  }, [form, initialData, isEdit]);

  // 🧩 Validation
  const validate = () => {
    if (!form.eventName.trim()) return "Event name required";
    if (!form.startDate) return "Start date required";
    if (!form.endDate) return "End date required";
    if (form.startDate > form.endDate)
      return "Start date cannot be after end date";
    if (!form.location.trim()) return "Location required";
    return "";
  };

  // 🟢 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const newEvent = {
      ...initialData,
      eventName: form.eventName,
      startDate: form.startDate,
      endDate: form.endDate,
      submissionExpiry: form.submissionExpiry || "",
      location: form.location,
    };

    await handleAddOrEditEvent(newEvent, isEdit);
    setForm(initialForm);
  };

  // 🧱 UI
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 w-full md:w-[520px] bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-2">
        {isEdit ? "Edit Event" : "Add Event"}
      </h3>

      {error && (
        <div className="text-sm text-red-600 mb-4 bg-red-50 p-2 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-70 focus:border-primary-70 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-70 focus:border-primary-70 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-70 focus:border-primary-70 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Submission Expiry
          </label>
          <input
            name="submissionExpiry"
            value={form.submissionExpiry}
            onChange={handleChange}
            type="text"
            placeholder="Enter date or number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-70 focus:border-primary-70 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-70 focus:border-primary-70 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-500 hover:text-white transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!isFormDirty || loading}
          className={`px-5 py-2 rounded-lg font-medium transition-all disabled:bg-gray-300 disabled:text-gray-600 ${
            !isFormDirty
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-primary-70 hover:bg-primary-80 text-white"
          }`}
        >
          {isEdit
            ? loading
              ? "Updating"
              : "Update"
            : loading
            ? "Saving"
            : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AddEventForm;
