import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import UserRoutes from "./user/UserRoutes";
import TherapistRoute from "./therapist/TherapistRoute";
import Login from "./components/Login";
const App = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <Toaster
        toastOptions={{
          success:{
            duration:10
          }
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
