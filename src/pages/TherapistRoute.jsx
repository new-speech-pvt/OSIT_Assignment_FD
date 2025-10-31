// import TherapistNavbar from "../components/Therapist/TherapistNavbar";
// import Footer from "../components/Footer";
// import { Route, Routes, Navigate } from "react-router-dom";
// import Assignment from "./Assignment";
// import TherapistDashboard from "./TherapistDashboard";
// import OSITAssignmentPreview from "./OSITAssignmentPreview";

// const TherapistRoute = () => {
//   return (
//     <>
//       {/* <div className=" bg-gray-50"> */}
//       <div className=" w-full h-dvh rounded-[15px]">
//         <TherapistNavbar />
//         <div className="w-full h-dvh">
//           <Routes>
//             <Route path="/" element={<TherapistDashboard />} />

//             <Route path="/assignment" element={<Assignment />} />
//             <Route
//               path="/assignment/:ositAssigmnentId"
//               element={<OSITAssignmentPreview />}
//             />
//           </Routes>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default TherapistRoute;


import TherapistNavbar from "../components/Therapist/TherapistNavbar";
import Footer from "../components/Footer";
import { Route, Routes } from "react-router-dom";
import Assignment from "./Assignment";
import TherapistDashboard from "./TherapistDashboard";
import OSITAssignmentPreview from "./OSITAssignmentPreview";

const TherapistRoute = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <TherapistNavbar />

      {/* Main content */}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<TherapistDashboard />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route
            path="/assignment/:ositAssigmnentId"
            element={<OSITAssignmentPreview />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TherapistRoute;
