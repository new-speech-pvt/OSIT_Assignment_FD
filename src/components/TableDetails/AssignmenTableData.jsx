import React from "react";
import { Link } from "react-router";

const AssignmenTableData = ({ data }) => {
  console.log(data);

  const headers = [
    { label: "Sr. No", key: "srNo" },
    { label: "Enrollment", key: "enrollment" },
    { label: "Participant Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Date Of Birth", key: "dob" },
    { label: "Gender", key: "gender" },
    { label: "Phone", key: "phone" },
    { label: "State", key: "state" },
    { label: "City", key: "city" },
    { label: "Therapist Type", key: "therapistType" },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No assignments available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Participants List
      </h2>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-[#604C91] text-white">
          {/* <tr>
            <th className="py-3 px-4 text-left">S.NO</th>
            <th className="py-3 px-4 text-left">Participant Id</th>
            <th className="py-3 px-4 text-left">Enrollment</th>

            <th className="py-3 px-4 text-left">Participant Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Gender</th>
            <th className="py-3 px-4 text-left">Phone</th>
            <th className="py-3 px-4 text-left">State</th>

            <th className="py-3 px-4 text-left">City</th>

            <th className="py-3 px-4 text-left">Therapist Type</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr> */}
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
              <td className="py-3 px-4 capitalize">
                {item.participantInfo?.fName} {item.participantInfo?.lName}
              </td>
              <td className="py-3 px-4">{item.participantInfo?.email}</td>
              <td className="py-3 px-4">{item.participantInfo?.email}</td>

              <td className="py-3 px-4 capitalize">
                {item.childProfile?.name}
              </td>
              <td className="py-3 px-4">{item.childProfile?.gender}</td>

              <td className="py-3 px-4 flex justify-center gap-3">
                {/* <button
                  className="bg-[#E16F9F] hover:bg-[#D73F7F] text-white px-4 py-2 rounded-lg shadow transition"
                  onClick={() => alert(`Preview ${item?._id}`)}
                >
                  View
                </button> */}

                <Link
                  className="bg-[#E16F9F] hover:bg-[#D73F7F] text-white px-4 py-2 rounded-lg shadow transition"
                  to={`/assignment/${item?._id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmenTableData;

// const AssignmenTableData = memo(({ data, loading, page }) => {
//   const headers = [
//     { label: "Sr. No", key: "srNo", filterable: false },
//     {
//       label: "Participant ID",
//       key: "patientId",
//       filterable: false,
//     },
//     {
//       label: "Participant Name",
//       key: "patientName",
// //     },
//     { label: "DOB", key: "dob", filterable: false },
//     { label: "Age", key: "age", filterable: false },
//     { label: "Gender", key: "gender", filterable: true },
//     { label: "Parent", key: "parentName", filterable: true },

//   ];
//   return (
//     <>
//       <table className="text-left bg-w">
//         <thead>
//           <tr className="sticky top-0 [&_th]:px-4 [&_th]:py-4 [&_th]:whitespace-nowrap text-primary-c1  b13 md:b1 bg-w z-10">
//             {headers?.map((th) => (
//               <th key={th.key} className="relative">
//                 <button className="flex items-center gap-1">{th.label}</button>
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={10} className="text-center py-20">
//                 {/* <FaSpinner
//                   className="animate-spin text-primary-c1 mx-auto"
//                   size={30}
//                 /> */}
//                 <span className="mt-1 block text-primary-c1">Loading...</span>
//               </td>
//             </tr>
//           ) : data?.length === 0 ? (
//             <tr>
//               <td colSpan={10} className="text-center py-20 text-gray-500">
//                 <div>NO DATA FOUND</div>
//               </td>
//             </tr>
//           ) : (
//             data?.map((item, i) => (
//               <tr
//                 className="snap-start text-left [&_td]:px-4 [&_td]:py-4 [&_td]:w-auto odd:bg-white even:bg-gray-50 b12 md:b9 border-b [&_td]:whitespace-nowrap"
//                 key={i}
//               >
//                 <td key={item?._id}>
//                   <div className="flex items-center gap-2">
//                     {(page - 1) * 10 + i + 1}
//                   </div>
//                 </td>
//                 <td className="relative">{item?.patientId}</td>

//                 <td className="cursor-pointer underline ">
//                   <Link
//                     to={`/therapist/patients/${item?._id}`}
//                     state={{ patient: item }}
//                   >
//                     {item?.patientName}
//                   </Link>
//                 </td>

//                 <td>{item?.dob}</td>
//                 <td>{item?.dob} Yrs</td>
//                 <td className="capitalize">{item?.gender}</td>
//                 <td>{item?.parentName}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </>
//   );
// });
// AssignmenTableData.displayName = "AssignmenTable";

// export default AssignmenTableData;

// // import { useEffect, useState } from "react";

// // // Dummy API call function
// // const fetchParticipants = async () => {
// //   // Simulating an API call delay
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve([
// //         {
// //           id: "P001",
// //           name: "Riya Sharma",
// //           dob: "2008-03-15",
// //           age: 17,
// //           gender: "Female",
// //           parent: "Anita Sharma",
// //         },
// //       ]);
// //     }, 1000);
// //   });
// // };

// // export default function AssignmenTableData() {
// //   const [participants, setParticipants] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const getData = async () => {
// //       const data = await fetchParticipants();
// //       setParticipants(data);
// //       setLoading(false);
// //     };
// //     getData();
// //   }, []);

// //   const handleScoreClick = (id) => {
// //     console.log(`Navigate to Score Page for Participant ID: ${id}`);
// //     // Example: navigate(`/score/${id}`);
// //   };

// //   const handlePreviewClick = (id) => {
// //     console.log(`Navigate to Preview Page for Participant ID: ${id}`);
// //     // Example: navigate(`/preview/${id}`);
// //   };

// //   return (
// //     <div className="p-4 sm:p-8">
// //       <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
// //         Participants List
// //       </h2>

// //       <div className="overflow-x-auto shadow-lg rounded-2xl">
// //         {loading ? (
// //           <div className="text-center py-6 text-gray-500">Loading...</div>
// //         ) : (
// //           <table className="min-w-full border-collapse bg-white text-sm">
// //             <thead className="bg-[#604C91] text-white text-left">
// //               <tr>
// //                 <th className="py-3 px-4">Sr. No</th>
// //                 <th className="py-3 px-4">Participant ID</th>
// //                 <th className="py-3 px-4">Participant Name</th>
// //                 <th className="py-3 px-4">DOB</th>
// //                 <th className="py-3 px-4">Age</th>
// //                 <th className="py-3 px-4">Gender</th>
// //                 <th className="py-3 px-4">Parent</th>
// //                 <th className="py-3 px-4 text-center">Score</th>
// //                 <th className="py-3 px-4 text-center">Preview</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {participants.map((p, index) => (
// //                 <tr
// //                   key={p.id}
// //                   className="border-b hover:bg-blue-50 transition-colors duration-200"
// //                 >
// //                   <td className="py-3 px-4">{index + 1}</td>
// //                   <td className="py-3 px-4">{p.id}</td>
// //                   <td className="py-3 px-4">{p.name}</td>
// //                   <td className="py-3 px-4">{p.dob}</td>
// //                   <td className="py-3 px-4">{p.age}</td>
// //                   <td className="py-3 px-4">{p.gender}</td>
// //                   <td className="py-3 px-4">{p.parent}</td>
// //                   <td className="py-3 px-4 text-center">
// //                     <button
// //                       onClick={() => handleScoreClick(p.id)}
// //                       className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
// //                     >
// //                       Score
// //                     </button>
// //                   </td>
// //                   <td className="py-3 px-4 text-center">
// //                     <button
// //                       onClick={() => handlePreviewClick(p.id)}
// //                       className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
// //                     >
// //                       Preview
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
