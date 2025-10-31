import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import UserRoutes from "./pages/UserRoutes";
import TherapistRoute from "./pages/TherapistRoute";
import Login from "./pages/Login";
const App = () => {
  const { user } = useAuthStore();
  if (!user) {
    return <Login />;
  }
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
        {user?.role === "THERAPIST" ? <TherapistRoute /> : <UserRoutes />}
      </div>
    </>
  );
};

export default App;

// import { Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import ProtectedRoute from "./ProtectedRoute";

// const App = () => {
//   return (
//     <>
//       <Routes>
//         {/* Login Page */}

//         <Route path="/" element={<Login />} />

//         <Route element={<ProtectedRoute />}>
//           <Route path="/home" element={<Home />} />
//         </Route>
//       </Routes>
//     </>
//   );
// };

// export default App;

// import AssignmentForm2 from "./assignment/pages/AssignmentForm2";
// import OsitAssignmentProvider from "./assignment/pages/OsitAssignmentProvider";

// const App = () => {
//   return (
//     <>
//       <OsitAssignmentProvider>
//         <AssignmentForm2 />
//       </OsitAssignmentProvider>
//     </>
//   );
// };

// export default App;
