// ----------------------------------------------------------------------------------
import { createContext, useState, useEffect } from "react"
import { axiosClient } from "../../Utils/axiosClient";
import FormB from '../components/FormB'
import FormC from '../components/FormC'
import FormD from '../components/FormD'
const OsitAssignmentContext = createContext();

const OsitAssignmentProvider = ({ children }) => {
    const steps = ["Form B", "Form C", "Form D"];

    const initialSession = { goal: [""], activity: [""], childResponse: "", date: "" };
    const weeks = ["week1", "week2", "week3", "week4", "week5"];

    const defaultinterventionPlan = {
        week1: [{ ...initialSession }],
        week2: [{ ...initialSession }],
        week3: [{ ...initialSession }],
        week4: [{ ...initialSession }],
        week5: [{ ...initialSession }],
        mentionToolUsedForRespectiveGoal: ""
    };

    const [activeStep, setActiveStep] = useState(0);
    // const [participantInfo, setParticipantInfo] = useState({
    //     fName: '',
    //     lName: '',
    //     gender: '',
    //     dob: '',
    //     phone: '',
    //     email: '',
    //     state: '',
    //     city: '',
    //     therapistType: '',
    //     enrollmentId: ''
    // });

    const [childProfile, setChildProfile] = useState({
        name: '',
        dob: '',
        gender: '',
        diagnosis: '',
        presentComplaint: '',
        medicalHistory: ''
    });

    const [assignmentDetail, setAssignmentDetails] = useState({
        problemStatement: '',
        identificationAndObjectiveSetting: '',
        planningAndToolSection: '',
        toolStrategiesApproaches: ''
    });

    const [interventionPlan, setInterventionPlan] = useState(defaultinterventionPlan);
    
    const [submitStatus, setSubmitStatus] = useState(null);

    // Load data from localStorage on component mount
    useEffect(() => {
        const loadFromLocalStorage = () => {
            try {
                // const savedFormA = localStorage.getItem('participantInfo');
                // if (savedFormA) {
                //     setParticipantInfo(JSON.parse(savedFormA));
                // }
                const savedFormB = localStorage.getItem('childProfile');
                if (savedFormB) {
                    setChildProfile(JSON.parse(savedFormB));
                }
                const savedFormC = localStorage.getItem('assignmentDetail');
                if (savedFormC) {
                    setAssignmentDetails(JSON.parse(savedFormC));
                }
                const savedFormD = localStorage.getItem('interventionPlan');
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
        // Clear localStorage
        ['participantInfo', 'childProfile', 'assignmentDetail', 'interventionPlan'].forEach((key) => {
            localStorage.removeItem(key);
        });

        // Reset all states
        // setParticipantInfo({
        //     fName: '',
        //     lName: '',
        //     gender: '',
        //     dob: '',
        //     phone: '',
        //     email: '',
        //     state: '',
        //     city: '',
        //     therapistType: '',
        //     enrollmentId: ''
        // });
        setChildProfile({
            name: '',
            dob: '',
            gender: '',
            diagnosis: '',
            presentComplaint: '',
            medicalHistory: ''
        });
        setAssignmentDetails({
            problemStatement: '',
            identificationAndObjectiveSetting: '',
            planningAndToolSection: '',
            toolStrategiesApproaches: ''
        });
        setInterventionPlan(defaultinterventionPlan);
        setActiveStep(0);
        setSubmitStatus(null);
    };

    const handleFormCompletion = async () => {
        try {
            // Format dates properly
            const formatDate = (date) => {
                if (!date) return '';
                if (date instanceof Date) return date.toISOString().split('T')[0];
                if (typeof date === 'string') {
                    // Handle DD-MM-YYYY format
                    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
                        const [day, month, year] = date.split("-");
                        return `${year}-${month}-${day}`;
                    }
                    // Handle other string formats
                    return new Date(date).toISOString().split('T')[0];
                }
                return '';
            };

            // Transform data to match backend structure
            const transformedData = {
                // participantInfo: {
                //     fName: participantInfo.fName || '',
                //     lName: participantInfo.lName || '',
                //     gender: participantInfo.gender || '',
                //     dob: formatDate(participantInfo.dob),
                //     phone: participantInfo.phone || '',
                //     email: participantInfo.email || '',
                //     state: participantInfo.state || '',
                //     city: participantInfo.city || '',
                //     therapistType: participantInfo.therapistType || '',
                //     enrollmentId: participantInfo.enrollmentId || 'DEFAULT123',
                // },


                childProfile: {
                    name: childProfile.name || '',
                    dob: formatDate(childProfile.dob),
                    gender: childProfile.gender || '',
                    diagnosis: childProfile.diagnosis || '',
                    presentComplaint: childProfile.presentComplaint || '',
                    medicalHistory: childProfile.medicalHistory || '',
                },
                assignmentDetail: {
                    problemStatement: assignmentDetail.problemStatement || '',
                    identificationAndObjectiveSetting: assignmentDetail.identificationAndObjectiveSetting || '',
                    planningAndToolSection: assignmentDetail.planningAndToolSection || '',
                    toolStrategiesApproaches: assignmentDetail.toolStrategiesApproaches || '',
                },
                interventionPlan: {
                    week1: { sessions: interventionPlan.week1 || [] },
                    week2: { sessions: interventionPlan.week2 || [] },
                    week3: { sessions: interventionPlan.week3 || [] },
                    week4: { sessions: interventionPlan.week4 || [] },
                    week5: { sessions: interventionPlan.week5 || [] },
                    mentionToolUsedForRespectiveGoal: interventionPlan.mentionToolUsedForRespectiveGoal || '',
                },
            };

            // Add session numbers
            ['week1', 'week2', 'week3', 'week4', 'week5'].forEach(week => {
                transformedData.interventionPlan[week].sessions = transformedData.interventionPlan[week].sessions.map((session, index) => ({
                    ...session,
                    sessionNo: index + 1,
                    date: formatDate(session.date)
                }));
            });

            console.log("Submitting data:", transformedData);

            // API call


            const response = await axiosClient.post(`http://localhost:3001/osit-assignments`,

                transformedData

            );
            console.log("API Response:", response);

            // Reset forms and show success
            resetAllForms();
            setSubmitStatus("Form submitted successfully");
            window.location.reload();
        } catch (error) {
            console.log("API Error:", error.response?.data || error);
            setSubmitStatus("Submission failed. Please try again.");
        }
    };

    return (
        <OsitAssignmentContext.Provider value={{
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
            resetAllForms
        }}>
            {children}
        </OsitAssignmentContext.Provider>
    );
}

export default OsitAssignmentProvider;
export { OsitAssignmentContext };