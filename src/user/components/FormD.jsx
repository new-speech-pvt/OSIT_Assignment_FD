import React, { useContext, useState } from "react";
import { OsitAssignmentContext } from "../contexts/OsitAssignmentContext";
import DatePicker from "../../components/Inputs/Datepicker";
import {
  Calendar,
  Plus,
  Minus,
  Target,
  Activity,
  MessageSquare
} from "lucide-react";

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
  const [errors, setErrors] = useState({});

  const updateInterventionPlan = (updatedPlan) => {
    setInterventionPlan(updatedPlan);
    localStorage.setItem("interventionPlan", JSON.stringify(updatedPlan));
    setSubmitStatus(null);
  };

  const handleWeekChange = (week, index, field, value) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    updatedWeek[index] = { ...updatedWeek[index], [field]: value };
    updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
  };

  const handleAddSession = (week) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    if (updatedWeek.length < 5) {
      updatedWeek.push({ ...initialSession });
      updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
      setActiveSession(updatedWeek.length - 1);
    }
  };

  const handleRemoveSession = (week, index) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    updatedWeek.splice(index, 1);
    updateInterventionPlan({ ...interventionPlan, [week]: updatedWeek });
    setActiveSession(Math.max(0, index - 1));
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

  const handleNextOrSubmit = async () => {
    setSubmitStatus("Submitting...");
    try {
      await handleFormCompletion();
    } catch (error) {
      console.error(error);
      setSubmitStatus("Submission failed");
    }
  };

  const inputClass =
    "w-full px-3 py-3 border border-body-30 rounded-lg text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 bg-white";

  const currentSessions = interventionPlan[activeWeek] || [];
  const currentSession = currentSessions[activeSession] || initialSession;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary-70 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-body-100">
            Intervention Plan
          </h2>
          <p className="text-body-50 text-sm">
            Weekly sessions and therapeutic activities
          </p>
        </div>
      </div>

      {/* WEEK TABS */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {weeks.map((week, i) => (
          <button
            key={week}
            onClick={() => {
              setActiveWeek(week);
              setActiveSession(0);
            }}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeWeek === week
                ? "bg-primary-100 text-white shadow"
                : "bg-body-20 text-body-70 hover:bg-body-30"
            }`}
          >
            Week {i + 1}
          </button>
        ))}
      </div>

      {/* SESSION TABS */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2 border-b pb-2">
          {currentSessions.map((_, sIndex) => (
            <button
              key={sIndex}
              onClick={() => setActiveSession(sIndex)}
              className={`px-3 py-1.5 rounded-t-lg text-sm transition-all ${
                activeSession === sIndex
                  ? "bg-ternary-70 text-white shadow"
                  : "bg-body-20 text-body-70 hover:bg-body-30"
              }`}
            >
              Session {sIndex + 1}
            </button>
          ))}
          {currentSessions.length < 5 && (
            <button
              onClick={() => handleAddSession(activeWeek)}
              className="flex items-center gap-1 text-primary-100 hover:bg-primary-50/20 px-3 py-1.5 rounded text-sm"
            >
              <Plus className="w-4 h-4" /> Add Session
            </button>
          )}
        </div>

        {/* ACTIVE SESSION FORM */}
        <div className="border border-body-30 rounded-lg p-5 mt-4 bg-body-20 space-y-4">
          {/* Date */}
          <div>
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
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
          <div>
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <Target className="w-4 h-4" /> Goals
            </label>
            {currentSession.goal?.map((g, gIndex) => (
              <div key={gIndex} className="flex gap-2 items-center mt-2">
                <input
                  type="text"
                  value={g}
                  onChange={(e) =>
                    handleGoalChange(activeWeek, activeSession, gIndex, e.target.value)
                  }
                  className={inputClass}
                  placeholder={`Goal ${gIndex + 1}`}
                />
                {currentSession.goal.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleWeekChange(activeWeek, activeSession, "goal", currentSession.goal.filter((_, i) => i !== gIndex))
                    }
                    className="text-error hover:bg-error/10 p-2 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {currentSession.goal?.length < 2 && (
              <button
                onClick={() => handleAddGoal(activeWeek, activeSession)}
                className="text-primary-100 hover:bg-primary-50/20 p-2 mt-2 rounded text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Goal
              </button>
            )}
          </div>

          {/* Activities */}
          <div>
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Activities
            </label>
            {currentSession.activity?.map((a, aIndex) => (
              <div key={aIndex} className="flex gap-2 items-center mt-2">
                <input
                  type="text"
                  value={a}
                  onChange={(e) =>
                    handleActivityChange(activeWeek, activeSession, aIndex, e.target.value)
                  }
                  className={inputClass}
                  placeholder={`Activity ${aIndex + 1}`}
                />
                {currentSession.activity.length > 1 && (
                  <button
                    onClick={() =>
                      handleWeekChange(
                        activeWeek,
                        activeSession,
                        "activity",
                        currentSession.activity.filter((_, i) => i !== aIndex)
                      )
                    }
                    className="text-error hover:bg-error/10 p-2 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {currentSession.activity?.length < 2 && (
              <button
                onClick={() => handleAddActivity(activeWeek, activeSession)}
                className="text-primary-100 hover:bg-primary-50/20 p-2 mt-2 rounded text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Activity
              </button>
            )}
          </div>

          {/* Tool */}
          <div>
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Tool
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
          <div>
            <label className="text-sm font-medium text-body-70 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Child Response
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
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-body-30">
        <button
          onClick={() => setActiveStep((p) => Math.max(p - 1, 0))}
          className="px-6 py-3 bg-body-30 text-body-70 rounded-lg font-semibold hover:bg-body-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextOrSubmit}
          className="px-6 py-3 bg-gradient-to-r from-primary-70 to-primary-100 text-white rounded-lg font-semibold hover:shadow-lg"
        >
          Submit Assignment
        </button>
      </div>

      {submitStatus && (
        <div
          className={`p-3 rounded-lg text-center ${
            submitStatus.includes("failed")
              ? "bg-error/20 text-error"
              : "bg-success/20 text-success"
          }`}
        >
          {submitStatus}
        </div>
      )}
    </div>
  );
};

export default FormD;
