import React, { useContext, useEffect, useState } from "react";
import { OsitAssignmentContext } from "../contexts/OsitAssignmentContext";
import DatePicker from "../../components/Inputs/Datepicker";
import {
  Calendar,
  Plus,
  Minus,
  Target,
  Activity,
  MessageSquare,
  Trash2,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FormD = () => {
  const {
    activeStep,
    setActiveStep,
    interventionPlan,
    setInterventionPlan,
    weeks,
    initialSession,
    submitStatus,
    setSubmitStatus,
    handleFormCompletion
  } = useContext(OsitAssignmentContext);

  const [activeWeek, setActiveWeek] = useState("week1");
  const [activeSession, setActiveSession] = useState(0);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [errors, setErrors] = useState({});
  const [validationMessages, setValidationMessages] = useState([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const updateInterventionPlan = (updatedPlan) => {
    setInterventionPlan(updatedPlan);
    localStorage.setItem("interventionPlan", JSON.stringify(updatedPlan));
    setSubmitStatus(null);
  };

  const visibleWeeks = Object.keys(interventionPlan).filter((w) => interventionPlan[w]);

  // Week removal handlers
  const handleRemoveWeek = (week) => {
    const weekSessions = interventionPlan[week] || [];
    const hasData = weekSessions.some((session) =>
      Object.values(session).some((v) => {
        if (Array.isArray(v)) return v.some((x) => x.trim() !== "");
        return v && v.trim?.() !== "";
      })
    );

    if (hasData) {
      setConfirmPopup({ type: "week", week });
    } else {
      removeWeekNow(week);
    }
  };

  const removeWeekNow = (week) => {
    const updated = { ...interventionPlan };
    delete updated[week];
    updateInterventionPlan(updated);
    setConfirmPopup(null);
    const remainingWeeks = Object.keys(updated);
    setActiveWeek(remainingWeeks[0] || null);
  };

  // Session removal handlers
  const handleRemoveSession = (week, index) => {
    const session = interventionPlan[week]?.[index];
    const hasData = Object.values(session).some((v) => {
      if (Array.isArray(v)) return v.some((x) => x.trim() !== "");
      return v && v.trim?.() !== "";
    });

    if (hasData) {
      setConfirmPopup({ type: "session", week, index });
    } else {
      removeSessionNow(week, index);
    }
  };

  const removeSessionNow = (week, index) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    updatedWeek.splice(index, 1);
    updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
    setActiveSession(Math.max(0, index - 1));
    setConfirmPopup(null);
  };

  // Update handlers
  const handleWeekChange = (week, index, field, value) => {
    setInterventionPlan((prev) => {
      const updatedWeek = [...(prev[week] || [])];
      updatedWeek[index] = { ...updatedWeek[index], [field]: value };
      const updatedPlan = { ...prev, [week]: updatedWeek };
      localStorage.setItem("interventionPlan", JSON.stringify(updatedPlan));
      setSubmitStatus(null);
      return updatedPlan;
    });
  };

  const handleAddSession = (week) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    if (updatedWeek.length < 5) {
      updatedWeek.push({ ...initialSession });
      updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
      setActiveSession(updatedWeek.length - 1);
    }
  };

  const handleGoalChange = (week, sIndex, gIndex, value) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const updatedGoals = [...updatedWeek[sIndex].goal];
    updatedGoals[gIndex] = value;
    updatedWeek[sIndex] = { ...updatedWeek[sIndex], goal: updatedGoals };
    updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
  };

  const handleAddGoal = (week, sIndex) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const goals = updatedWeek[sIndex]?.goal || [];
    if (goals.length < 2) {
      updatedWeek[sIndex] = { ...updatedWeek[sIndex], goal: [...goals, ""] };
      updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
    }
  };

  const handleActivityChange = (week, sIndex, aIndex, value) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const updatedActivities = [...updatedWeek[sIndex].activity];
    updatedActivities[aIndex] = value;
    updatedWeek[sIndex] = { ...updatedWeek[sIndex], activity: updatedActivities };
    updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
  };

  const handleAddActivity = (week, sIndex) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const activities = updatedWeek[sIndex]?.activity || [];
    if (activities.length < 2) {
      updatedWeek[sIndex] = {
        ...updatedWeek[sIndex],
        activity: [...activities, ""]
      };
      updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
    }
  };

  const handleNextOrSubmit = () => {
    if (validationMessages.length > 0) return;
    setShowSubmitConfirm(true);
  };

  // Validation logic
  const validatePlan = () => {
    const validationErrors = [];
    const totalWeeks = visibleWeeks.length;

    if (totalWeeks < 2) {
      validationErrors.push("At least 2 weeks are required in the plan.");
    }

    visibleWeeks.forEach((week, wIndex) => {
      const sessions = interventionPlan[week] || [];

      if (sessions.length < 1) {
        validationErrors.push(`Week ${wIndex + 1} must have at least 1 session.`);
      }

      sessions.forEach((session, sIndex) => {
        const missingFields = [];

        if (!session.date) missingFields.push("date");
        if (!session.tool?.trim()) missingFields.push("tool");
        if (!session.childResponse?.trim()) missingFields.push("child response");

        if (
          !Array.isArray(session.goal) ||
          session.goal.length === 0 ||
          session.goal.some((g) => !g.trim())
        ) {
          missingFields.push("goal(s)");
        }

        if (
          !Array.isArray(session.activity) ||
          session.activity.length === 0 ||
          session.activity.some((a) => !a.trim())
        ) {
          missingFields.push("activity(ies)");
        }

        if (missingFields.length > 0) {
          validationErrors.push(
            `Week ${wIndex + 1}, Session ${sIndex + 1}: Missing ${missingFields.join(", ")}.`
          );
        }
      });
    });

    return validationErrors;
  };

  useEffect(() => {
    const messages = validatePlan();
    setValidationMessages(messages);
  }, [interventionPlan]);

  const inputClass = "w-full px-3 py-3 border border-body-30 rounded-lg text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 bg-white placeholder-body-50 transition-all duration-200";

  const currentSessions = interventionPlan[activeWeek] || [];
  const currentSession = currentSessions[activeSession] || initialSession;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary-70 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-body-100">Intervention Plan</h2>
          <p className="text-body-50 text-sm">Weekly sessions and therapeutic activities</p>
        </div>
        {activeWeek && visibleWeeks.length > 1 && (
          <button
            onClick={() => handleRemoveWeek(activeWeek)}
            className="flex items-center gap-2 text-error hover:bg-error/10 px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Remove Week</span>
          </button>
        )}
      </motion.div>

      {/* Week Tabs */}
      <motion.div
        className="flex flex-wrap gap-2 border-b border-body-30 pb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {visibleWeeks.map((week, i) => (
          <button
            key={week}
            onClick={() => {
              setActiveWeek(week);
              setActiveSession(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeWeek === week
                ? "bg-primary-100 text-white shadow-lg"
                : "bg-body-20 text-body-70 hover:bg-body-30 hover:text-body-100"
            }`}
          >
            Week {i + 1}
          </button>
        ))}

        {visibleWeeks.length < 5 && (
          <button
            onClick={() => {
              const newWeekKey = `week${visibleWeeks.length + 1}`;
              updateInterventionPlan({
                ...interventionPlan,
                [newWeekKey]: [{ ...initialSession }],
              });
              setActiveWeek(newWeekKey);
              setActiveSession(0);
            }}
            className="flex items-center gap-2 text-primary-100 hover:bg-primary-50/20 px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Week
          </button>
        )}
      </motion.div>

      {/* Session Navigation & Content */}
      <motion.div
        className="bg-white rounded-xl border border-body-30 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Session Tabs */}
        <div className="bg-body-20 px-4 py-3 border-b border-body-30">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 flex-1">
              {currentSessions.map((_, sIndex) => (
                <button
                  key={sIndex}
                  onClick={() => setActiveSession(sIndex)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    activeSession === sIndex
                      ? "bg-ternary-70 text-white shadow-md"
                      : "bg-white text-body-70 hover:bg-body-30 hover:text-body-100"
                  }`}
                >
                  Session {sIndex + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentSessions.length < 5 && (
                <button
                  onClick={() => handleAddSession(activeWeek)}
                  className="flex items-center gap-1 text-primary-100 hover:bg-primary-50/20 px-2 py-1.5 rounded text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Session</span>
                </button>
              )}
              {currentSessions.length > 1 && (
                <button
                  onClick={() => handleRemoveSession(activeWeek, activeSession)}
                  className="flex items-center gap-1 text-error hover:bg-error/10 px-2 py-1.5 rounded text-sm transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Session Form */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <DatePicker
              value={currentSession.date || ""}
              callback={(e, val) =>
                handleWeekChange(activeWeek, activeSession, "date", val)
              }
              divClasses="h-12"
              inputClasses={inputClass}
            />
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goals
            </label>
            {currentSession.goal?.map((g, gIndex) => (
              <div key={gIndex} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={g}
                  onChange={(e) =>
                    handleGoalChange(activeWeek, activeSession, gIndex, e.target.value)
                  }
                  className={inputClass}
                  placeholder={`Goal ${gIndex + 1}`}
                />
              </div>
            ))}
            {currentSession.goal?.length < 2 && (
              <button
                onClick={() => handleAddGoal(activeWeek, activeSession)}
                className="text-primary-100 hover:bg-primary-50/20 p-2 rounded text-sm flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Goal
              </button>
            )}
          </div>

          {/* Activities */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activities
            </label>
            {currentSession.activity?.map((a, aIndex) => (
              <div key={aIndex} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={a}
                  onChange={(e) =>
                    handleActivityChange(activeWeek, activeSession, aIndex, e.target.value)
                  }
                  className={inputClass}
                  placeholder={`Activity ${aIndex + 1}`}
                />
              </div>
            ))}
            {currentSession.activity?.length < 2 && (
              <button
                onClick={() => handleAddActivity(activeWeek, activeSession)}
                className="text-primary-100 hover:bg-primary-50/20 p-2 rounded text-sm flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </button>
            )}
          </div>

          {/* Tool */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Tool
            </label>
            <input
              type="text"
              value={currentSession.tool || ""}
              onChange={(e) =>
                handleWeekChange(activeWeek, activeSession, "tool", e.target.value)
              }
              className={inputClass}
              placeholder="Enter tool used"
            />
          </div>

          {/* Child Response */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Child Response
            </label>
            <input
              type="text"
              value={currentSession.childResponse || ""}
              onChange={(e) =>
                handleWeekChange(activeWeek, activeSession, "childResponse", e.target.value)
              }
              className={inputClass}
              placeholder="Describe child's response"
            />
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-body-30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button
          onClick={() => setActiveStep((p) => Math.max(p - 1, 0))}
          className="flex items-center gap-2 px-6 py-3 bg-body-30 text-body-70 rounded-lg font-semibold hover:bg-body-50 transition-all duration-200 w-full sm:w-auto justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-3 relative w-full sm:w-auto justify-center">
          {/* Validation Indicator */}
          {validationMessages.length > 0 && (
            <button
              onClick={() => setShowValidationPopup((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-error/20 border border-error/30 flex items-center justify-center hover:bg-error/30 transition-colors"
              title="View validation details"
            >
              <AlertCircle className="w-4 h-4 text-error" />
            </button>
          )}

          <button
            onClick={handleNextOrSubmit}
            disabled={validationMessages.length > 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto justify-center ${
              validationMessages.length > 0
                ? "bg-body-30 text-body-50 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-70 to-primary-100 text-white hover:shadow-lg hover:from-primary-100 hover:to-primary-70"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Assignment
          </button>

          {/* Validation Popup */}
          <AnimatePresence>
            {showValidationPopup && validationMessages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-white shadow-xl rounded-xl border border-body-30 p-4 z-50"
              >
                <h4 className="font-semibold text-body-100 mb-2 flex justify-between items-center">
                  Validation Issues
                  <button
                    onClick={() => setShowValidationPopup(false)}
                    className="text-body-50 hover:text-error text-sm transition-colors"
                  >
                    ✕
                  </button>
                </h4>
                <ul className="list-disc pl-5 text-sm text-body-70 space-y-1 max-h-48 overflow-y-auto">
                  {validationMessages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Confirmation Popup */}
      <AnimatePresence>
        {confirmPopup && (
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
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center space-y-4"
            >
              <XCircle className="w-12 h-12 text-error mx-auto" />
              <h3 className="font-semibold text-lg text-body-100">
                Confirm Deletion
              </h3>
              <p className="text-body-70 text-sm">
                Are you sure you want to remove this{" "}
                <b>{confirmPopup.type === "week" ? "week" : "session"}</b>? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmPopup(null)}
                  className="px-4 py-2 rounded bg-body-30 text-body-70 font-semibold hover:bg-body-40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    confirmPopup.type === "week"
                      ? removeWeekNow(confirmPopup.week)
                      : removeSessionNow(confirmPopup.week, confirmPopup.index)
                  }
                  className="px-4 py-2 rounded bg-error text-white font-semibold flex items-center gap-1 hover:bg-error/90 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Confirmation Popup */}
      <AnimatePresence>
        {showSubmitConfirm && (
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
              <Calendar className="w-10 h-10 text-primary-100 mx-auto" />
              <h3 className="font-semibold text-lg text-body-100">
                Confirm Your Intervention Plan
              </h3>

              <p className="text-body-70 text-sm leading-relaxed">
                You can create up to <b>5 weeks</b> of intervention plan. <br />
                Currently, you've added <b>{visibleWeeks.length}</b> week
                {visibleWeeks.length > 1 ? "s" : ""}.
              </p>

              <p className="text-body-70 text-sm">
                If you wish to add more, click <b>"Add More Weeks"</b>. <br />
                Otherwise, click <b>"Submit Now"</b> to finalize and submit.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 rounded bg-body-30 text-body-70 font-semibold hover:bg-body-40 transition-colors"
                >
                  Add More Weeks
                </button>
                <button
                  onClick={async () => {
                    setShowSubmitConfirm(false);
                    setSubmitStatus("Submitting...");
                    try {
                      await handleFormCompletion();
                    } catch (error) {
                      console.error(error);
                      setSubmitStatus("Submission failed");
                    }
                  }}
                  className="px-4 py-2 rounded bg-primary-100 text-white font-semibold flex items-center gap-1 justify-center hover:bg-primary-90 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Submit Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Validation Help Popup (Modal Style) */}
<AnimatePresence>
  {showValidationPopup && validationMessages.length > 0 && (
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
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-center"
      >
        <AlertCircle className="w-10 h-10 text-error mx-auto" />
        <h3 className="font-semibold text-lg text-body-100">
          Incomplete or Invalid Plan
        </h3>
        <p className="text-body-70 text-sm">
          Please review the following missing or invalid fields before
          proceeding. Each listed issue must be resolved to enable submission.
        </p>

        <div className="border border-body-30 rounded-lg p-3 text-left max-h-48 overflow-y-auto bg-body-20">
          <ul className="list-disc pl-5 text-sm text-body-70 space-y-1">
            {validationMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center pt-3">
          <button
            onClick={() => setShowValidationPopup(false)}
            className="px-5 py-2 rounded bg-primary-100 text-white font-semibold hover:bg-primary-90 transition-colors"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* Fullscreen Submission Loader */}
<AnimatePresence>
  {submitStatus === "Submitting..." && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-[9999]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center space-y-6"
      >
        {/* Glowing circular loader */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-t-transparent border-primary-100 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary-100 animate-pulse" />
          </div>
        </div>

        {/* Animated text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-xl font-semibold tracking-wide"
        >
          Submitting your OSIT Assignment...
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-200 text-sm"
        >
          Please wait a moment
        </motion.p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
};

export default FormD;