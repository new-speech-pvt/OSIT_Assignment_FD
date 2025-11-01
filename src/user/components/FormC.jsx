import React, { useState, useCallback, useContext, useRef } from "react";
import { OsitAssignmentContext } from "../contexts/OsitAssignmentContext";
import JoditEditor from "jodit-react";
import { FileText, Target, Calendar, Settings } from "lucide-react";

const FormC = () => {
  const { activeStep, setActiveStep, assignmentDetail, setAssignmentDetails, steps } = useContext(OsitAssignmentContext);
  const editorRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!assignmentDetail.problemStatement?.trim()) newErrors.problemStatement = "Required";
    if (!assignmentDetail.identificationAndObjectiveSetting?.trim()) newErrors.identificationAndObjectiveSetting = "Required";
    if (!assignmentDetail.planningAndToolSection?.trim()) newErrors.planningAndToolSection = "Required";
    if (!assignmentDetail.toolStrategiesApproaches?.trim()) newErrors.toolStrategiesApproaches = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [assignmentDetail]);

  const handleChange = (fieldName, newContent) => {
    const updated = {
      ...assignmentDetail,
      [fieldName]: newContent
    };
    setAssignmentDetails(updated);
    localStorage.setItem("assignmentDetail", JSON.stringify(updated));
    setSubmitStatus(null);
  };

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNextOrSubmit = () => {
    if (!validateForm()) return;
    setSubmitStatus("✅ Form saved successfully");
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const joditConfig = {
    readonly: false,
    height: 200,
    toolbarAdaptive: false,
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'align', 'undo', 'redo', '|',
      'cut', 'copy', 'paste'
    ],
    placeholder: "Enter content here..."
  };

  const editorSections = [
    {
      key: "problemStatement",
      label: "Problem Statement",
      icon: FileText,
      placeholder: "Describe the main problem statement..."
    },
    {
      key: "identificationAndObjectiveSetting",
      label: "Identification & Objective Setting",
      icon: Target,
      placeholder: "Identify objectives and set goals..."
    },
    {
      key: "planningAndToolSection",
      label: "Planning & Tool Section",
      icon: Calendar,
      placeholder: "Outline the planning and tools required..."
    },
    {
      key: "toolStrategiesApproaches",
      label: "Tool Strategies & Approaches",
      icon: Settings,
      placeholder: "Describe strategies and approaches..."
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-70 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-body-100">Assignment Details</h2>
          <p className="text-body-50 text-sm">Comprehensive assignment information and planning</p>
        </div>
      </div>

      <div className="space-y-6">
        {editorSections.map((section, index) => (
          <div key={section.key} className="bg-white border border-body-30 rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-secondary-70 rounded-lg flex items-center justify-center">
                <section.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-body-100 text-lg">{section.label} <span className="text-error">*</span></h3>
            </div>
            
            <div className="border border-body-30 rounded-lg overflow-hidden">
              <JoditEditor
                ref={editorRef}
                value={assignmentDetail[section.key] || ""}
                config={{
                  ...joditConfig,
                  placeholder: section.placeholder,
                  height: 180
                }}
                onBlur={(newContent) => handleChange(section.key, newContent)}
              />
            </div>
            
            {errors[section.key] && (
              <p className="text-error text-sm mt-2 flex items-center gap-2">
                <span>⚠</span> This field is required
              </p>
            )}
          </div>
        ))}
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
          Save & Continue
        </button>
      </div>

      {submitStatus && (
        <div className="p-3 bg-success/20 border border-success rounded-lg">
          <p className="text-success text-sm text-center">{submitStatus}</p>
        </div>
      )}
    </div>
  );
};

export default FormC;