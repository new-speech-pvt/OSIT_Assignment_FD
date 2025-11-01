import React from "react";
import Login from "./Login";
import ProtectedRoute from "../ProtectedRoute";
import { Route, Routes, useNavigate } from "react-router";
import HomePage from "./HomePage";
import OSITAssignmentPreview from "./OSITAssignmentPreview";
import { useAuthStore } from "../store/authStore";
import { getUserFromLocal, saveUserToLocal } from "../Utils/auth";
import { Toaster } from "react-hot-toast";

const UserRoutes = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      saveUserToLocal(null);
      navigate("/");
    };

     const {token} = getUserFromLocal()

     console.log(token)

  return (
    <>
     <Toaster
        toastOptions={{
          success: {
            duration: 5000,
          },
        }}
      />

    <div>
      <header>
        <nav className="flex justify-between items-center">
          <img
            src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
            alt="Speechgears Research Institute"
            className="w-[294.9px] md:w-[427.7px] mx-0"
          />
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/assignment/:ositAssigmnentId"
            element={<OSITAssignmentPreview role="USER" />}
          />
        </Route>
      </Routes>
    </div>
    </>
    
  );
};

export default UserRoutes;
