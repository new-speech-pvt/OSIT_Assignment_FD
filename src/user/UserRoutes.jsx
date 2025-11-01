import ProtectedRoute from "../ProtectedRoute";
import { Route, Routes, useNavigate } from "react-router";
import HomePage from "../user/pages/HomePage";
import OSITAssignmentPreview from "../components/shared/OSITAssignmentPreview";
import { useAuthStore } from "../store/authStore";
import { getUserFromLocal, saveUserToLocal } from "../Utils/auth";
import { Toaster } from "react-hot-toast";
import OsitAssignmentProvider from "../user/contexts/OsitAssignmentContext";
import { LogOut, User } from "lucide-react";

const UserRoutes = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    saveUserToLocal(null);
    navigate("/");
  };

  const { token } = getUserFromLocal();
  console.log(token);

  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            duration: 5000,
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-white via-body-20 to-white flex flex-col">
        {/* Simple Header */}
        <header className="bg-white shadow-sm border-b border-body-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <img
                  src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
                  alt="Speechgears Research Institute"
                  className="h-8 md:h-10 w-auto"
                />
              </div>

              {/* User Info & Logout */}
              <div className="flex items-center gap-4">
                {/* User Name */}
                <div className="flex items-center gap-2 text-body-70">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-50 to-primary-70 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.profile?.fName || "Participant"}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-body-20 hover:bg-body-30 text-body-70 hover:text-body-100 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={
                <OsitAssignmentProvider>
                  <HomePage />
                </OsitAssignmentProvider>
              } />
              <Route
                path="/assignment/:ositAssigmnentId"
                element={<OSITAssignmentPreview role="USER" />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
};

export default UserRoutes;