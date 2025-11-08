import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AssignmentForm2 from "../components/AssignmentForm2";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import AssignmentCard from "../components/AssignmentCard";
import { axiosClient } from "../../Utils/axiosClient";
import OsitAssignmentProvider from "../contexts/OsitAssignmentContext";

const Home = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(
        `/osit-assignments/participant/${user?.email}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setData(res.data?.data || null);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#604C91] w-8 h-8" />
      </div>
    );
  }

  // ✅ Wrap AssignmentForm2 with context provider
  if (!data || !data.assignments || data.assignments.length === 0) {
    return (
      <OsitAssignmentProvider>
        <AssignmentForm2 />
      </OsitAssignmentProvider>
    );
  }

  const participant = data.participantId;

  return <AssignmentCard data={data} participant={participant} />;
};

export default Home;
