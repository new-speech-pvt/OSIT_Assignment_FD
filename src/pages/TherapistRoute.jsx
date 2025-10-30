import TherapistNavbar from "../components/Therapist/TherapistNavbar";
import Footer from "../components/Footer";
import { Route, Routes } from "react-router";
import Assignment from "./Assignment";
import TherapistDashboard from "./TherapistDashboard";
import SpecificParticipant from "./SpecificParticipant";

const TherapistRoute = () => {
  return (
    <>
      {/* <div className=" bg-gray-50"> */}
      <div className=" w-full h-dvh rounded-[15px]">
        <TherapistNavbar />
        <div className="w-full h-dvh">
          <Routes>
            <Route path="/dashboard" element={<TherapistDashboard />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route
              path="/assignment/:participantId"
              element={<SpecificParticipant />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TherapistRoute;
