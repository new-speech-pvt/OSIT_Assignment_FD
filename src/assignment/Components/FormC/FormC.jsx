
// -----------------------------------------------------------------------------
import React, { useState, useCallback, useContext, useRef } from "react";
import { OsitAssignmentContext } from "../../pages/OsitAssignmentProvider";
import JoditEditor from "jodit-react";

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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const updated = { ...assignmentDetail, [name]: value };
  //   setAssignmentDetails(updated);
  //   localStorage.setItem("assignmentDetail", JSON.stringify(updated));
  //   console.log("FormC saved to localStorage:", updated);
  //   setSubmitStatus(null);
  // };

  // -----------------------------------------------------

  const handleChange = (fieldName, newContent) => {
    const updated = { 
      ...assignmentDetail, 
      [fieldName]: newContent 
    };
    setAssignmentDetails(updated);
    localStorage.setItem("assignmentDetail", JSON.stringify(updated));
    console.log(`FormC ${fieldName} saved:`, updated);
    setSubmitStatus(null);
  };

  // ---------------------------------------------------------------------

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNextOrSubmit = () => {
    if (!validateForm()) return;
    setSubmitStatus("✅ Form saved successfully");
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const inputClass = "w-full h-12 px-3 border rounded-md text-sm text-gray-700";


  // -------------------------------------------------
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
    placeholder: "Enter medical history..."
  };


  return (
    <div className="p-6 w-full space-y-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Assignment Details</h2>
      <div className="flex flex-col gap-6">

        {/* <div>
          <label className="block mb-1 text-sm font-medium">Problem Statement <span className="text-red-500">*</span></label>


          <input type="text" name="problemStatement" value={assignmentDetail.problemStatement || ""} onChange={handleChange} className={inputClass} />
          {errors.problemStatement && <p className="text-red-500 text-sm mt-1">{errors.problemStatement}</p>}
        </div> */}

        <div>
          <label className="block mb-1 text-sm font-medium">Problem Statement <span className="text-red-500">*</span></label>
            <JoditEditor
            ref={editorRef}
            value={assignmentDetail.problemStatement || ""}
            config={{
              ...joditConfig,
              placeholder: "Enter problem statement..."
            }}
            onBlur={(newContent) => handleChange("problemStatement", newContent)}
          />
          {errors.problemStatement && <p className="text-red-500 text-sm mt-1">{errors.problemStatement}</p>}
        </div>






        <div>
          <label className="block mb-1 text-sm font-medium">Identification and Objective Setting <span className="text-red-500">*</span></label>
          <input type="text" name="identificationAndObjectiveSetting" value={assignmentDetail.identificationAndObjectiveSetting || ""} onChange={handleChange} className={inputClass} />
          {errors.identificationAndObjectiveSetting && <p className="text-red-500 text-sm mt-1">{errors.identificationAndObjectiveSetting}</p>}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Planning and Tool Section <span className="text-red-500">*</span></label>
          <input type="text" name="planningAndToolSection" value={assignmentDetail.planningAndToolSection || ""} onChange={handleChange} className={inputClass} />
          {errors.planningAndToolSection && <p className="text-red-500 text-sm mt-1">{errors.planningAndToolSection}</p>}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Tool Strategies Approaches <span className="text-red-500">*</span></label>
          <input type="text" name="toolStrategiesApproaches" value={assignmentDetail.toolStrategiesApproaches || ""} onChange={handleChange} className={inputClass} />
          {errors.toolStrategiesApproaches && <p className="text-red-500 text-sm mt-1">{errors.toolStrategiesApproaches}</p>}
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={handlePrevious} disabled={activeStep === 0} className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50">Previous</button>
        <button onClick={handleNextOrSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded">Save & Continue</button>
      </div>
      {submitStatus && <p className="mt-4 text-center text-green-600 font-medium">{submitStatus}</p>}
    </div>
  );
};

export default FormC;
