
// import { useEffect, useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import { saveUserToLocal } from "../Utils/auth";
// import { useNavigate } from "react-router";
// import { axiosClient } from "../Utils/axiosClient";
// import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";

// const HomePage = () => {
//     const { logout, user } = useAuthStore();
//     const navigate = useNavigate();

//     const [assignments, setAssignments] = useState([]);

//     const [loading, setLoading] = useState(true);

//     const [showForm, setShowForm] = useState(false); // 👈 ye decide karega kya dikhana hai

//     useEffect(() => {

//         const fetchData = async () => {

//             try {


//                 const response = await axiosClient.get(
//                     `/osit-assignments/participant/${user?.email}`);

//                 const success = response?.data?.success;

//                 const list = response?.data?.data?.assignments || [];

//                 if (success && list.length > 0) {

//                     setAssignments(list);

//                     setShowForm(false); // ✅ data aaya → form mat dikhao

//                 } else {

//                     setShowForm(true); // ❌ data empty → form dikhao

//                 }

//             } catch (err) {

//                 console.error("Error fetching data:", err);

//                 setShowForm(true); // ❌ error → form dikhao

//             } finally {

//                 setLoading(false);

//             }

//         };

//         fetchData();

//     }, []);

//     const handleLogout = () => {
//         // Zustand se user hata do
//         logout();

//         // LocalStorage se bhi user data clear karo
//         saveUserToLocal(null);

//         // Login page par redirect
//         navigate("/");
//     };

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div className="p-6">

//             {showForm ? (

//                 // agar data empty hai to form component dikhao
//                 <OsitAssignmentProvider />
//             ) : (

//                 // agar data mila hai to cards dikhana
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//                     {assignments.map((item) => (
//                         <div

//                             key={item._id}

//                             className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
//                         >
//                             <h2 className="text-lg font-semibold mb-1">

//                                 {item.participantInfo?.fName} {item.participantInfo?.lName}
//                             </h2>
//                             <p className="text-gray-600 text-sm">

//                                 Email: {item.participantInfo?.email}
//                             </p>
//                             <p className="text-gray-600 text-sm">

//                                 Enrollment: {item.participantInfo?.enrollmentId}
//                             </p>

//                             {item.scoring ? (
//                                 <p className="text-green-600 font-semibold mt-2">

//                                     Scored: {item.scoring.totalObtained}/{item.scoring.totalPossible}
//                                 </p>

//                             ) : (
//                                 <p className="text-yellow-600 font-semibold mt-2">

//                                     Not Scored Yet
//                                 </p>

//                             )}
//                         </div>

//                     ))}
//                 </div>

//             )}
//             <button
//                 onClick={handleLogout}
//                 className="bg-[#E16F9F] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#D73F7F] transition-all"
//             >
//                 Logout
//             </button>
//         </div>

//     );

// };

// export default HomePage;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
import { axiosClient } from "../Utils/axiosClient";
import { useAuthStore } from "../store/authStore";

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
    const navigate = useNavigate();

    // --- Fetch Assignments from API ---
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axiosClient.get(`/osit-assignments/participant/${user?.email}`); // ✅ replace with your real API
                setData(res.data?.data || null);
            } catch (err) {
                console.error("Error fetching assignments:", err);
            }
        };
        fetchAssignments();
    }, []);

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