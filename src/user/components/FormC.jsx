import React, { useState, useCallback, useContext, useRef, useEffect } from "react";
import { OsitAssignmentContext } from "../contexts/OsitAssignmentContext";
import JoditEditor from "jodit-react";
import { FileText, Target, Calendar, Settings, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FormC = () => {
  const { activeStep, setActiveStep, assignmentDetail, setAssignmentDetails, steps } =
    useContext(OsitAssignmentContext);

  const [errors, setErrors] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const editorRef = useRef(null);

  // 🧩 Strip HTML for validation
  const stripHtml = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    return text;
  };

  // 🧩 Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    const missing = [];

    const fields = [
      { key: "problemStatement", label: "Problem Statement" },
      { key: "identificationAndObjectiveSetting", label: "Identification & Objective Setting" },
      { key: "planningAndToolSection", label: "Planning & Tool Selection" },
      { key: "toolStrategiesApproaches", label: "Tool Strategies & Approaches" },
    ];

    fields.forEach(({ key, label }) => {
      const content = assignmentDetail[key];
      const cleaned = stripHtml(content);
      if (!cleaned) {
        newErrors[key] = "Required";
        missing.push(label);
      }
    });

    setErrors(newErrors);
    setMissingFields(missing);
    return Object.keys(newErrors).length === 0;
  }, [assignmentDetail]);

  useEffect(() => {
    validateForm();
  }, [assignmentDetail, validateForm]);

  // 🧩 Handle field change
  const handleChange = (fieldName, newContent) => {
    const updated = { ...assignmentDetail, [fieldName]: newContent };
    setAssignmentDetails(updated);
    localStorage.setItem("assignmentDetail", JSON.stringify(updated));
    setSubmitStatus(null);
  };

  const handlePrevious = () => setActiveStep((p) => Math.max(p - 1, 0));

  const handleNextOrSubmit = () => {
    if (!validateForm()) return;
    setSubmitStatus("✅ Form saved successfully");
    setActiveStep((p) => Math.min(p + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };

  // 🧩 Editor config
  const joditConfig = {
    readonly: false,
    height: 180,
    toolbarAdaptive: false,
    buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "undo", "redo"],
  };

  // 🧩 Editor sections
  const sections = [
    { key: "problemStatement", label: "Problem Statement", icon: FileText },
    { key: "identificationAndObjectiveSetting", label: "Identification & Objective Setting", icon: Target },
    { key: "planningAndToolSection", label: "Planning & Tool Selection", icon: Calendar },
    { key: "toolStrategiesApproaches", label: "Tool Strategies & Approaches", icon: Settings },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-70 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-body-100">Assignment Details</h2>
      </div>

      {/* Sections */}
      {sections.map((s) => (
        <div key={s.key} className="space-y-2">
          <label className="text-sm font-medium text-body-70 flex items-center gap-2">
            <s.icon className="w-4 h-4" /> {s.label} <span className="text-error">*</span>
          </label>
          <div className="border border-body-30 rounded-lg overflow-hidden">
            <JoditEditor
              ref={editorRef}
              value={assignmentDetail[s.key] || ""}
              config={joditConfig}
              onBlur={(newContent) => handleChange(s.key, newContent)}
            />
          </div>
          {errors[s.key] && <p className="text-error text-sm mt-1">{errors[s.key]}</p>}
        </div>
      ))}

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
          {/* Help Button */}
          {missingFields.length > 0 && (
            <button
              onClick={() => setShowHelp(true)}
              className="w-8 h-8 rounded-full bg-error/10 border border-error/30 flex items-center justify-center hover:bg-error/20 transition-colors animate-pulse"
              title="Show missing fields"
            >
              <AlertCircle className="w-4 h-4 text-error" />
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={handleNextOrSubmit}
            disabled={missingFields.length > 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              missingFields.length > 0
                ? "bg-body-30 text-body-50 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-70 to-primary-100 text-white hover:shadow-lg hover:from-primary-100 hover:to-primary-70"
            }`}
          >
            Save & Continue
          </button>
        </div>
      </div>

      {/* ✅ Centered Help Popup (FormD-style) */}
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
                Please complete the following sections before continuing:
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

      {/* Success message */}
      {submitStatus && (
        <div className="p-3 bg-success/20 border border-success rounded-lg text-success text-sm text-center">
          {submitStatus}
        </div>
      )}
    </div>
  );
};

export default FormC;
