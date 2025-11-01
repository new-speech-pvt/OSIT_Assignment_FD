import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Loader2, XCircle } from "lucide-react";
import { useParams } from "react-router";
import { axiosClient } from "../Utils/axiosClient";
import OSITScoringForm from "../components/Scoring/OsitScoring";

const OSITAssignmentPreview = ({ role = "THERAPIST" }) => {
  const { ositAssigmnentId } = useParams();
  console.log(ositAssigmnentId);
  const [data, setData] = useState(null);

  const [openWeek, setOpenWeek] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ✅ Fetch API data

  const fetchAssignment = useCallback(async () => {
    try {
      const res = await axiosClient.get(
        `/osit-assignments/${ositAssigmnentId}`
      );

      setData(res.data?.data);
    } catch (err) {
      console.error(err);

      setError("Failed to load assignment data.");
    } finally {
      setLoading(false);
    }
  }, [ositAssigmnentId]);

  useEffect(() => {
    fetchAssignment();
  }, [ositAssigmnentId]);

  const toggleWeek = (week) => {
    setOpenWeek(openWeek === week ? null : week);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#604C91] w-8 h-8" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <XCircle className="w-8 h-8 mb-2" />
        <p>{error}</p>
      </div>
    );

  if (!data) return null;

  const { assignment, scoring } = data;
  console.log(data);

  console.log(assignment, scoring);

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-20 my-10 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
        🧾 OSIT Assignment Preview
      </h1>

      {/* Therapist + Participant Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {scoring && role === "THERAPIST" && (
          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-3 text-[#604C91]">
              Therapist Details
            </h2>
            <p>
              <strong>Name:</strong> {data?.scoring?.therapist?.name}
            </p>
            <p>
              <strong>Email:</strong> {scoring?.therapist?.email}
            </p>
          </div>
        )}
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-3 text-[#604C91]">
            Participant Info
          </h2>
          <p>
            <strong>Name:</strong> {assignment?.participantInfo?.fName}{" "}
            {assignment?.participantInfo?.lName}
          </p>
          <p>
            <strong>Email:</strong> {assignment?.participantInfo?.email}
          </p>
          <p>
            <strong>Phone:</strong> {assignment?.participantInfo?.phone}
          </p>
        </div>
      </div>

      {/* Child Profile */}
      <div className="p-5 rounded-xl mb-8 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-3 text-[#604C91]">
          Child Profile
        </h2>
        <p>
          <strong>Name:</strong> {assignment?.childProfile?.name}
        </p>
        <p>
          <strong>Gender:</strong> {assignment?.childProfile?.gender}
        </p>
        <p>
          <strong>DOB:</strong>{" "}
          {new Date(assignment?.childProfile?.dob).toLocaleDateString()}
        </p>
        <p>
          <strong>Diagnosis:</strong> {assignment?.childProfile?.diagnosis}
        </p>
        <p>
          <strong>Present Complaint:</strong>{" "}
          {assignment?.childProfile?.presentComplaint}
        </p>
        <div className="mt-3">
          <p className="font-semibold">Medical History:</p>
          <div
            className="prose prose-sm dark:prose-invert bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-700"
            dangerouslySetInnerHTML={{
              __html: assignment?.childProfile?.medicalHistory || "",
            }}
          ></div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="p-5 rounded-xl mb-8 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-3 text-[#604C91]">
          Assignment Details
        </h2>

        {Object.entries(assignment?.assignmentDetail || {}).map(
          ([key, value]) => {
            if (["_id"].includes(key)) return null;

            return (
              <div key={key} className="mb-3">
                <p className="font-semibold capitalize text-gray-700 dark:text-gray-200">
                  {key.replace(/([A-Z])/g, " $1")}:
                </p>
                <div
                  className="prose prose-sm dark:prose-invert bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-700"
                  dangerouslySetInnerHTML={{ __html: value }}
                ></div>
              </div>
            );
          }
        )}
      </div>

      {/* Intervention Plan */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#604C91]">
          Intervention Plan
        </h2>

        {Object.entries(assignment?.interventionPlan || {})

          .filter(([key]) => key.startsWith("week"))

          .map(([week, weekData]) => (
            <div key={week} className="mb-3">
              <button
                onClick={() => toggleWeek(week)}
                className="w-full flex justify-between items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all"
              >
                <span className="capitalize">{week}</span>
                <span>{openWeek === week ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {openWeek === week && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border border-t-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                      {weekData?.sessions?.map((session) => (
                        <div key={session._id} className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Date: {new Date(session.date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Session No:</strong> {session.sessionNo}
                          </p>
                          <p>
                            <strong>Goal:</strong> {session.goal.join(", ")}
                          </p>
                          <p>
                            <strong>Activity:</strong>{" "}
                            {session.activity.join(", ")}
                          </p>
                          <p>
                            <strong>Child Response:</strong>{" "}
                            {session.childResponse}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
      </div>

      {/* Scoring Table */}
      {scoring ? (
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-[#604C91]">
            Assessment Scoring
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2 text-left">Criteria</th>
                  <th className="p-2 text-center">Max Marks</th>
                  <th className="p-2 text-center">Obtained</th>
                  <th className="p-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {scoring?.criteriaList?.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-2">{item.criteria}</td>
                    <td className="p-2 text-center">{item.maxMarks}</td>
                    <td className="p-2 text-center text-blue-600 font-semibold">
                      {item.obtainedMarks}
                    </td>
                    <td className="p-2">{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right text-gray-700 dark:text-gray-200 font-medium">
            Total:{" "}
            <span className="text-[#604C91] dark:text-[#6d5c96] font-semibold">
              {scoring?.totalObtained}
            </span>{" "}
            / {scoring?.totalPossible}
          </div>
        </div>
      ) : role === "THERAPIST" ? (
        <OSITScoringForm
          ositAssigmnentId={ositAssigmnentId}
          callback={fetchAssignment}
        />
      ) : null}
    </motion.div>
  );
};

export default OSITAssignmentPreview;
