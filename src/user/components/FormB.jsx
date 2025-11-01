import React, { useContext, useRef, useState } from "react";
import DatePicker from "../../components/Inputs/Datepicker";
import JoditEditor from "jodit-react";
import { OsitAssignmentContext } from "../contexts/OsitAssignmentContext";
import { User, Calendar, Stethoscope, Heart } from "lucide-react";

const FormB = () => {
  const { activeStep, setActiveStep, childProfile, setChildProfile, steps } = useContext(OsitAssignmentContext);
  const editorRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!childProfile.name?.trim()) newErrors.name = "Name is required";
    if (!childProfile.dob) newErrors.dob = "Date of Birth is required";
    if (!childProfile.gender) newErrors.gender = "Gender is required";
    if (!childProfile.diagnosis?.trim()) newErrors.diagnosis = "Diagnosis is required";
    if (!childProfile.presentComplaint?.trim()) newErrors.presentComplaint = "Present Complaint is required";
    if (!childProfile.medicalHistory || !childProfile.medicalHistory.replace(/<[^>]*>/g, "").trim()) {
      newErrors.medicalHistory = "Medical History is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el?.focus(), 300);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...childProfile, [name]: value };
    setChildProfile(updated);
    localStorage.setItem("childProfile", JSON.stringify(updated));
    setSubmitStatus(null);
  };

  const handleMedicalHistoryChange = (newContent) => {
    const updated = { ...childProfile, medicalHistory: newContent };
    setChildProfile(updated);
    localStorage.setItem("childProfile", JSON.stringify(updated));
    setSubmitStatus(null);
  };

  const handleDob = (e, val) => {
    if (!val) return;
    const updated = { ...childProfile, dob: val };
    setChildProfile(updated);
    localStorage.setItem("childProfile", JSON.stringify(updated));
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

  const inputClass = "w-full px-3 py-3 border border-body-30 rounded-lg text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 transition-all duration-200 bg-white";

  const joditConfig = {
    readonly: false,
    height: 200,
    toolbarAdaptive: false,
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'align', 'undo', 'redo', '|',
      'cut', 'copy', 'paste',
    ],
    placeholder: "Enter medical history..."
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-ternary-70 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-body-100">Child Profile Information</h2>
          <p className="text-body-50 text-sm">Patient information and medical background</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-body-70">Name <span className="text-error">*</span></label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
            <input 
              type="text" 
              name="name" 
              value={childProfile.name || ""} 
              onChange={handleChange} 
              className={`${inputClass} pl-10`}
              placeholder="Enter full name"
            />
          </div>
          {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-body-70">Date of Birth <span className="text-error">*</span></label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4 z-10" />
            <DatePicker
              value={childProfile.dob || ""}
              name="dob"
              callback={handleDob}
              divClasses="h-12"
              inputClasses={`${inputClass} pl-10`}
              disableFuture={true}
              icon={false}
            />
          </div>
          {errors.dob && <p className="text-error text-sm mt-1">{errors.dob}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-body-70">Gender <span className="text-error">*</span></label>
          <div className="flex flex-wrap gap-3">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center space-x-2 text-sm cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  value={g} 
                  checked={childProfile.gender === g} 
                  onChange={handleChange} 
                  className="w-4 h-4 accent-primary-100" 
                />
                <span className="text-body-100">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-error text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Diagnosis */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-body-70">Diagnosis <span className="text-error">*</span></label>
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
            <input 
              type="text" 
              name="diagnosis" 
              value={childProfile.diagnosis || ""} 
              onChange={handleChange} 
              className={`${inputClass} pl-10`}
              placeholder="Enter diagnosis"
            />
          </div>
          {errors.diagnosis && <p className="text-error text-sm mt-1">{errors.diagnosis}</p>}
        </div>

        {/* Present Complaint */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-body-70">Present Complaint <span className="text-error">*</span></label>
          <input 
            type="text" 
            name="presentComplaint" 
            value={childProfile.presentComplaint || ""} 
            onChange={handleChange} 
            className={inputClass}
            placeholder="Enter present complaint"
          />
          {errors.presentComplaint && <p className="text-error text-sm mt-1">{errors.presentComplaint}</p>}
        </div>
      </div>

      {/* Medical History */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-body-70">Medical History <span className="text-error">*</span></label>
        <div className="border border-body-30 rounded-lg overflow-hidden">
          <JoditEditor
            ref={editorRef}
            value={childProfile.medicalHistory || ""}
            config={joditConfig}
            onBlur={handleMedicalHistoryChange}
          />
        </div>
        {errors.medicalHistory && <p className="text-error text-sm mt-1">{errors.medicalHistory}</p>}
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

export default FormB;