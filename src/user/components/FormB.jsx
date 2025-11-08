import React, { useContext, useRef, useState, useEffect } from "react";
import DatePicker from "../../components/Inputs/Datepicker";
import JoditEditor from "jodit-react";
import { OsitAssignmentContext } from "../contexts/OsitAssignmentContext";
import { Heart, AlertCircle } from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

const FormB = () => {
  const contextValue = useContext(OsitAssignmentContext);
  const editorRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const {
    activeStep,
    setActiveStep,
    childProfile,
    setChildProfile,
    steps,
    eventData,
    selectedEvent,
    setSelectedEvent,
  } = contextValue;

  const getSubmissionDate = (endDate, submissionExpiry) => {
    if (!endDate || !submissionExpiry) return "N/A";
    return moment(endDate).add(submissionExpiry, "days").format("DD-MMM-YYYY");
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    const missing = [];

    if (!selectedEvent?.trim()) {
      newErrors.event = "Event required";
      missing.push("Event");
    }
    if (!childProfile.fName?.trim()) {
      newErrors.fName = "First name required";
      missing.push("First name");
    }
    if (!childProfile.lName?.trim()) {
      newErrors.lName = "Last name required";
      missing.push("Last name");
    }
    if (!childProfile.dob) {
      newErrors.dob = "Date of Birth required";
      missing.push("Date of Birth");
    }
    if (!childProfile.gender) {
      newErrors.gender = "Gender required";
      missing.push("Gender");
    }
    if (!childProfile.diagnosis?.trim()) {
      newErrors.diagnosis = "Diagnosis required";
      missing.push("Diagnosis");
    }
    if (!childProfile.presentComplaint?.trim()) {
      newErrors.presentComplaint = "Present complaint required";
      missing.push("Present Complaint");
    }
    if (
      !childProfile.medicalHistory ||
      !childProfile.medicalHistory.replace(/<[^>]*>/g, "").trim()
    ) {
      newErrors.medicalHistory = "Medical history required";
      missing.push("Medical History");
    }

    setErrors(newErrors);
    setMissingFields(missing);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [childProfile, selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...childProfile, [name]: value };
    setChildProfile(updated);
    localStorage.setItem("childProfile", JSON.stringify(updated));
    setSubmitStatus(null);
  };

  const handleDob = (e, val) => {
    if (!val) return;
    const formattedDob =
      typeof val === "string" ? val : moment(val).format("DD-MM-YYYY");
    setChildProfile((prev) => {
      const updated = { ...prev, dob: formattedDob };
      localStorage.setItem("childProfile", JSON.stringify(updated));
      return updated;
    });
  };

  const handlePrevious = () => setActiveStep((p) => Math.max(p - 1, 0));

  const handleNext = () => {
    if (!validateForm()) return;
    setSubmitStatus("✅ Form saved successfully");
    setActiveStep((p) => Math.min(p + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };

  const inputClass =
    "w-full px-3 py-3 border border-body-30 rounded-lg text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 bg-white";

  const joditConfig = {
    readonly: false,
    height: 200,
    toolbarAdaptive: false,
    buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "undo", "redo"],
    placeholder: "Enter medical history...",
  };

  return (
    <div className="w-full space-y-6">
      {/* Event Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-body-100">
          Select Event <span className="text-error">*</span>
        </label>
        <div className="relative">
          <select
            name="event"
            value={selectedEvent || ""}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className={`appearance-none w-full px-4 py-3 pr-10 border-2 rounded-xl bg-white text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-70 ${
              errors.event ? "border-error" : "border-body-30"
            }`}
          >
            <option value="">-- Select an Event --</option>
            {eventData.length > 0 ? (
              eventData.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} (Last Date: {getSubmissionDate(d.endDate, d.submissionExpiry)})
                </option>
              ))
            ) : (
              <option disabled>No events available</option>
            )}
          </select>
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-body-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {errors.event && <p className="text-error text-sm mt-1">{errors.event}</p>}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-ternary-70 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-body-100">Child Profile Information</h2>
          <p className="text-body-50 text-sm">Patient details and medical background</p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label>First Name *</label><input name="fName" value={childProfile.fName} onChange={handleChange} className={inputClass} /></div>
        <div><label>Middle Name</label><input name="mName" value={childProfile.mName} onChange={handleChange} className={inputClass} /></div>
        <div><label>Last Name *</label><input name="lName" value={childProfile.lName} onChange={handleChange} className={inputClass} /></div>
      </div>

      <div>
        <label>Date of Birth *</label>
        <DatePicker value={childProfile.dob || ""} callback={handleDob} inputClasses={inputClass} disableFuture />
      </div>

      <div>
        <label>Gender *</label>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2">
              <input type="radio" name="gender" value={g} checked={childProfile.gender === g} onChange={handleChange} className="accent-primary-100" />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label>Primary Diagnosis *</label><input name="diagnosis" value={childProfile.diagnosis} onChange={handleChange} className={inputClass} /></div>
        <div><label>Present Complaint *</label><input name="presentComplaint" value={childProfile.presentComplaint} onChange={handleChange} className={inputClass} /></div>
      </div>

      <div>
        <label>Medical History *</label>
        <div className="border border-body-30 rounded-lg overflow-hidden">
          <JoditEditor ref={editorRef} value={childProfile.medicalHistory || ""} config={joditConfig} onBlur={(val) => handleChange({ target: { name: "medicalHistory", value: val } })} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-body-30">
        <button
          onClick={handlePrevious}
          disabled={activeStep === 0}
          className="px-6 py-3 bg-body-30 text-body-70 rounded-lg font-semibold hover:bg-body-50 disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          {missingFields.length > 0 && (
            <button
              onClick={() => setShowHelp(true)}
              className="w-8 h-8 rounded-full bg-error/10 border border-error/30 flex items-center justify-center hover:bg-error/20 transition-colors animate-pulse"
              title="Show missing fields"
            >
              <AlertCircle className="w-4 h-4 text-error" />
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={missingFields.length > 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              missingFields.length > 0
                ? "bg-body-30 text-body-50 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-70 to-primary-100 text-white hover:shadow-lg"
            }`}
          >
            Save & Continue
          </button>
        </div>
      </div>

      {/* ✅ Centered Modal Popup like FormD */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center space-y-4"
            >
              <AlertCircle className="w-10 h-10 text-error mx-auto" />
              <h3 className="font-semibold text-lg text-body-100">Missing Fields</h3>
              <p className="text-body-70 text-sm">
                Please fill the following required fields before proceeding:
              </p>
              <div className="border border-body-30 rounded-lg p-3 text-left max-h-48 overflow-y-auto bg-body-20">
                <ul className="list-disc pl-5 text-sm text-body-70 space-y-1">
                  {missingFields.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center pt-3">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-5 py-2 rounded bg-primary-100 text-white font-semibold hover:bg-primary-90 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {submitStatus && (
        <div className="p-3 bg-success/20 border border-success rounded-lg text-success text-sm text-center">
          {submitStatus}
        </div>
      )}
    </div>
  );
};

export default FormB;
