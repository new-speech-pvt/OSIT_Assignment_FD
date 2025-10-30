import TherapistNavbar from "../components/Therapist/TherapistNavbar";
import Footer from "../components/Footer";
import { Route, Routes,Navigate } from "react-router-dom";
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
            <Route path="/" element={<TherapistDashboard /> }/>

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
