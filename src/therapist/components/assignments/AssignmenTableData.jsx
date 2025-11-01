import { Link } from "react-router";
import { Eye, ChevronRight, User, Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import { useState } from "react";

const AssignmenTableData = ({ data }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const headers = [
    { label: "Participant", key: "participant", priority: "high" },
    { label: "Enrollment", key: "enrollment", priority: "medium" },
    { label: "Contact", key: "contact", priority: "medium" },
    { label: "Location", key: "location", priority: "low" },
    { label: "Therapist", key: "therapist", priority: "low" },
    { label: "Actions", key: "actions", priority: "high" },
    { label: "Score", key: "score", priority: "high" },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 px-4">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-body-30 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6 md:w-8 md:h-8 text-body-50" />
        </div>
        <h3 className="text-lg md:h4 text-body-70 font-semibold mb-2">No Participants Found</h3>
        <p className="text-body-50 text-sm md:text-base">There are no participants assigned to you yet.</p>
      </div>
    );
  }

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden">
      {/* Table Header - Visible on all screens */}
      <div className="px-4 md:px-6 py-4 border-b border-body-30 bg-gradient-to-r from-body-20 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg md:h3 text-body-100 font-bold">Participants List</h2>
            <p className="text-body-50 text-xs md:text-sm mt-1">Manage and view all participant details</p>
          </div>
          <div className="text-xs md:text-sm text-body-50 bg-white px-3 py-2 rounded-lg border border-body-30">
            Total: {data.length} participants
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-secondary-70 to-secondary-100">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap rounded-tl-xl">
                Sr. No
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                Enrollment
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                Participant Name
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                Email
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                Gender
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                Phone
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                State
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                City
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                Therapist Type
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap">
                Status
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-white font-semibold text-sm whitespace-nowrap rounded-tr-xl">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-body-30">
            {data?.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gradient-to-r hover:from-primary-50/5 hover:to-primary-70/5 transition-all duration-200 group"
              >
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="w-8 h-8 bg-body-20 rounded-lg flex items-center justify-center text-body-70 font-semibold text-sm">
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-50/20 text-secondary-100 border border-secondary-50/30">
                    {item.participantInfo?.enrollmentType || "N/A"}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-50 to-primary-70 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-body-100 text-sm md:text-base capitalize">
                        {item.participantInfo?.fName} {item.participantInfo?.lName}
                      </div>
                      <div className="text-xs text-body-50">Participant</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                    <span className="text-body-70 text-sm">{item.participantInfo?.email}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${item.childProfile?.gender === 'male' 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : item.childProfile?.gender === 'female'
                      ? 'bg-pink-50 text-pink-600 border border-pink-200'
                      : 'bg-body-20 text-body-70 border border-body-30'
                    }`}
                  >
                    {item.childProfile?.gender || "N/A"}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                    <span className="text-body-70 text-sm">{item.participantInfo?.phone || "N/A"}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-body-50" />
                    <span className="text-body-70 text-sm">{item.participantInfo?.state || "N/A"}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className="text-body-70 text-sm">{item.participantInfo?.city || "N/A"}</span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ternary-50/20 text-ternary-100 border border-ternary-50/30 capitalize">
                    {item.participantInfo?.therapistType || "N/A"}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <Link
                    to={`/assignment/${item?._id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-ternary-70 to-ternary-100 hover:from-ternary-100 hover:to-ternary-70 text-white px-3 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 group/btn"
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">View</span>
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  {item?.scoring ? (
                    <div className="bg-gradient-to-r from-primary-50 to-primary-70 hover:from-primary-70 hover:to-primary-100 text-white px-3 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 text-center">
                      {item.scoring.totalObtained}/{item.scoring.totalPossible}
                    </div>
                  ) : (
                    <div className="bg-body-20 text-body-50 px-3 py-2 rounded-xl font-semibold text-sm text-center border border-body-30">
                      --
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {data?.map((item, index) => (
          <div
            key={item._id}
            className="border-b border-body-30 last:border-b-0 p-4 hover:bg-body-20 transition-all duration-200"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-70 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-body-100 capitalize">
                    {item.participantInfo?.fName} {item.participantInfo?.lName}
                  </div>
                  <div className="text-xs text-body-50">#{index + 1} • {item.participantInfo?.enrollmentType || "N/A"}</div>
                </div>
              </div>
              <button
                onClick={() => toggleRow(index)}
                className="p-2 hover:bg-body-30 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-body-50" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-body-50" />
                <span className="text-body-70 truncate">{item.participantInfo?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-body-50" />
                <span className="text-body-70">{item.participantInfo?.phone || "N/A"}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRow === index && (
              <div className="mt-3 pt-3 border-t border-body-30 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-body-50">Gender:</span>
                  <span className="text-body-70 capitalize">{item.childProfile?.gender || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-50">Location:</span>
                  <span className="text-body-70">{item.participantInfo?.city}, {item.participantInfo?.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-50">Therapist:</span>
                  <span className="text-body-70 capitalize">{item.participantInfo?.therapistType || "N/A"}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-3">
              <Link
                to={`/assignment/${item?._id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-ternary-70 to-ternary-100 hover:from-ternary-100 hover:to-ternary-70 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 mr-2"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>
              {item?.scoring ? (
                <div className="bg-gradient-to-r from-primary-50 to-primary-70 text-white px-3 py-2 rounded-xl font-semibold text-sm shadow-md text-center min-w-[80px]">
                  {item.scoring.totalObtained}/{item.scoring.totalPossible}
                </div>
              ) : (
                <div className="bg-body-20 text-body-50 px-3 py-2 rounded-xl font-semibold text-sm text-center border border-body-30 min-w-[80px]">
                  --
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-t border-body-30 bg-body-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-body-50">
          <div>
            Showing <span className="font-semibold text-body-70">{data.length}</span> participants
          </div>
          <div className="flex items-center justify-center gap-4">
            <button className="hover:text-body-70 transition-colors px-3 py-1 rounded-lg hover:bg-white">
              Previous
            </button>
            <span className="bg-white px-3 py-1 rounded-lg border border-body-30 font-semibold text-body-70">1</span>
            <button className="hover:text-body-70 transition-colors px-3 py-1 rounded-lg hover:bg-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmenTableData;