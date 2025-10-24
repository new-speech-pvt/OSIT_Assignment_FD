
import React, { useState } from "react";
import FormA from "../Components/FormA/FormA";
import FormB from "../Components/FormB/FormB";
import FormC from "../Components/FormC/FormC";
import FormD from "../Components/FormD/FormD";
import axios from 'axios';
import OsitAssignmentContext from './OsitAssignmentProvider';

const steps = ["Form A", "Form B", "Form C", "Form D"];

const AssignmentForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [allFormData, setAllFormData] = useState({});
  console.log("isFormSubmitted:");

  const saveFormData = (formKey, data) => {
    setAllFormData((prev) => ({ ...prev, [formKey]: data }));
  };

  const handleFormCompletion = async () => {
    try {
      // Transform data to match backend structure
      const transformedData = {
        participantInfo: {
          fName: allFormData.forma?.fName || '',
          lName: allFormData.forma?.lName || '',
          gender: allFormData.forma?.gender || '',
          dob: allFormData.forma?.dob || '',
          phone: allFormData.forma?.phone || '',
          email: allFormData.forma?.email || '',
          state: allFormData.forma?.state || '',
          city: allFormData.forma?.city || '',
          therapistType: allFormData.forma?.therapistType || '',
          enrollmentId: allFormData.forma?.enrollmentId || 'DEFAULT123',
        },
        childProfile: {
          name: allFormData.formb?.name || '',
          dob: allFormData.formb?.dob || '',
          gender: allFormData.formb?.gender || '',
          diagnosis: allFormData.formb?.diagnosis || '',
          presentComplaint: allFormData.formb?.presentComplaint || '',
          medicalHistory: allFormData.formb?.medicalHistory || '',
        },
        assignmentDetail: {
          problemStatement: allFormData.formc?.problemStatement || '',
          identificationAndObjectiveSetting: allFormData.formc?.identificationAndObjectiveSetting || '',
          planningAndToolSection: allFormData.formc?.planningAndToolSection || '',
          toolStrategiesApproaches: allFormData.formc?.toolStrategiesApproaches || '',
        },
        interventionPlan: {
          week1: { sessions: allFormData.formd?.week1 || [] },
          week2: { sessions: allFormData.formd?.week2 || [] },
          week3: { sessions: allFormData.formd?.week3 || [] },
          week4: { sessions: allFormData.formd?.week4 || [] },
          week5: { sessions: allFormData.formd?.week5 || [] },
          mentionToolUsedForRespectiveGoal: allFormData.formd?.mentionToolUsedForRespectiveGoal || '',
        },
      };

      ['week1', 'week2', 'week3', 'week4', 'week5'].forEach(week => {
        transformedData.interventionPlan[week].sessions = transformedData.interventionPlan[week].sessions.map((session, index) => ({
          ...session,
          sessionNo: session.sessionNo || index + 1,
        }));
      });

      // API call
      const response = await axios.post(`http://localhost:3000/osit-assignments`, transformedData);
      console.log("API Response:", response);

      setIsFormSubmitted(true);
    } catch (error) {
      console.log("API Error:", error.response?.data || error);
    }
  };

  const renderForm = () => {
    const formKey = steps[activeStep].toLowerCase().replace(" ", "");
    const props = {
      activeStep,
      setActiveStep,
      totalSteps: steps.length,
      initialData: allFormData[formKey] || {},
      onSave: (data) => saveFormData(formKey, data),
      isLastStep: activeStep === steps.length - 1,
      onComplete: handleFormCompletion,
    };

    switch (steps[activeStep]) {
      case "Form A":
        return <FormA {...props} />;
      case "Form B":
        return <FormB {...props} />;
      case "Form C":
        return <FormC {...props} />;
      case "Form D":
        return <FormD {...props} />;
      default:
        return null;
    }
  };

  const getStepStyle = (index) => {
    if (index < activeStep) {
      return "bg-green-500 text-white shadow-md";
    } else if (index === activeStep) {
      return "bg-white border-4 border-teal-500 text-teal-700 shadow-lg";
    } else {
      return "bg-gray-200 text-gray-600";
    }
  };

  // ✅ YEH LINE CHECK KARO - isFormSubmitted true hona chahiye
  if (isFormSubmitted) {
    return <CompletedForm />;
  }

  return (
    <OsitAssignmentContext.Provider value={{ allFormData, saveFormData, submitForm: handleFormCompletion }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 p-6 flex justify-center items-start">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#604C91] to-[#D73F7F] text-white p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Oral Sensorimotor Integration Therapy (OSIT) Assignment
            </h2>
            <p className="text-sm md:text-base opacity-90">
              Follow the steps below to complete your OSIT assignment
            </p>
          </div>

          {/* Step Progress Bar */}
          <div className="relative px-8 py-6 bg-gradient-to-r from-blue-50 to-teal-50">
            <div className="flex justify-between items-center relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <button
                    onClick={() => setActiveStep(index)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${getStepStyle(
                      index
                    )}`}
                  >
                    {index < activeStep ? "✓" : index + 1}
                  </button>
                  <span className="text-xs md:text-sm mt-2 font-medium">
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Connecting Line */}
            <div className="absolute top-[34px] left-[8%] right-[8%] h-1 bg-gray-200 rounded-full z-0">
              <div
                className="h-full bg-gradient-to-r from-[#604C91] to-[#D73F7F] rounded-full"
                style={{
                  width: `${(activeStep / (steps.length - 1)) * 100}%`,
                  transition: "width 0.4s ease-in-out",
                }}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 h-[calc(100vh-320px)] overflow-y-auto bg-gray-50 rounded-b-3xl">
            {renderForm()}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-[#604C91] to-[#D73F7F] text-white py-4 text-center font-semibold text-sm">
            Step {activeStep + 1} of {steps.length} — Keep it up
          </div>
        </div>
      </div>
    </OsitAssignmentContext.Provider>
  );
};

// ✅ YEH FIXED CompletedForm COMPONENT HAI
const CompletedForm = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-white to-teal-100">
    <div className="bg-white shadow-2xl p-10 rounded-3xl text-center">
      {/* ✅ YEH LINE FIX KI HAI - Checkmark add kiya hai */}
      <div className="text-7xl mb-4 text-green-500">✅</div>
      <h2 className="text-3xl font-bold text-green-600 mb-3">
        Assignment Completed!
      </h2>
      <p className="text-gray-700 text-lg">
        You've successfully submitted all OSIT forms. Great job!
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Start New Assignment
      </button>
    </div>
  </div>
);

export default AssignmentForm;