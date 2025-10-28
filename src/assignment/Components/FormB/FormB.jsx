// ----------------------------------------------------------------------------
import React, { useContext, useRef, useState } from "react";
import DatePicker from "../Inputs/Datepicker";
import JoditEditor from "jodit-react";
import { OsitAssignmentContext } from "../../pages/OsitAssignmentProvider";

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

// -------------------------------------------------------------


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...childProfile, [name]: value };
    setChildProfile(updated);
    localStorage.setItem("childProfile", JSON.stringify(updated));
    console.log(" FormB saved to localStorage:", updated);
    setSubmitStatus(null);
  };

  // ----------------------------------------------
 const handleMedicalHistoryChange = (newContent) => {
    const updated = { ...childProfile, medicalHistory: newContent };
    setChildProfile(updated);
    localStorage.setItem("childProfile", JSON.stringify(updated));
    console.log("FormB saved to localStorage:", updated);
    setSubmitStatus(null);
  };


  // ------------------------------------------------------



  const handleDob = (e, val) => {
  
    if (!val) return;
    const updated = { ...childProfile, dob: val };
    setChildProfile(updated);
    localStorage.setItem("childProfile", JSON.stringify(updated));
      console.log(" FormB saved to localStorage:", updated);
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

  const inputClass = "w-full h-12 px-3 border rounded-md text-sm text-gray-700";


  // -----------------------------------------
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
    <div className="p-2 w-full ">
      <h2 className="md:text-3xl text-[20px] font-bold text-indigo-700 mb-10">Child Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" name="name" value={childProfile.name || ""} onChange={handleChange} className={inputClass} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth <span className="text-red-500">*</span></label>
          <DatePicker
            value={childProfile.dob || ""}
            name="dob"
            callback={handleDob}
            divClasses="h-12"
            inputClasses={inputClass}
            disableFuture={true}
            icon={true}
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Gender <span className="text-red-500">*</span></label>
          <div className="flex items-center space-x-4 h-12">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center space-x-1 text-sm">
                <input type="radio" name="gender" value={g} checked={childProfile.gender === g} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                <span>{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Diagnosis <span className="text-red-500">*</span></label>
          <input type="text" name="diagnosis" value={childProfile.diagnosis || ""} onChange={handleChange} className={inputClass} />
          {errors.diagnosis && <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Present Complaint <span className="text-red-500">*</span></label>
          <input type="text" name="presentComplaint" value={childProfile.presentComplaint || ""} onChange={handleChange} className={inputClass} />
          {errors.presentComplaint && <p className="text-red-500 text-sm mt-1">{errors.presentComplaint}</p>}
        </div>
      </div>

   <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Medical History <span className="text-red-500">*</span></label>
        <JoditEditor
        ref={editorRef}
          value={childProfile.medicalHistory || ""}
          config={joditConfig}
           onBlur={handleMedicalHistoryChange}
        />
        {errors.medicalHistory && <p className="text-red-500 text-sm mt-1">{errors.medicalHistory}</p>}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={handlePrevious} disabled={activeStep === 0} className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50">Previous</button>
        <button onClick={handleNextOrSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded">Save & Continue</button>
      </div>
      {submitStatus && <p className="mt-4 text-center text-green-600 font-medium">{submitStatus}</p>}
    </div>
  );
};

export default FormB;