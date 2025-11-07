import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  CalendarX,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import Dialog from "../../../components/Dialogs/Dialog";
import AddEventForm from "./AddEventForm";
import { axiosClient } from "../../../Utils/axiosClient";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import moment from "moment";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return moment(dateString).format("DD-MM-YYYY");
};

const EventTableData = ({
  data,
  handleOpenDeleteDialog,
  updateEvents,
  setEvents,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();

  // const handleAddOrEditEvent = async (eventData, isEdit) => {
  //   try {
  //     if (isEdit) {
  //       //  UPDATE existing event
  //       const response = await axiosClient.put(`/events/${eventData._id}`, {
  //         name: eventData.eventName,
  //         startDate: eventData.startDate,
  //         endDate: eventData.endDate,
  //         submissionExpiry: eventData.submissionExpiry,
  //         location: eventData.location,
  //       });

  //       const updatedEvent = response.data.data;
  //       console.log("Event updated:", updatedEvent);

  //       //  Replace the old event with updated one
  //       updateEvents(updatedEvent);

  //       toast.success("Event updated successfully!!");
  //     } else {
  //       //  CREATE new event
  //       const response = await axiosClient.post("/events", {
  //         name: eventData.eventName,
  //         startDate: eventData.startDate,
  //         endDate: eventData.endDate,
  //         submissionExpiry: eventData.submissionExpiry,
  //         location: eventData.location,
  //       });

  //       const newEvent = response.data.data;
  //       console.log("Event created:", newEvent);
  //       setEvents((prev) => [...prev, newEvent]);
  //       toast.success("Event created successfully!!");
  //     }
  //     setShowDialog(false);
  //     setEditEvent(null);
  //   } catch (error) {
  //     console.error(
  //       "Error saving event:",
  //       error.response?.data || error.message
  //     );
  //     toast.error("Something went wrong while saving event!");
  //   }
  // };

  const handleEditClick = (event) => {
    setEditEvent(event);
    setShowDialog(true);
  };

  const handleBackBtn = useCallback(() => {
    navigate(-1);
  }, []);

  const headers = [
    { label: "Sr. No", key: "srNo" },
    { label: "Event Name", key: "name" },
    { label: "Start Date", key: "startDate" },
    { label: "End Date", key: "endDate" },
    { label: "Submission Date", key: "submissionExpiry" },
    { label: "Location", key: "location" },
    { label: "Action", key: "action" },
  ];

  return (
    <>
      <div className="p-5">
        <button
          className="bg-gradient-to-r from-primary-70 to-primary-100 text-white p-2 rounded-xl gap-1 cursor-pointer  flex flex-row"
          onClick={handleBackBtn}
        >
          <ArrowLeft />
          Back to
        </button>

        <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden mt-2">
          {/* Table Header - Visible on all screens */}
          <div className="px-4 md:px-6 py-4 border-b border-body-30 bg-gradient-to-r from-body-20 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg md:h3 text-body-100 font-bold">
                  Events List
                </h2>
                <p className="text-body-50 text-xs md:text-sm mt-1">
                  Manage and view all events details
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                  className="bg-gradient-to-r from-primary-70 to-primary-100 hover:shadow-xl transition-all duration-200 shadow-md text-white p-2 rounded-xl cursor-pointer"
                  onClick={() => setShowDialog(true)}
                >
                  Add event
                </button>
                <select
                  // value={statusFilter}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 md:px-4 md:py-3 cursor-pointer border border-body-30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 bg-white transition-all duration-200 text-sm md:text-base flex-1 min-w-[120px]"
                >
                  <option value="all">All Events</option>
                  <option value="active">Pune</option>
                  <option value="completed">Dubai</option>
                  <option value="pending">Delhi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dialog show when Add Event is clicked */}
          {showDialog && (
            <Dialog
              onclose={() => {
                setShowDialog(false);
                setEditEvent(null);
              }}
              showIcon={true}
              clickAwayToClose={true}
              width="500px"
            >
              <AddEventForm
                onCancel={() => {
                  setShowDialog(false);
                  setEditEvent(null);
                }}
                updateEvents={updateEvents}
                initialData={editEvent}
                isEdit={!!editEvent}
              />
            </Dialog>
          )}

          {/* Desktop Table */}
          {!data || data.length === 0 ? (
            <div className="text-center py-12 md:py-16 px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-body-30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarX className="w-6 h-6 md:w-8 md:h-8 text-body-50" />
              </div>
              <h3 className="text-lg md:h4 text-body-70 font-semibold mb-2">
                No Events found
              </h3>
              <p className="text-body-50 text-sm md:text-base">
                There are no events yet.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left bg-white ">
                    {/* ye new add */}
                    <thead>
                      <tr className="sticky top-0 bg-gradient-to-r from-secondary-70 to-secondary-100 text-white z-10">
                        {headers.map((th) => (
                          <th
                            key={th.key}
                            className="px-4 py-3 font-semibold text-sm whitespace-nowrap relative"
                          >
                            {th.label}
                          </th>
                        ))}
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
                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-secondary-50/20 text-secondary-100 border border-secondary-50/30">
                              {item?.name || "N/A"}
                            </span>
                          </td>

                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-2">
                              {/* <Calendar className="w-3 h-3 md:w-4 md:h-4 text-body-50" /> */}
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-ternary-100" />
                              <span className="text-body-70 text-sm">
                                {formatDate(item?.startDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-ternary-100" />
                              <span className="text-body-70 text-sm">
                                {formatDate(item?.endDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-ternary-100" />
                              <span className="text-body-70 text-sm">
                                {/* {item.submissionExpiry || "N/A"} */}
                                {moment(item?.endDate)
                                  .add(item?.submissionExpiry, "days")
                                  .format("DD-MMM-YYYY")}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4  text-primary-100" />
                              <span className="text-body-70 text-sm">
                                {item?.location || "N/A"}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-3">
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 rounded-lg bg-primary-50/20 hover:bg-primary-50/40 transition-all duration-200 cursor-pointer"
                                title="Edit Event"
                              >
                                <Pencil className="w-4 h-4 text-primary-80" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleOpenDeleteDialog(item._id)}
                                className="p-2 rounded-lg bg-red-50/20 hover:bg-red-50/40 transition-all duration-200 cursor-pointer"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

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
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-body-100 capitalize">
                        {item.name}
                      </div>
                      <div className="text-xs text-body-50">
                        #{index + 1} • {item?.location || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-ternary-100" />
                    <span className="text-body-70 truncate">
                      {formatDate(item?.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-ternary-100" />
                    <span className="text-body-70">
                      {formatDate(item?.endDate)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center mt-3">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 rounded-lg bg-primary-50/20 hover:bg-primary-50/40 transition-all duration-200 cursor-pointer"
                    title="Edit Event"
                  >
                    <Pencil className="w-4 h-4 text-primary-80" />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleOpenDeleteDialog(item._id)}
                    className="p-2 rounded-lg bg-red-50/20 hover:bg-red-50/40 transition-all duration-200 cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-t border-body-30 bg-body-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-body-50">
              <div>
                Showing{" "}
                <span className="font-semibold text-body-70">
                  {data.length}
                </span>{" "}
                participants
              </div>
              <div className="flex items-center justify-center gap-4">
                <button className="hover:text-body-70 transition-colors px-3 py-1 rounded-lg hover:bg-white">
                  Previous
                </button>
                <span className="bg-white px-3 py-1 rounded-lg border border-body-30 font-semibold text-body-70">
                  1
                </span>
                <button className="hover:text-body-70 transition-colors px-3 py-1 rounded-lg hover:bg-white">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventTableData;
