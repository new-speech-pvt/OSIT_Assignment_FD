import Card from "./Card";
import Button from "./Button";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FileText, Download, Eye, User, Star, Calendar } from "lucide-react";

const AssignmentCard = ({ data, participant }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-body-20 to-white py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="h1 text-body-100 font-bold mb-2">OSIT Assignments</h1>
          <p className="text-body-70 text-lg">Manage and review your therapy assignments</p>
        </motion.div>

        {/* Participant Info Card */}
        {participant && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-body-30 p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-70 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="h4 text-body-100 font-semibold capitalize">
                  {participant.fName} {participant.lName}
                </h2>
                <p className="text-body-50 text-sm">Assigned Participant</p>
              </div>
              <div className="ml-auto bg-body-20 px-4 py-2 rounded-xl">
                <p className="text-body-70 text-sm font-semibold">
                  {data.assignments.length} {data.assignments.length === 1 ? 'Assignment' : 'Assignments'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assignments Grid */}
        <div className="grid gap-4 md:gap-6">
          {data.assignments.map((assignment, index) => {
            const { assignmentId, scoring } = assignment;
            const totalScore = scoring?.totalObtained ?? null;
            const totalPossible = scoring?.totalPossible ?? 50;
            const hasScore = totalScore !== null && totalScore > 0;
            const scorePercentage = hasScore ? (totalScore / totalPossible) * 100 : 0;

            return (
              <motion.div
                key={assignmentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-body-30 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Assignment Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-secondary-70 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-body-100 text-lg">
                              Assignment #{index + 1}
                            </h3>
                            <p className="text-body-50 text-sm">
                              ID: {assignmentId.slice(-8)}
                            </p>
                          </div>
                        </div>

                        {/* Score Section */}
                        <div className="flex items-center gap-4">
                          {hasScore ? (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                                  <Star className="w-4 h-4 text-primary-100" />
                                </div>
                                <div>
                                  <p className="text-body-70 text-sm">Score</p>
                                  <p className="text-body-100 font-bold text-lg">
                                    {totalScore}<span className="text-body-50 font-normal">/{totalPossible}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 max-w-[120px]">
                                <div className="w-full bg-body-30 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 transition-all duration-500"
                                    style={{ width: `${scorePercentage}%` }}
                                  />
                                </div>
                                <p className="text-body-50 text-xs mt-1 text-right">
                                  {scorePercentage.toFixed(0)}%
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-body-30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-body-50" />
                              </div>
                              <div>
                                <p className="text-body-70 text-sm">Status</p>
                                <p className="text-body-100 font-semibold">Awaiting Assessment</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col xl:flex-row">
                        <button
                          onClick={() => navigate(`/assignment/${assignmentId}`)}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-ternary-70 to-ternary-100 hover:from-ternary-100 hover:to-ternary-70 text-white px-4 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 min-w-[120px]"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => alert("Download functionality coming soon!")}
                          className="flex items-center justify-center gap-2 bg-white border border-body-30 hover:bg-body-20 text-body-70 px-4 py-3 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 min-w-[120px]"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-body-20 border-t border-body-30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-body-50">
                      <div className="flex items-center gap-4">
                        <span>Assignment ID: {assignmentId}</span>
                        {scoring?.updatedAt && (
                          <span className="hidden sm:inline">
                            • Updated: {new Date(scoring.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hasScore 
                          ? 'bg-primary-50/20 text-primary-100 border border-primary-50/30' 
                          : 'bg-body-30 text-body-70 border border-body-40'
                      }`}>
                        {hasScore ? 'Assessed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {data.assignments.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-body-30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-body-50" />
            </div>
            <h3 className="h4 text-body-70 font-semibold mb-2">No Assignments Found</h3>
            <p className="text-body-50 mb-6">
              There are no assignments available for this participant yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary-70 to-primary-100 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Return to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;