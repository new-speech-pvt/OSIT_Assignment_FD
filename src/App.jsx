import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import UserRoutes from "./pages/UserRoutes";
import TherapistRoute from "./pages/TherapistRoute";
import Login from "./pages/Login";
const App = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <Toaster
        toastOptions={{
          success: {
            duration: 5000,
          },
        }}
      />

      {user ? (
        <div>
          {user?.role === "THERAPIST" ? <TherapistRoute /> : <UserRoutes />}
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
