import AssignmenTableData from "../components/TableDetails/AssignmenTableData";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import { axiosClient } from "../Utils/axiosClient";
import { getUserFromLocal } from "../Utils/auth";

const Assignment = () => {
  const user = getUserFromLocal("authUser");
  console.log("user", user);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  useEffect(() => {
    const getAllAssignments = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/osit-assignments`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        console.log(" Response:", response);
        setData(response?.data?.data?.assignments);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllAssignments();
  }, []);

  if (loading) {
    return <div className="mt-20 text-center">Loading.....</div>;
  }
  return (
    <>
      {/* Header */}
      <div className=" px-10">
        {/* Table */}
        <div className="table-wrapper overflow-auto relative myScrollbar bg-white">
          <AssignmenTableData data={data} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default Assignment;
