import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import UserRoutes from "./user/UserRoutes";
import TherapistRoute from "./therapist/TherapistRoute";
import Login from "./components/Login";
import MetaDescriptionComponent from "./components/SEO/MetaDescriptionComponent";
const App = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <MetaDescriptionComponent
        metaTitle={"OSIT Practical Exercise | SpeechGears India "}
      />
      <Toaster
        toastOptions={{
          success: {
            duration: 3000,
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
