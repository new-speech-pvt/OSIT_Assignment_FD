import React, { useState, useEffect, useMemo } from "react";
import { axiosClient } from "../../../Utils/axiosClient";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, X, Loader2, CalendarDays } from "lucide-react";

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
  const [focusedField, setFocusedField] = useState(null);

  const handleAddOrEditEvent = async (eventData, isEdit) => {
    setLoading(true);
    try {
      if (isEdit) {
        // UPDATE existing event
        const response = await axiosClient.put(`/events/${eventData._id}`, {
          name: eventData.eventName,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          submissionExpiry: eventData.submissionExpiry,
          location: eventData.location,
        });

        const updatedEvent = response.data.data;
        updateEvents(updatedEvent);
        toast.success("Event updated successfully!");
      } else {
        // CREATE new event
        const response = await axiosClient.post("/events", {
          name: eventData.eventName,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          submissionExpiry: eventData.submissionExpiry,
          location: eventData.location,
        });

        const newEvent = response.data.data;
        updateEvents(newEvent);
        toast.success("Event created successfully!");
      }
      onCancel();
    } catch (error) {
      console.error("Error saving event:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong while saving event!");
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (error) setError("");
  };

  const isFormDirty = useMemo(() => {
    if (!isEdit || !initialData) return true;

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

    return !isSame;
  }, [form, initialData, isEdit]);

  const validate = () => {
    if (!form.eventName.trim()) return "Event name is required";
    if (!form.startDate) return "Start date is required";
    if (!form.endDate) return "End date is required";
    if (form.startDate > form.endDate)
      return "Start date cannot be after end date";
    if (!form.location.trim()) return "Location is required";

    if (form.submissionExpiry && isNaN(form.submissionExpiry)) {
      return "Submission expiry must be a number";
    }
    if (form.submissionExpiry && parseInt(form.submissionExpiry) < 0) {
      return "Submission expiry must be a positive number";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh] flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-70 to-primary-100 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? "Edit Event" : "Create New Event"}
              </h2>
              <p className="text-white/80 text-sm">
                {isEdit
                  ? "Update event details"
                  : "Add a new event to your schedule"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-8 overflow-y-auto flex-1 touch-pan-y overscroll-contain"
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-ternary-100/10 border border-ternary-100/20 rounded-xl text-ternary-100 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Event Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-body-100 mb-3">
              Event Name *
            </label>
            <div className="relative">
              <input
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                onFocus={() => setFocusedField("eventName")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter event name"
                className={`w-full px-4 py-3 bg-body-20 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  focusedField === "eventName"
                    ? "border-primary-70 bg-white shadow-md"
                    : "border-transparent hover:border-body-30"
                }`}
              />
            </div>
          </motion.div>

          {/* Date Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-body-100 mb-3">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-body-50" />
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("startDate")}
                  onBlur={() => setFocusedField(null)}
                  min={today}
                  className={`w-full pl-10 pr-4 py-3 bg-body-20 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    focusedField === "startDate"
                      ? "border-primary-70 bg-white shadow-md"
                      : "border-transparent hover:border-body-30"
                  }`}
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-body-100 mb-3">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-body-50" />
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("endDate")}
                  onBlur={() => setFocusedField(null)}
                  min={form.startDate || today}
                  className={`w-full pl-10 pr-4 py-3 bg-body-20 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    focusedField === "endDate"
                      ? "border-primary-70 bg-white shadow-md"
                      : "border-transparent hover:border-body-30"
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Submission Expiry */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-body-100 mb-3">
              Submission Expiry (Days)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-body-50" />
              <input
                name="submissionExpiry"
                value={form.submissionExpiry}
                onChange={handleChange}
                onFocus={() => setFocusedField("submissionExpiry")}
                onBlur={() => setFocusedField(null)}
                type="number"
                min="0"
                placeholder="Enter number of days"
                className={`w-full pl-10 pr-4 py-3 bg-body-20 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  focusedField === "submissionExpiry"
                    ? "border-primary-70 bg-white shadow-md"
                    : "border-transparent hover:border-body-30"
                }`}
              />
            </div>
            <p className="text-body-50 text-xs mt-2">
              Number of days after event end date when submissions expire
            </p>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-body-100 mb-3">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-body-50" />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                onFocus={() => setFocusedField("location")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter event location"
                className={`w-full pl-10 pr-4 py-3 bg-body-20 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  focusedField === "location"
                    ? "border-primary-70 bg-white shadow-md"
                    : "border-transparent hover:border-body-30"
                }`}
              />
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t border-body-30"
        >
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 border-2 border-body-30 text-body-70 rounded-xl font-semibold hover:bg-body-20 transition-all duration-200 cursor-pointer flex-1 sm:flex-none"
          >
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            disabled={(!isFormDirty && isEdit) || loading}
            whileHover={
              (!isFormDirty && isEdit) || loading ? {} : { scale: 1.02 }
            }
            whileTap={
              (!isFormDirty && isEdit) || loading ? {} : { scale: 0.98 }
            }
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-none ${
              (!isFormDirty && isEdit) || loading
                ? "bg-body-30 text-body-50 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-70 to-primary-100 text-white hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddEventForm;
