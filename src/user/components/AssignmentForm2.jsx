import React, { useContext, useEffect } from 'react'
import { OsitAssignmentContext } from '../contexts/OsitAssignmentContext';
import { Link } from 'lucide-react';
import { axiosClient } from '../../Utils/axiosClient';

const AssignmentForm2 = () => {


    const { activeStep, setActiveStep, getStepStyle, renderForm, steps,setEventData} = useContext(OsitAssignmentContext)


    // completedForm

    //event api 

  const fetchEvent = async ()=>{

    try {
      const response = await axiosClient.get(`/event`)
      setEventData(response.data?.data || []);
console.log("responseeee",response.data)
    } catch (error) {

       console.error("Error fetching events:", error);

    }
  }
   useEffect(() => {
    fetchEvent()  
    }, []);




    return (
        <div className=" min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 flex justify-center items-start md:p-2">
            <div className="w-full bg-white md:rounded-xl shadow-2xl overflow-hidden ">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#604C91] to-[#D73F7F] text-white p-6 ">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Oral Sensorimotor Integration Therapy (OSIT) Assignment
                    </h2>
                    <p className="text-sm md:text-base opacity-90">
                        Follow the steps below to complete your OSIT assignment
                    </p>
                </div>

                {/* Step Progress Bar */}
                <div className="relative px-4 md:px-8 py-5 bg-gradient-to-r from-blue-50 to-teal-50 ">
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

                            </div>
                        ))}
                    </div>

                    {/* Connecting Line */}
                    <div className="absolute top-[34px] md:left-[5%] md:right-[5%] left-[10%] right-[10%] h-1 bg-gray-200 rounded-full z-0">
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
                <div className="md:p-8 p-2  h-[calc(100vh-266px)] overflow-y-auto bg-gray-50 rounded-b-3xl">

                    {renderForm()}
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-[#604C91] to-[#D73F7F] text-white py-4 text-center font-semibold text-sm">
                    Step {activeStep + 1} of {steps.length} — Keep it up
                </div>
            </div>
        </div>

    );
};
export default AssignmentForm2;




