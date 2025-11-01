import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AssignmentForm2 from "../components/AssignmentForm2";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import AssignmentCard from "../components/AssignmentCard";
import { axiosClient } from "../../Utils/axiosClient";


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

  if (!data || !data.assignments || data.assignments.length === 0) {
    return <AssignmentForm2 />;
  }

  const participant = data.participantId;

  return <AssignmentCard data={data} participant={participant} />;
};

export default Home;
