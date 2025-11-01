import React, { useContext, useState, useRef, useEffect } from "react";
import { OsitAssignmentContext } from "../contexts/OsitAssignmentContext";
import DatePicker from "../../components/Inputs/Datepicker";
import { Calendar, Plus, Minus, Target, Activity, MessageSquare, Wrench } from "lucide-react";

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

  const [expandedWeek, setExpandedWeek] = useState("week1");
  const [errors, setErrors] = useState({});
  const weekRefs = useRef({});

  // Scroll prevention effect
  useEffect(() => {
    const handleScroll = (e) => {
      // Prevent automatic scrolling when weeks expand/collapse
      if (e.target.closest('[data-prevent-scroll]')) {
        e.preventDefault();
      }
    };

    document.addEventListener('scroll', handleScroll, true);
    return () => document.removeEventListener('scroll', handleScroll, true);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!interventionPlan.mentionToolUsedForRespectiveGoal?.trim()) {
      newErrors.mentionToolUsedForRespectiveGoal = "Required";
    }

    weeks.forEach((week) => {
      const sessions = interventionPlan[week] || [];
      if (sessions.length < 1 || sessions.length > 5) {
        newErrors[week] = "1-5 sessions required";
      }

      sessions.forEach((session, sIndex) => {
        if (!session.goal || session.goal.length < 1 || session.goal.length > 2 || session.goal.some(g => !g.trim())) {
          newErrors[`${week}_s${sIndex}_goals`] = "1-2 filled goals required";
        }
        if (!session.activity || session.activity.length < 1 || session.activity.length > 2 || session.activity.some(a => !a.trim())) {
          newErrors[`${week}_s${sIndex}_activities`] = "1-2 filled activities required";
        }
        if (!session.childResponse?.trim()) {
          newErrors[`${week}_s${sIndex}_childResponse`] = "Required";
        }
        if (!session.date) {
          newErrors[`${week}_s${sIndex}_date`] = "Required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleWeek = (week) => {
    // Store current scroll position
    const currentScroll = window.scrollY;
    
    setExpandedWeek(prev => {
      const newExpandedWeek = prev === week ? "" : week;
      
      // Restore scroll position after state update
      setTimeout(() => {
        window.scrollTo(0, currentScroll);
      }, 0);
      
      return newExpandedWeek;
    });
  };

  const updateInterventionPlan = (updatedPlan) => {
    setInterventionPlan(updatedPlan);
    localStorage.setItem("interventionPlan", JSON.stringify(updatedPlan));
    setSubmitStatus(null);
  };

  const handleWeekChange = (week, index, field, value) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    updatedWeek[index] = { ...updatedWeek[index], [field]: value };
    const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
    updateInterventionPlan(updatedPlan);
    setSubmitStatus(null);
  };

  const handleAddSession = (week) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    if (updatedWeek.length < 5) {
      updatedWeek.push({ ...initialSession });
      const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
      updateInterventionPlan(updatedPlan);
    }
  };

  const handleRemoveSession = (week, index) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    if (updatedWeek.length > 1) {
      updatedWeek.splice(index, 1);
      const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
      updateInterventionPlan(updatedPlan);
    }
  };

  const handleAddGoal = (week, sIndex) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const currentGoals = updatedWeek[sIndex]?.goal || [];
    if (currentGoals.length < 2) {
      updatedWeek[sIndex] = { ...updatedWeek[sIndex], goal: [...currentGoals, ""] };
      const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
      updateInterventionPlan(updatedPlan);
    }
  };

  const handleRemoveGoal = (week, sIndex, gIndex) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const currentGoals = updatedWeek[sIndex]?.goal || [];
    if (currentGoals.length > 1) {
      updatedWeek[sIndex] = { ...updatedWeek[sIndex], goal: currentGoals.filter((_, i) => i !== gIndex) };
      const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
      updateInterventionPlan(updatedPlan);
    }
  };

  const handleAddActivity = (week, sIndex) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const currentActivities = updatedWeek[sIndex]?.activity || [];
    if (currentActivities.length < 2) {
      updatedWeek[sIndex] = { ...updatedWeek[sIndex], activity: [...currentActivities, ""] };
      const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
      updateInterventionPlan(updatedPlan);
    }
  };

  const handleRemoveActivity = (week, sIndex, aIndex) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const currentActivities = updatedWeek[sIndex]?.activity || [];
    if (currentActivities.length > 1) {
      const newActivities = currentActivities.filter((_, i) => i !== aIndex);
      updatedWeek[sIndex] = { ...updatedWeek[sIndex], activity: newActivities };
      const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
      updateInterventionPlan(updatedPlan);
    }
  };

  const handleToolChange = (e) => {
    const updatedPlan = { ...interventionPlan, mentionToolUsedForRespectiveGoal: e.target.value };
    updateInterventionPlan(updatedPlan);
  };

  const handleGoalChange = (week, sIndex, gIndex, value) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const updatedGoals = [...updatedWeek[sIndex].goal];
    updatedGoals[gIndex] = value;
    updatedWeek[sIndex] = { ...updatedWeek[sIndex], goal: updatedGoals };
    const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
    updateInterventionPlan(updatedPlan);
  };

  const handleActivityChange = (week, sIndex, aIndex, value) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    const updatedActivities = [...updatedWeek[sIndex].activity];
    updatedActivities[aIndex] = value;
    updatedWeek[sIndex] = { ...updatedWeek[sIndex], activity: updatedActivities };
    const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
    updateInterventionPlan(updatedPlan);
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleNextOrSubmit = async () => {
    if (!validateForm()) return;
    setSubmitStatus("Submitting...");
    try {
      await handleFormCompletion();
    } catch (error) {
      console.error("Error in handleFormCompletion:", error);
      setSubmitStatus("Submission failed");
    }
  };

  const inputClass = "w-full px-3 py-3 border border-body-30 rounded-lg text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 transition-all duration-200 bg-white";

  return (
    <div className="w-full space-y-6" data-prevent-scroll>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary-70 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-body-100">Intervention Plan</h2>
          <p className="text-body-50 text-sm">Weekly sessions and therapeutic activities</p>
        </div>
      </div>

      {/* Weeks */}
      {weeks.map((week, wIndex) => (
        <div 
          key={week} 
          className="bg-white border border-body-30 rounded-xl overflow-hidden"
          ref={el => weekRefs.current[week] = el}
        >
          <button
            type="button"
            className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-body-20 to-primary-50/20 hover:from-body-30 transition-all duration-200"
            onClick={() => toggleWeek(week)}
            data-prevent-scroll
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-70 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">W{wIndex + 1}</span>
              </div>
              <div className="text-left">
                <span className="font-semibold text-body-100">Week {wIndex + 1}</span>
                <p className="text-body-50 text-sm">
                  {interventionPlan[week]?.length || 0} sessions
                </p>
              </div>
            </div>
            <span className="text-body-50">{expandedWeek === week ? "−" : "+"}</span>
          </button>

          {expandedWeek === week && (
            <div className="p-4 space-y-4" data-prevent-scroll>
              {interventionPlan[week]?.map((session, sIndex) => (
                <div key={sIndex} className="border border-body-30 rounded-lg p-4 bg-body-20 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-ternary-70 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{sIndex + 1}</span>
                      </div>
                      <span className="font-medium text-body-100">Session {sIndex + 1}</span>
                    </div>
                    {interventionPlan[week].length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSession(week, sIndex)}
                        className="text-error hover:bg-error/10 p-1 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-body-70 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date <span className="text-error">*</span>
                    </label>
                    <DatePicker
                      value={session.date || ""}
                      name={`date_${week}_${sIndex}`}
                      callback={(e, val) => handleWeekChange(week, sIndex, "date", val)}
                      divClasses="h-12"
                      inputClasses={inputClass}
                      disableFuture={true}
                      icon={false}
                    />
                    {errors[`${week}_s${sIndex}_date`] && (
                      <p className="text-error text-sm mt-1">{errors[`${week}_s${sIndex}_date`]}</p>
                    )}
                  </div>

                  {/* Goals */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-body-70 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Goals (1-2 required)
                    </label>
                    {session.goal?.map((g, gIndex) => (
                      <div key={gIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={g}
                          onChange={(e) => handleGoalChange(week, sIndex, gIndex, e.target.value)}
                          className={inputClass}
                          placeholder={`Goal ${gIndex + 1}`}
                        />
                        {session.goal.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGoal(week, sIndex, gIndex)}
                            className="text-error hover:bg-error/10 p-2 rounded transition-colors flex-shrink-0"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {errors[`${week}_s${sIndex}_goals`] && (
                      <p className="text-error text-sm mt-1">{errors[`${week}_s${sIndex}_goals`]}</p>
                    )}
                    {session.goal?.length < 2 && (
                      <button
                        type="button"
                        onClick={() => handleAddGoal(week, sIndex)}
                        className="text-primary-100 hover:bg-primary-50/20 p-2 rounded transition-colors flex items-center gap-2 text-sm"
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
                      Activities (1-2 required)
                    </label>
                    {session.activity?.map((a, aIndex) => (
                      <div key={aIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={a}
                          onChange={(e) => handleActivityChange(week, sIndex, aIndex, e.target.value)}
                          className={inputClass}
                          placeholder={`Activity ${aIndex + 1}`}
                        />
                        {session.activity.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(week, sIndex, aIndex)}
                            className="text-error hover:bg-error/10 p-2 rounded transition-colors flex-shrink-0"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {errors[`${week}_s${sIndex}_activities`] && (
                      <p className="text-error text-sm mt-1">{errors[`${week}_s${sIndex}_activities`]}</p>
                    )}
                    {session.activity?.length < 2 && (
                      <button
                        type="button"
                        onClick={() => handleAddActivity(week, sIndex)}
                        className="text-primary-100 hover:bg-primary-50/20 p-2 rounded transition-colors flex items-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Activity
                      </button>
                    )}
                  </div>

                  {/* Child Response */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-body-70 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Child Response <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={session.childResponse || ""}
                      onChange={(e) => handleWeekChange(week, sIndex, "childResponse", e.target.value)}
                      className={inputClass}
                      placeholder="How did the child respond?"
                    />
                    {errors[`${week}_s${sIndex}_childResponse`] && (
                      <p className="text-error text-sm mt-1">{errors[`${week}_s${sIndex}_childResponse`]}</p>
                    )}
                  </div>
                </div>
              ))}

              {interventionPlan[week]?.length < 5 && (
                <button
                  type="button"
                  onClick={() => handleAddSession(week)}
                  className="text-primary-100 hover:bg-primary-50/20 p-3 rounded-lg transition-colors flex items-center gap-2 justify-center w-full border-2 border-dashed border-body-30"
                >
                  <Plus className="w-5 h-5" />
                  Add Session
                </button>
              )}
            </div>
          )}

          {errors[week] && (
            <div className="p-3 bg-error/10 border border-error rounded-lg mx-4 mb-4">
              <p className="text-error text-sm">{errors[week]}</p>
            </div>
          )}
        </div>
      ))}

      {/* Tools Section */}
      <div className="bg-white border border-body-30 rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-ternary-70 rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <label className="text-sm font-medium text-body-100">
            Mention Tool Used For Respective Goal <span className="text-error">*</span>
          </label>
        </div>
        <input
          type="text"
          value={interventionPlan.mentionToolUsedForRespectiveGoal || ""}
          onChange={handleToolChange}
          className={inputClass}
          placeholder="Describe the tools used for each goal"
        />
        {errors.mentionToolUsedForRespectiveGoal && (
          <p className="text-error text-sm mt-2">{errors.mentionToolUsedForRespectiveGoal}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-body-30">
        <button
          onClick={handlePrevious}
          disabled={activeStep === 0}
          className="px-6 py-3 bg-body-30 text-body-70 rounded-lg font-semibold hover:bg-body-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
        >
          Previous
        </button>
        <button
          onClick={handleNextOrSubmit}
          className="px-6 py-3 bg-gradient-to-r from-primary-70 to-primary-100 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 order-1 sm:order-2"
        >
          Submit Assignment
        </button>
      </div>

      {submitStatus && (
        <div className={`p-3 rounded-lg text-center ${
          submitStatus === "Submitting..." ? "bg-primary-50/20 border border-primary-50" :
          submitStatus.includes("failed") ? "bg-error/20 border border-error" :
          "bg-success/20 border border-success"
        }`}>
          <p className={`
            text-sm font-medium ${
              submitStatus === "Submitting..." ? "text-primary-100" :
              submitStatus.includes("failed") ? "text-error" :
              "text-success"
            }
          `}>
            {submitStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default FormD;