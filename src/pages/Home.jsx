// // import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
// // import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";

// // const Home = () => {
// //   return (
// //     <>
// //       <OsitAssignmentProvider>
// //         <AssignmentForm2 />
// //       </OsitAssignmentProvider>
// //     </>
// //   );
// // };

// // export default Home;

// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// // import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
// // import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
// import { saveUserToLocal } from "../Utils/auth";
// import CardSection from "./CardDetails";
// import { useEffect } from "react";
// import { axiosClient } from "../Utils/axiosClient";

// const Home = () => {
//   const navigate = useNavigate();
//   const { logout, user } = useAuthStore();
//   console.log(user);

//   const handleLogout = () => {
//     // Zustand se user hata do
//     logout();

//     // LocalStorage se bhi user data clear karo
//     saveUserToLocal(null);

//     // Login page par redirect
//     navigate("/");
//   };
//   const getUserAssignment = async () => {
//     try {
//       const response = await axiosClient.get(
//         `/osit-assignments/participant/${user?.email}`
//       );
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getUserAssignment();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navbar / Header Section */}
//       <header className="flex justify-between items-center p-4 bg-white text-white shadow-md">
//         <div className="flex items-center bg-white">
//           <img
//             src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
//             alt="Speechgears Research Institute"
//             className="w-[294.9px] md:w-[427.7px] mx-0"
//           />
//         </div>{" "}
//         <button
//           onClick={handleLogout}
//           className="bg-[#E16F9F] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#D73F7F] transition-all"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="p-4">
//         {/* <OsitAssignmentProvider>
//           <AssignmentForm2 />
//         </OsitAssignmentProvider> */}
//         <CardSection />
//       </main>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { saveUserToLocal } from "../Utils/auth";
import { axiosClient } from "../Utils/axiosClient";
import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
import CardDetails from "../pages/CardDetails";

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]); // <-- store full list

  const handleLogout = () => {
    logout();
    saveUserToLocal(null);
    navigate("/");
  };

  const checkAssignment = async () => {
    try {
      if (!user?.email) {
        setAssignments([]); // no user → empty
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await axiosClient.get(
        `/osit-assignments/participant/${user.email}`
      );

      if (data?.success) {
        const list = data?.data?.assignments || [];
        setAssignments(list);
      } else {
        setAssignments([]); // if API says success=false
      }
    } catch (err) {
      console.error("Assignment check error:", err);
      setAssignments([]); // error → treat as no assignment
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAssignment();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  // ✅ Condition: agar assignments.length === 0 → form dikhao
  const hasAssignments = assignments && assignments.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <img
          src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
          alt="Speechgears Research Institute"
          className="w-[294.9px] md:w-[427.7px]"
        />
        <button
          onClick={handleLogout}
          className="bg-[#E16F9F] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#D73F7F] transition-all"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {hasAssignments ? (
          // ✅ API se data mila → CardDetails dikhana
          <CardDetails assignments={assignments} />
        ) : (
          // ❌ API se kuch nahi aaya → Form dikhana
          <OsitAssignmentProvider>
            <AssignmentForm2 />
          </OsitAssignmentProvider>
        )}
      </main>
    </div>
  );
};

export default Home;

