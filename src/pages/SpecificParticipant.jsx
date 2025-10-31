import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosClient } from "../Utils/axiosClient";

const SpecificParticipant = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const { participantId } = useParams();
  console.log(participantId);

  useEffect(() => {
    const getAllAssignments = async () => {
      setLoading(true);

      try {
        const response = await axiosClient.get(
          `/osit-assignments/${participantId}`
        );

        console.log(" Response:", response.data);
        setData(response.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllAssignments();
  }, []);

  if (loading) {
    return <div className="mt-20 text-center">Loading.....</div>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl mt-20 p-6 md:p-10 my-6 border border-gray-200">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-8 text-[#604C91]">
          Assignment Preview
        </h2>

        {/* Participant Info */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-[#604C91] mb-3 border-b pb-2">
            Participant Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Name:</strong> {data?.participantInfo?.fName}{" "}{data?.participantInfo?.lName}
            </p>
            <p>
              <strong>Gender:</strong> {data?.participantInfo?.gender}
            </p>
            <p>
              <strong>DOB:</strong>{" "}
              {new Date(data?.participantInfo?.dob).toLocaleDateString()}
            </p>
            <p>
              <strong>Email:</strong> {data?.participantInfo?.email}
            </p>
            <p>
              <strong>Phone:</strong> {data?.participantInfo?.phone}
            </p>
            <p>
              <strong>Enrollment ID:</strong>{" "}
              {data?.participantInfo?.enrollmentId}
            </p>
            <p>
              <strong>State:</strong> {data?.participantInfo?.state}
            </p>
            <p>
              <strong>City:</strong> {data?.participantInfo?.city}
            </p>
            <p>
              <strong>Therapist Type:</strong>{" "}
              {data?.participantInfo?.therapistType}
            </p>
          </div>
        </section>

        {/* Child Profile */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-[#604C91] mb-3 border-b pb-2">
            Child Profile
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Name:</strong> {data?.childProfile?.name}
            </p>
            <p>
              <strong>Gender:</strong> {data?.childProfile?.gender}
            </p>
            <p>
              <strong>DOB:</strong>{" "}
              {new Date(data?.childProfile?.dob).toLocaleDateString()}
            </p>
            <p>
              <strong>Diagnosis:</strong> {data?.childProfile?.diagnosis}
            </p>
            <p>
              <strong>Present Complaint:</strong>{" "}
              {data?.childProfile?.presentComplaint}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-semibold text-[#604C91] mb-1">
              Medical History:
            </h4>
            <div
              className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-md border"
              dangerouslySetInnerHTML={{
                __html: data?.childProfile?.medicalHistory,
              }}
            ></div>
          </div>
        </section>

        {/* Assignment Details */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-[#604C91] mb-3 border-b pb-2">
            Assignment Details
          </h3>
          <div className="space-y-3 text-gray-700">
            <div>
              <strong>Problem Statement:</strong>
              <div
                className="prose prose-sm bg-gray-50 p-3 rounded-md border"
                dangerouslySetInnerHTML={{
                  __html: data?.assignmentDetail?.problemStatement,
                }}
              />
            </div>
            <div>
              <strong>Identification & Objective Setting:</strong>
              <div
                className="prose prose-sm bg-gray-50 p-3 rounded-md border"
                dangerouslySetInnerHTML={{
                  __html: data?.assignmentDetail?.identificationAndObjectiveSetting,
                }}
              />
            </div>
            <div>
              <strong>Planning & Tool Section:</strong>
              <div
                className="prose prose-sm bg-gray-50 p-3 rounded-md border"
                dangerouslySetInnerHTML={{
                  __html: data?.assignmentDetail?.planningAndToolSection,
                }}
              />
            </div>
            <div>
              <strong>Tool Strategies & Approaches:</strong>
              <div
                className="prose prose-sm bg-gray-50 p-3 rounded-md border"
                dangerouslySetInnerHTML={{
                  __html: data?.assignmentDetail?.toolStrategiesApproaches,
                }}
              />
            </div>
          </div>
        </section>

        {/* Intervention Plan */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-[#604C91] mb-3 border-b pb-2">
            Intervention Plan
          </h3>
          <p className="text-gray-700 mb-3">
            <strong>Tools Used:</strong>{" "}
            {data?.interventionPlan?.mentionToolUsedForRespectiveGoal}
          </p>

          {Object.keys(data?.interventionPlan || {})
            .filter((key) => key.startsWith("week"))
            .map((weekKey, i) => (
              <div
                key={i}
                className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <h4 className="text-lg font-semibold text-[#8879AD] mb-2 capitalize">
                  {weekKey}
                </h4>
                {data?.interventionPlan[weekKey].sessions?.map(
                  (session, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-[#604C91] pl-3 mb-3"
                    >
                      <p>
                        <strong>Session No:</strong> {session.sessionNo}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Goal:</strong> {session.goal.join(", ")}
                      </p>
                      <p>
                        <strong>Activity:</strong> {session.activity.join(", ")}
                      </p>
                      <p>
                        <strong>Child Response:</strong> {session.childResponse}
                      </p>
                    </div>
                  )
                )}
              </div>
            ))}
        </section>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
          <button
            // onClick={onScore}
            className="px-6 py-2 bg-[#D73F7F] hover:bg-[#E16F9F] text-white font-semibold rounded-xl transition-all duration-300"
          >
            Score
          </button>
          <button
            // onClick={onSubmit}
            className="px-6 py-2 bg-[#604C91] hover:bg-[#8879AD] text-white font-semibold rounded-xl transition-all duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default SpecificParticipant;

