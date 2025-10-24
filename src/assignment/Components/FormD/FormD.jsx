
// ---------------------------------------------------------------------------------------

import React, { useContext, useState } from "react";
import { OsitAssignmentContext } from "../../pages/OsitAssignmentProvider";

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

  const toggleWeek = (week) => setExpandedWeek(prev => prev === week ? "" : week);

  const updateInterventionPlan = (updatedPlan) => {
    setInterventionPlan(updatedPlan);
    localStorage.setItem("interventionPlan", JSON.stringify(updatedPlan));
     console.log("FormD saved to localStorage:", updatedPlan);
  };

  const handleWeekChange = (week, index, field, value) => {
    const updatedWeek = [...(interventionPlan[week] || [])];
    updatedWeek[index] = { ...updatedWeek[index], [field]: value };
    const updatedPlan = { ...interventionPlan, [week]: updatedWeek };
    updateInterventionPlan(updatedPlan);
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
    console.log("Submit button clicked");
    if (!validateForm()) {
        console.log("Validation failed"); 
      return;
    }
    setSubmitStatus("Submitting...");
      console.log("Calling handleFormCompletion...");
      try {
         await handleFormCompletion();
         console.log("handleFormCompletion completed");
      } catch (error) {
         console.error("Error in handleFormCompletion:", error);
      setSubmitStatus("Submission failed");
      }
  
  };

  const inputClass = "w-full px-3 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Intervention Plan</h2>
      
      {weeks.map((week, wIndex) => (
        <div key={week} className="bg-white shadow-lg rounded-md overflow-hidden">
          <button 
            type="button" 
            className="w-full flex justify-between items-center p-4 bg-indigo-100 hover:bg-indigo-200 transition" 
            onClick={() => toggleWeek(week)}
          >
            <span className="font-semibold text-indigo-700">Week {wIndex + 1}</span>
            <span className="text-indigo-600">{expandedWeek === week ? "−" : "+"}</span>
          </button>
          
          {expandedWeek === week && (
            <div className="p-4 space-y-4">
              {interventionPlan[week]?.map((session, sIndex) => (
                <div key={sIndex} className="border rounded-md p-4 bg-gray-50 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Session {sIndex + 1}</span>
                    {interventionPlan[week].length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSession(week, sIndex)} 
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Goals Section */}
                  <div>
                    <label className="text-sm font-medium">Goals (1-2 required)</label>
                    {session.goal?.map((g, gIndex) => (
                      <div key={gIndex} className="flex gap-2 items-center mt-1">
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
                            className="text-red-500 text-sm hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            −
                          </button>
                        )}
                      </div>
                    ))}
                    {errors[`${week}_s${sIndex}_goals`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`${week}_s${sIndex}_goals`]}</p>
                    )}
                    {session.goal.length < 2 && (
                      <button 
                        type="button" 
                        onClick={() => handleAddGoal(week, sIndex)} 
                        className="text-indigo-600 text-sm mt-1 hover:underline flex items-center gap-1"
                      >
                        <span>+</span> Add Goal
                      </button>
                    )}
                  </div>
                  
                  {/* Activities Section */}
                  <div>
                    <label className="text-sm font-medium">Activities (1-2 required)</label>
                    {session.activity?.map((a, aIndex) => (
                      <div key={aIndex} className="flex gap-2 items-center mt-1">
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
                            className="text-red-500 text-sm hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            −
                          </button>
                        )}
                      </div>
                    ))}
                    {errors[`${week}_s${sIndex}_activities`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`${week}_s${sIndex}_activities`]}</p>
                    )}
                    {session.activity.length < 2 && (
                      <button 
                        type="button" 
                        onClick={() => handleAddActivity(week, sIndex)} 
                        className="text-indigo-600 text-sm mt-1 hover:underline flex items-center gap-1"
                      >
                        <span>+</span> Add Activity
                      </button>
                    )}
                  </div>
                  
                  {/* Child Response and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Child Response</label>
                      <input 
                        type="text" 
                        value={session.childResponse || ""} 
                        onChange={(e) => handleWeekChange(week, sIndex, "childResponse", e.target.value)} 
                        className={inputClass} 
                        placeholder="How did the child respond?"
                      />
                      {errors[`${week}_s${sIndex}_childResponse`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`${week}_s${sIndex}_childResponse`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <input 
                        type="date" 
                        value={session.date || ""} 
                        onChange={(e) => handleWeekChange(week, sIndex, "date", e.target.value)} 
                        className={inputClass} 
                        onFocus={(e) => e.target.showPicker?.()} 
                      />
                      {errors[`${week}_s${sIndex}_date`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`${week}_s${sIndex}_date`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {interventionPlan[week]?.length < 5 && (
                <button 
                  type="button" 
                  onClick={() => handleAddSession(week)} 
                  className="text-indigo-600 text-sm mt-2 hover:underline flex items-center gap-1"
                >
                  <span>+</span> Add Session
                </button>
              )}
            </div>
          )}
          
          {errors[week] && (
            <p className="text-red-500 text-sm mt-1 ml-4 p-2 bg-red-50 rounded">{errors[week]}</p>
          )}
        </div>
      ))}
      
      {/* Tools Section */}
      <div className="bg-white shadow-lg rounded-md p-4 mt-6">
        <label className="text-sm font-medium">
          Mention Tool Used For Respective Goal <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          value={interventionPlan.mentionToolUsedForRespectiveGoal || ""} 
          onChange={handleToolChange} 
          className={inputClass + " mt-2"} 
          placeholder="Describe the tools used for each goal"
        />
        {errors.mentionToolUsedForRespectiveGoal && (
          <p className="text-red-500 text-sm mt-1">{errors.mentionToolUsedForRespectiveGoal}</p>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button 
          onClick={handlePrevious} 
          disabled={activeStep === 0} 
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <button 
          onClick={handleNextOrSubmit} 
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Submit Assignment
        </button>
      </div>
      
      {/* Status Message */}
      {submitStatus && (
        <p className="mt-4 text-center text-green-600 font-medium p-3 bg-green-50 rounded-lg">
          {submitStatus}
        </p>
      )}
    </div>
  );
};

export default FormD;


