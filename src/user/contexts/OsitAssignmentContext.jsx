import { createContext, useState, useEffect } from "react";
import { axiosClient } from "../../Utils/axiosClient";
import FormB from "../components/FormB";
import FormC from "../components/FormC";
import FormD from "../components/FormD";
const OsitAssignmentContext = createContext();

const OsitAssignmentProvider = ({ children }) => {
  const steps = ["Form B", "Form C", "Form D"];

  const initialSession = {
    goal: [""],
    activity: [""],
    childResponse: "",
    date: "",
    tool: "",
  };
  const weeks = ["week1", "week2", "week3", "week4", "week5"];

  const defaultinterventionPlan = {
    week1: [{ ...initialSession }],
    week2: [{ ...initialSession }],
  };

  const [activeStep, setActiveStep] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [childProfile, setChildProfile] = useState({
    fName: "",
    mName: "",
    lName: "",
    dob: "",
    gender: "",
    diagnosis: "",
    presentComplaint: "",
    medicalHistory: "",
    event: "",
  });

  const [assignmentDetail, setAssignmentDetails] = useState({
    problemStatement: "",
    identificationAndObjectiveSetting: "",
    planningAndToolSection: "",
    toolStrategiesApproaches: "",
  });

  const [interventionPlan, setInterventionPlan] = useState(
    defaultinterventionPlan
  );

  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        
        const savedSelectedEvent = localStorage.getItem("selectedEvent");
        if (savedSelectedEvent) setSelectedEvent(savedSelectedEvent);
        const savedFormB = localStorage.getItem("childProfile");
        if (savedFormB) {
          setChildProfile(JSON.parse(savedFormB));
        }
        const savedFormC = localStorage.getItem("assignmentDetail");
        if (savedFormC) {
          setAssignmentDetails(JSON.parse(savedFormC));
        }
        const savedFormD = localStorage.getItem("interventionPlan");
        if (savedFormD) {
          setInterventionPlan(JSON.parse(savedFormD));
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    };
    loadFromLocalStorage();
  }, []);

  const getStepStyle = (index) => {
    if (index < activeStep) {
      return "bg-green-500 text-white shadow-md";
    } else if (index === activeStep) {
      return "bg-white border-4 border-teal-500 text-teal-700 shadow-lg";
    } else {
      return "bg-gray-200 text-gray-600";
    }
  };

  //

  const renderForm = () => {
    switch (steps[activeStep]) {
      case "Form B":
        return <FormB />;
      case "Form C":
        return <FormC />;
      case "Form D":
        return <FormD />;
      default:
        return null;
    }
  };
  const resetAllForms = () => {
    [
      "participantInfo",
      "childProfile",
      "assignmentDetail",
      "interventionPlan",
      "selectedEvent",
    ].forEach((key) => localStorage.removeItem(key));

    // ✅ fixed correct keys
    setChildProfile({
      fName: "",
      mName: "",
      lName: "",
      dob: "",
      gender: "",
      diagnosis: "",
      presentComplaint: "",
      medicalHistory: "",
      event: "",
    });

    setAssignmentDetails({
      problemStatement: "",
      identificationAndObjectiveSetting: "",
      planningAndToolSection: "",
      toolStrategiesApproaches: "",
    });

    setInterventionPlan(defaultinterventionPlan);
    setActiveStep(0);
    setSubmitStatus(null);
    setSelectedEvent("");
  };

  const handleFormCompletion = async () => {
    try {
      const formatDate = (date) => {
        if (!date) return "";
        if (date instanceof Date) return date.toISOString().split("T")[0];
        if (typeof date === "string") {
          if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
            const [day, month, year] = date.split("-");
            return `${year}-${month}-${day}`;
          }
          return new Date(date).toISOString().split("T")[0];
        }
        return "";
      };

      // ✅ Build only weeks that exist and have sessions
      const interventionData = {};
      Object.entries(interventionPlan).forEach(([weekKey, sessions]) => {
        if (Array.isArray(sessions) && sessions.length > 0) {
          interventionData[weekKey] = {
            sessions: sessions.map((session, index) => ({
              ...session,
              sessionNo: index + 1,
              date: formatDate(session.date),
            })),
          };
        }
      });

      // ✅ Build final data object
      const transformedData = {
        event: selectedEvent,
        childProfile: {
          fName: childProfile.fName || "",
          mName: childProfile.mName || "",
          lName: childProfile.lName || "",
          dob: formatDate(childProfile.dob),
          gender: childProfile.gender || "",
          diagnosis: childProfile.diagnosis || "",
          presentComplaint: childProfile.presentComplaint || "",
          medicalHistory: childProfile.medicalHistory || "",
          event: childProfile.event || "",
        },
        assignmentDetail: {
          problemStatement: assignmentDetail.problemStatement || "",
          identificationAndObjectiveSetting:
            assignmentDetail.identificationAndObjectiveSetting || "",
          planningAndToolSection: assignmentDetail.planningAndToolSection || "",
          toolStrategiesApproaches:
            assignmentDetail.toolStrategiesApproaches || "",
        },
        interventionPlan: interventionData, // ✅ safe dynamic plan
      };

      console.log("Submitting data:", transformedData);

      // ✅ Send to API
      const response = await axiosClient.post(
        `/osit-assignments`,
        transformedData
      );
      console.log("API Response:", response);
      resetAllForms();
      setSubmitStatus("Form submitted successfully");
      window.location.reload();
    } catch (error) {
      console.log("API Error:", error.response?.data || error);
      setSubmitStatus("Submission failed. Please try again.");
    }
  };

  return (
    <OsitAssignmentContext.Provider
      value={{
        // participantInfo,
        // setParticipantInfo,
        childProfile,
        setChildProfile,
        assignmentDetail,
        setAssignmentDetails,
        interventionPlan,
        setInterventionPlan,
        activeStep,
        setActiveStep,
        getStepStyle,
        renderForm,
        steps,
        weeks,
        initialSession,
        submitStatus,
        setSubmitStatus,
        handleFormCompletion,
        resetAllForms,
        eventData,
        setEventData,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {children}
    </OsitAssignmentContext.Provider>
  );
};

export default OsitAssignmentProvider;
export { OsitAssignmentContext };
