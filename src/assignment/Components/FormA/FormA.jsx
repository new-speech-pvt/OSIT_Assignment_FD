
// ------------------------------------------------------------------------------
import React, { useContext, useState } from "react";
import DatePicker from "../Inputs/Datepicker";
import { OsitAssignmentContext } from "../../pages/OsitAssignmentProvider";

const FormA = () => {
  const { activeStep, setActiveStep, participantInfo, setParticipantInfo, steps } = useContext(OsitAssignmentContext);

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!participantInfo.fName?.trim()) newErrors.fName = "First Name is required";
    if (!participantInfo.lName?.trim()) newErrors.lName = "Last Name is required";
    if (!participantInfo.gender) newErrors.gender = "Gender is required";
    if (!participantInfo.dob) newErrors.dob = "Date of Birth is required";
    if (!participantInfo.phone?.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d+$/.test(participantInfo.phone)) newErrors.phone = "Phone must contain only digits";
    if (!participantInfo.email?.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(participantInfo.email)) newErrors.email = "Invalid email format";
    if (!participantInfo.state?.trim()) newErrors.state = "State is required";
    if (!participantInfo.city?.trim()) newErrors.city = "City is required";
    if (!participantInfo.therapistType?.trim()) newErrors.therapistType = "Therapist Type is required";

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
    const updatedInfo = { ...participantInfo, [name]: value };
    setParticipantInfo(updatedInfo);
    localStorage.setItem("participantInfo", JSON.stringify(updatedInfo));
      console.log(" FormA saved to localStorage:", updatedInfo);
    setSubmitStatus(null);
  };

  const handleDob = (e, val) => {
    const updatedInfo = { ...participantInfo, dob: val };
    setParticipantInfo(updatedInfo);
    localStorage.setItem("participantInfo", JSON.stringify(updatedInfo));
      console.log(" FormA saved to localStorage:", updatedInfo);
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
  const professions = ["Speech Therapist", "Physical Therapist", "Occupational Therapist", "Special Educator", "Psychologist", "Physiotherapist"];

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Participant Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
          <input type="text" name="fName" value={participantInfo.fName || ""} onChange={handleChange} className={inputClass} />
          {errors.fName && <p className="text-red-500 text-sm mt-1">{errors.fName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
          <input type="text" name="lName" value={participantInfo.lName || ""} onChange={handleChange} className={inputClass} />
          {errors.lName && <p className="text-red-500 text-sm mt-1">{errors.lName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth <span className="text-red-500">*</span></label>
          <DatePicker value={participantInfo.dob || ""} name="dob" callback={handleDob} divClasses="h-12" inputClasses={inputClass} disableFuture={true} icon={true} />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Gender <span className="text-red-500">*</span></label>
          <div className="flex items-center space-x-4 h-12">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center space-x-1 text-sm">
                <input type="radio" name="gender" value={g} checked={participantInfo.gender === g} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                <span>{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
          <input type="text" name="phone" value={participantInfo.phone || ""} onChange={handleChange} className={inputClass} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
          <input type="email" name="email" value={participantInfo.email || ""} onChange={handleChange} className={inputClass} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">State <span className="text-red-500">*</span></label>
          <input type="text" name="state" value={participantInfo.state || ""} onChange={handleChange} className={inputClass} />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
          <input type="text" name="city" value={participantInfo.city || ""} onChange={handleChange} className={inputClass} />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profession <span className="text-red-500">*</span></label>
          <select name="therapistType" value={participantInfo.therapistType || ""} onChange={handleChange} className={inputClass}>
            <option value="">Select Profession</option>
            {professions.map((option) => (<option key={option} value={option}>{option}</option>))}
          </select>
          {errors.therapistType && <p className="text-red-500 text-sm mt-1">{errors.therapistType}</p>}
        </div>
      </div>
      <div className="mb-6 md:w-1/3">
        <label className="block text-sm font-medium mb-1">Enrollment ID</label>
        <input type="text" name="enrollmentId" value={participantInfo.enrollmentId || ""} onChange={handleChange} className={inputClass} />
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevious} disabled={activeStep === 0} className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50">Previous</button>
        <button onClick={handleNextOrSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded">Save & Continue</button>
      </div>
      {submitStatus && <p className="mt-4 text-center text-green-600 font-medium">{submitStatus}</p>}
    </div>
  );
};

export default FormA;