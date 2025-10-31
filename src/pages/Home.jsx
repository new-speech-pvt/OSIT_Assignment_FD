
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import { saveUserToLocal } from "../Utils/auth";
// import CardSection from "./CardDetails";
// import { useEffect, useState } from "react";
// import { axiosClient } from "../Utils/axiosClient";
// import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
// import AssignmentForm2 from "../assignment/pages/AssignmentForm2";

// const Home = () => {
//   const navigate = useNavigate();
//   const { logout, user } = useAuthStore();
//   console.log(user);
//   const [loading, setLoading] = useState(false)
//   const [hasAssignment, setHashAssignment] = useState(null);
//   const [assignmentData, setAssignmentData] = useState([])

  // const handleLogout = () => {
  //   // Zustand se user hata do
  //   logout();

  //   // LocalStorage se bhi user data clear karo
  //   saveUserToLocal(null);

  //   // Login page par redirect
  //   navigate("/");
  // };
//   const getUserAssignment = async () => {
//     try {
//       setLoading(true)
      // const response = await axiosClient.get(
      //   `/osit-assignments/participant/${user?.email}`
//       );
//       console.log("User Assignment Response:", response);

//       if (response?.data && response.data.success && response.data.data) {
//         setAssignmentData(response.data.assignments)
//         setHashAssignment(true);
//       } else {
//         setHashAssignment(false);
//       }
//     } catch (error) {

//       console.log("Error fetching assignment:", error);

//       setHashAssignment(false);
//     } finally {
//       setLoading(false)
//     }
//   };

//   useEffect(() => {

//     getUserAssignment();

//   }, []);


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
//         Loading...
//       </div>
//     );
//   }

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
        // <button
        //   onClick={handleLogout}
        //   className="bg-[#E16F9F] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#D73F7F] transition-all"
        // >
        //   Logout
        // </button>
//       </header>

//       {/* Main Content */}
//       <main className="p-4">

//         {assignmentData?.length > 0 ? (

//           <CardSection />

//         ) : (

//           <OsitAssignmentProvider>
//             <AssignmentForm2 />
//           </OsitAssignmentProvider>

//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;



// -----------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { saveUserToLocal } from "../Utils/auth";
import { axiosClient } from "../Utils/axiosClient";
import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
import CardDetails from "../pages/CardDetails"

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [hasAssignment, setHasAssignment] = useState(null); // null = checking

  const handleLogout = () => {
    logout();
    saveUserToLocal(null);
    navigate("/");
  };

  
   const checkAssignment = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/osit-assignments/participant/${user.email}`
      );

      const assignments = data?.data?.assignments || [];
      setHasAssignment(assignments.length > 0);
    } catch (err) {
      console.error("Assignment check error:", err);
      setHasAssignment(false);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    checkAssignment();
  }, [user?.email]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <img
          src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
          alt="Speechgears Research Institute"
          className="w-[294.9px] md:w-[427.7px]"
        />
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
        {hasAssignment ? (
          <CardDetails />
        ) : (
          <OsitAssignmentProvider>
            <AssignmentForm2 />
          </OsitAssignmentProvider>
        )}
      </main>
    </div>
  );
};

export default Home;


