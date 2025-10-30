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
// import AssignmentForm2 from "../assignment/pages/AssignmentForm2";
// import OsitAssignmentProvider from "../assignment/pages/OsitAssignmentProvider";
import { saveUserToLocal } from "../Utils/auth";
import CardSection from "./CardDetails";

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
      <header className="flex justify-between items-center p-4 bg-[#604C91] text-white shadow-md">
        <h1 className="text-xl font-semibold">Welcome Home 🎉</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-[#604C91] font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* <OsitAssignmentProvider>
          <AssignmentForm2 />
        </OsitAssignmentProvider> */}
        <CardSection/>
      </main>
    </div>
  );
};

export default Home;
