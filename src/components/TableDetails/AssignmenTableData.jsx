import React from "react";
import { Link } from "react-router";

const AssignmenTableData = ({ data }) => {
  console.log(data);

  const headers = [
    { label: "Sr. No", key: "srNo" },
    { label: "Enrollment", key: "enrollment" },
    { label: "Participant Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Gender", key: "gender" },
    { label: "Phone", key: "phone" },
    { label: "State", key: "state" },
    { label: "City", key: "city" },
    { label: "Therapist Type", key: "therapistType" },
    { label: "Status", key: "status" },
    { label: "Score", key: "score" },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 mt-20">
        No assignments available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4 mt-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Participants List
      </h2>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-[#604C91] text-white">
          <tr className="sticky top-0 [&_th]:px-4 [&_th]:py-4 [&_th]:whitespace-nowrap text-primary-c1  b13 md:b1 bg-w z-10">
            {headers?.map((th) => (
              <th key={th.key}>{th.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr
              key={item._id}
              className={`border-b hover:bg-gray-50 transition-all ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">
                {item.participantInfo?.enrollmentType}
              </td>

              <td className="py-3 px-4 capitalize">
                {item.participantInfo?.fName} {item.participantInfo?.lName}
              </td>
              <td className="py-3 px-4">{item.participantInfo?.email}</td>
              <td className="py-3 px-4">{item.childProfile?.gender}</td>
              <td className="py-3 px-4">{item.participantInfo?.phone}</td>
              <td className="py-3 px-4">{item.participantInfo?.state}</td>
              <td className="py-3 px-4">{item.participantInfo?.city}</td>
              <td className="py-3 px-4">
                {item.participantInfo?.therapistType}
              </td>

              <td className="py-3 px-4 flex justify-center gap-3">
                <Link
                  className="bg-[#E16F9F] hover:bg-[#D73F7F] text-white px-4 py-2 rounded-lg shadow transition"
                  to={`/assignment/${item?._id}`}
                >
                  View
                </Link>
              </td>
              <td>
                <div className="bg-[#6fe175] hover:bg-[#97e16f] text-white px-4 py-2 rounded-lg shadow transition">
                  {item?.scoring ? (
                    <span>
                      {item?.scoring?.totalObtained}/
                      {item?.scoring?.totalPossible}
                    </span>
                  ) : (
                    "--"
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmenTableData;
