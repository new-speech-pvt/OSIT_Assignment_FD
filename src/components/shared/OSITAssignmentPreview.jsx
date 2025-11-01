import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, XCircle, User, Mail, Phone, Calendar, Stethoscope, FileText, ChevronDown, ChevronUp, Star, MapPin, Heart } from "lucide-react";
import { useParams } from "react-router";
import OSITScoringForm from "./OsitScoring";
import { axiosClient } from "../../Utils/axiosClient";

const OSITAssignmentPreview = ({ role = "THERAPIST" }) => {
  const { ositAssigmnentId } = useParams();
  const [data, setData] = useState(null);
  const [openWeek, setOpenWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignment = useCallback(async () => {
    try {
      const res = await axiosClient.get(`/osit-assignments/${ositAssigmnentId}`);
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
  }, [ositAssigmnentId, fetchAssignment]);

  const toggleWeek = (week) => {
    setOpenWeek(openWeek === week ? null : week);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-body-20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="animate-spin text-primary-100 w-12 h-12 md:w-16 md:h-16" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-70 blur-sm opacity-20 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-xl md:h4 text-body-100 mt-4 md:mt-6 font-semibold">Loading Assignment</h3>
          <p className="text-body-50 mt-2 text-sm">Please wait while we fetch the details</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-body-20 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-xl md:h4 text-body-100 font-semibold mb-2">Error Loading Assignment</h3>
          <p className="text-body-70 mb-4 text-sm md:text-base">{error}</p>
          <button 
            onClick={fetchAssignment}
            className="bg-gradient-to-r from-primary-70 to-primary-100 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm md:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!data) return null;

  const { assignment, scoring } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-body-20 to-white py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 lg:p-8 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:h1 text-body-100 font-bold mb-2">OSIT Assignment</h1>
            <p className="text-body-70 text-sm md:text-lg">Comprehensive overview of assignment details</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="bg-body-20 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-primary-100">{scoring?.totalObtained || 0}</div>
              <div className="text-body-50 text-xs md:text-sm">Score</div>
            </div>
            <div className="bg-body-20 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-secondary-100">{scoring?.totalPossible || 0}</div>
              <div className="text-body-50 text-xs md:text-sm">Max Score</div>
            </div>
            <div className="bg-body-20 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-ternary-100">
                {Object.keys(assignment?.interventionPlan || {}).filter(key => key.startsWith('week')).length}
              </div>
              <div className="text-body-50 text-xs md:text-sm">Weeks</div>
            </div>
            <div className="bg-body-20 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
              <div className="text-lg md:text-2xl font-bold text-body-100">
                {assignment?.interventionPlan ? Object.values(assignment.interventionPlan).reduce((acc, week) => acc + (week.sessions?.length || 0), 0) : 0}
              </div>
              <div className="text-body-50 text-xs md:text-sm">Sessions</div>
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Therapist Details */}
            {scoring && role === "THERAPIST" && (
              <div className="bg-gradient-to-br from-secondary-50/20 to-secondary-70/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-secondary-50/30">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-secondary-70 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base md:h4 text-body-100 font-semibold">Therapist</h2>
                    <p className="text-body-50 text-xs md:text-sm">Assigned professional</p>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                    <span className="text-body-70 text-sm">{data?.scoring?.therapist?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                    <span className="text-body-70 text-sm truncate">{scoring?.therapist?.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Participant Info */}
            <div className="bg-gradient-to-br from-primary-50/20 to-primary-70/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-primary-50/30">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-70 rounded-lg md:rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base md:h4 text-body-100 font-semibold">Participant</h2>
                  <p className="text-body-50 text-xs md:text-sm">Assignment recipient</p>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                  <span className="text-body-70 text-sm capitalize">
                    {assignment?.participantInfo?.fName} {assignment?.participantInfo?.lName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                  <span className="text-body-70 text-sm truncate">{assignment?.participantInfo?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                  <span className="text-body-70 text-sm">{assignment?.participantInfo?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Child Profile */}
        <motion.div
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 lg:p-8 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-ternary-70 rounded-lg md:rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:h3 text-body-100 font-semibold">Child Profile</h2>
              <p className="text-body-50 text-xs md:text-sm">Patient information and medical background</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            <div className="space-y-1">
              <label className="text-body-50 text-xs md:text-sm font-medium">Full Name</label>
              <p className="text-body-100 font-medium text-sm md:text-base">{assignment?.childProfile?.name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-body-50 text-xs md:text-sm font-medium">Gender</label>
              <p className="text-body-100 font-medium text-sm md:text-base capitalize">{assignment?.childProfile?.gender}</p>
            </div>
            <div className="space-y-1">
              <label className="text-body-50 text-xs md:text-sm font-medium">Date of Birth</label>
              <p className="text-body-100 font-medium text-sm md:text-base">
                {new Date(assignment?.childProfile?.dob).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-body-50 text-xs md:text-sm font-medium">Diagnosis</label>
              <p className="text-body-100 font-medium text-sm md:text-base">{assignment?.childProfile?.diagnosis}</p>
            </div>
            <div className="space-y-1">
              <label className="text-body-50 text-xs md:text-sm font-medium">Present Complaint</label>
              <p className="text-body-100 font-medium text-sm md:text-base">{assignment?.childProfile?.presentComplaint}</p>
            </div>
          </div>

          {assignment?.childProfile?.medicalHistory && (
            <div className="mt-4 md:mt-6">
              <label className="text-body-50 text-xs md:text-sm font-medium block mb-2 md:mb-3">Medical History</label>
              <div
                className="prose prose-sm max-w-none bg-body-20 p-3 md:p-4 rounded-lg md:rounded-xl border border-body-30 text-sm"
                dangerouslySetInnerHTML={{
                  __html: assignment?.childProfile?.medicalHistory || "",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Assignment Details */}
        <motion.div
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 lg:p-8 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-70 rounded-lg md:rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:h3 text-body-100 font-semibold">Assignment Details</h2>
              <p className="text-body-50 text-xs md:text-sm">Comprehensive assignment information</p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {Object.entries(assignment?.assignmentDetail || {}).map(([key, value]) => {
              if (["_id"].includes(key)) return null;

              return (
                <div key={key} className="border-b border-body-30 pb-4 md:pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-body-100 font-semibold mb-2 md:mb-3 text-sm md:text-base capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h3>
                  <div
                    className="prose prose-sm max-w-none bg-body-20 p-3 md:p-4 rounded-lg md:rounded-xl border border-body-30 text-sm"
                    dangerouslySetInnerHTML={{ __html: value }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Intervention Plan */}
        <motion.div
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 lg:p-8 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-secondary-70 rounded-lg md:rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:h3 text-body-100 font-semibold">Intervention Plan</h2>
              <p className="text-body-50 text-xs md:text-sm">Weekly sessions and activities</p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            {Object.entries(assignment?.interventionPlan || {})
              .filter(([key]) => key.startsWith("week"))
              .map(([week, weekData]) => (
                <div key={week} className="border border-body-30 rounded-lg md:rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleWeek(week)}
                    className="w-full flex justify-between items-center px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-body-20 to-white hover:from-body-30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-70 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-xs md:text-sm">
                          {week.replace('week', 'W')}
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-body-100 text-sm md:text-base capitalize">{week}</h3>
                        <p className="text-body-50 text-xs md:text-sm">
                          {weekData.sessions?.length || 0} sessions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="text-body-50 text-xs md:text-sm hidden sm:inline">
                        {openWeek === week ? 'Hide' : 'Show'} sessions
                      </span>
                      {openWeek === week ? (
                        <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-body-50" />
                      ) : (
                        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-body-50" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openWeek === week && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 md:p-6 bg-body-20 border-t border-body-30">
                          <div className="grid gap-3 md:gap-4">
                            {weekData?.sessions?.map((session, index) => (
                              <div key={session._id} className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-body-30">
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                  <div className="w-6 h-6 md:w-8 md:h-8 bg-ternary-70 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-body-100 text-sm md:text-base">Session {session.sessionNo}</h4>
                                    <p className="text-body-50 text-xs md:text-sm">
                                      {new Date(session.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                                  <div>
                                    <label className="text-body-50 font-medium">Goals</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {session.goal.map((goalItem, idx) => (
                                        <span key={idx} className="bg-primary-50/20 text-primary-100 px-2 py-1 rounded text-xs">
                                          {goalItem}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-body-50 font-medium">Activities</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {session.activity.map((activityItem, idx) => (
                                        <span key={idx} className="bg-secondary-50/20 text-secondary-100 px-2 py-1 rounded text-xs">
                                          {activityItem}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                {session.childResponse && (
                                  <div className="mt-2 md:mt-3">
                                    <label className="text-body-50 font-medium text-xs md:text-sm">Child Response</label>
                                    <p className="text-body-70 text-xs md:text-sm mt-1">{session.childResponse}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Scoring Section */}
        {scoring ? (
          <motion.div
            className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-primary-70 to-primary-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <Star className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:h3 text-body-100 font-semibold">Assessment Scoring</h2>
                <p className="text-body-50 text-xs md:text-sm">Detailed performance evaluation</p>
              </div>
            </div>

            {/* Mobile Cards for Scoring */}
            <div className="lg:hidden space-y-3">
              {scoring?.criteriaList?.map((item, index) => (
                <div key={item._id} className="border border-body-30 rounded-lg p-3 bg-body-20/30">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-body-100 text-sm flex-1 pr-2">{item.criteria}</h3>
                    <div className="text-right">
                      <div className="text-primary-100 font-bold text-lg">{item.obtainedMarks}</div>
                      <div className="text-body-50 text-xs">/ {item.maxMarks}</div>
                    </div>
                  </div>
                  {item.remarks && (
                    <p className="text-body-70 text-xs mt-2">Remarks: {item.remarks}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table for Scoring */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-secondary-70 to-secondary-100 text-white">
                    <th className="p-3 md:p-4 text-left font-semibold rounded-tl-xl">Criteria</th>
                    <th className="p-3 md:p-4 text-center font-semibold">Max Marks</th>
                    <th className="p-3 md:p-4 text-center font-semibold">Obtained</th>
                    <th className="p-3 md:p-4 text-left font-semibold rounded-tr-xl">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {scoring?.criteriaList?.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`border-b border-body-30 transition-colors ${
                        index % 2 === 0 ? 'bg-body-20/30' : 'bg-white'
                      } hover:bg-primary-50/10`}
                    >
                      <td className="p-3 md:p-4 font-medium text-body-100 text-sm">{item.criteria}</td>
                      <td className="p-3 md:p-4 text-center text-body-70 text-sm">{item.maxMarks}</td>
                      <td className="p-3 md:p-4 text-center">
                        <span className="font-semibold text-primary-100 text-lg">
                          {item.obtainedMarks}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 text-body-70 text-sm">{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-primary-50/20 to-primary-70/10 rounded-lg md:rounded-xl border border-primary-50/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-body-100 text-sm md:text-base">Total Score</h3>
                  <p className="text-body-50 text-xs md:text-sm">Overall performance summary</p>
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold text-primary-100">
                    {scoring?.totalObtained} / {scoring?.totalPossible}
                  </div>
                  <div className="text-body-50 text-xs md:text-sm">
                    {((scoring?.totalObtained / scoring?.totalPossible) * 100).toFixed(1)}% Completion
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : role === "THERAPIST" ? (
          <OSITScoringForm
            ositAssigmnentId={ositAssigmnentId}
            callback={fetchAssignment}
          />
        ) : null}
      </div>
    </div>
  );
};

export default OSITAssignmentPreview;