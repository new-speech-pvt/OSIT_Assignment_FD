import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
import { axiosClient } from "../Utils/axiosClient";
import { useAuthStore } from "../store/authStore";
import { Loader2 } from "lucide-react";

// Dummy imports — replace these with your actual components

// --- Reusable UI ---
const Card = ({ children, className = "" }) => (
    <div
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 sm:p-6 transition-all hover:shadow-lg ${className}`}
    >
        {children}
    </div>
);

const Button = ({ children, onClick, variant = "primary" }) => {
    const base =
        "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none";
    const styles =
        variant === "primary"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-800";
    return (
        <button onClick={onClick} className={`${base} ${styles}`}>
            {children}
        </button>
    );
};

// --- Main Component ---
const AssignmentList = () => {
    const {user} = useAuthStore()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    // --- Fetch Assignments from API ---
    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true)
            try {
                const res = await axiosClient.get(`/osit-assignments/participant/${user?.email}`, {
                    headers:{
                        Authorization: `Bearer ${user?.token}`
                    }
                }); // ✅ replace with your real API
                setData(res.data?.data || null);
            } catch (err) {
                console.error("Error fetching assignments:", err);
            }finally{
                setLoading(false)
            }
        };
        fetchAssignments();
    }, []);

    if(loading) {return (
        <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#604C91] w-8 h-8" />
      </div>
    )}

    // --- Show fallback form if no data or no assignments ---
    if (!data || !data.assignments || data.assignments.length === 0) {
        return (
            <OsitAssignmentProvider>
                <AssignmentForm2 />
            </OsitAssignmentProvider>
        );
    }

    const participant = data.participantId;

    return (
        <motion.div
            className="max-w-3xl mx-auto mt-10 px-4 sm:px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
                🧩 OSIT Assignments
            </h2>

            <div className="space-y-6">
                {data.assignments.map((assignment, index) => {
                    const { assignmentId, scoring } = assignment;
                    const totalScore = scoring?.totalObtained ?? null;
                    const totalPossible = scoring?.totalPossible ?? 50;
                    const hasScore = totalScore !== null && totalScore > 0;

                    return (
                        <Card key={index}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                {/* Left: Participant Info */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {participant?.fName} {participant?.lName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Assignment ID:{" "}
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {assignmentId}
                                        </span>
                                    </p>
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex gap-2 w-full sm:w-auto justify-end">
                                    <Button
                                        onClick={() => navigate(`/assignment/${assignmentId}`)}
                                        variant="primary"
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => alert("Download logic coming soon!")}
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>

                            {/* Score Section */}
                            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                                {hasScore ? (
                                    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <span className="font-medium">Total Score:</span>{" "}
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {totalScore} / {totalPossible}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-gray-500 italic text-sm sm:text-base">
                                        No score has been given yet.
                                    </p>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default AssignmentList;