// import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
// import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";

// const Home = () => {
//   return (
//     <>
//       <OsitAssignmentProvider>
//         <AssignmentForm2 />
//       </OsitAssignmentProvider>
//     </>
//   );
// };

// export default Home;

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
import { saveUserToLocal } from "../Utils/auth";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    // Zustand se user hata do
    logout();

    // LocalStorage se bhi user data clear karo
    saveUserToLocal(null);

    // Login page par redirect
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar / Header Section */}
      <header className="flex justify-between items-center p-4 bg-white text-white shadow-md">
        <div className="flex items-center bg-white">
          <img
            src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
            alt="Speechgears Research Institute"
            className="w-[294.9px] md:w-[427.7px] mx-0"
          />
        </div>{" "}
        <button
          onClick={handleLogout}
          className="bg-[#E16F9F] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#D73F7F] transition-all"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <OsitAssignmentProvider>
          <AssignmentForm2 />
        </OsitAssignmentProvider>
      </main>
    </div>
  );
};

export default Home;
