import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  CalendarX,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";
import Dialog from "../../../components/Dialogs/Dialog";
import AddEventForm from "./AddEventForm";
import { axiosClient } from "../../../Utils/axiosClient";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return moment(dateString).format("DD-MM-YYYY");
};

const getSubmissionDate = (endDate, submissionExpiry) => {
  if (!endDate || !submissionExpiry) return "N/A";
  return moment(endDate).add(submissionExpiry, "days").format("DD-MMM-YYYY");
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

  const handleEditClick = (event) => {
    setEditEvent(event);
    setShowDialog(true);
  };

  const handleBackBtn = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleAddEvent = () => {
    setEditEvent(null);
    setShowDialog(true);
  };

  const headers = [
    { label: "Sr. No", key: "srNo", className: "w-16" },
    { label: "Event Name", key: "name", className: "min-w-40" },
    { label: "Start Date", key: "startDate", className: "min-w-32" },
    { label: "End Date", key: "endDate", className: "min-w-32" },
    { label: "Submission Date", key: "submissionExpiry", className: "min-w-40" },
    { label: "Location", key: "location", className: "min-w-32" },
    { label: "Actions", key: "action", className: "w-24" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-body-20 to-white p-4 md:p-6"
    >
      {/* Back Button Only - No Heading */}
      <motion.div variants={itemVariants} className="mb-6">
        <motion.button
          whileHover={{ scale: 1.02, x: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBackBtn}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-70 to-primary-100 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </motion.button>
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg border border-body-30 overflow-hidden"
      >
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-body-30 bg-gradient-to-r from-body-20 to-white/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-70 to-secondary-100 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                {/* Fixed mobile title size */}
                <h2 className="text-xl md:h2 text-body-100 font-bold">Events List</h2>
                <p className="text-body-50 text-sm mt-1">
                  {data?.length || 0} event{data?.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddEvent}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-70 to-primary-100 hover:from-primary-50 hover:to-primary-70 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </motion.button>
          </div>
        </div>

        {/* Add/Edit Event Dialog */}
        <AnimatePresence>
          {showDialog && (
            <Dialog
              onclose={() => {
                setShowDialog(false);
                setEditEvent(null);
              }}
              showIcon={false}
              clickAwayToClose={true}
              width="min(95vw, 520px)"
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
        </AnimatePresence>

        {/* Empty State */}
        {!data || data.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 px-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-body-30 to-body-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CalendarX className="w-8 h-8 text-body-70" />
            </div>
            <h3 className="text-xl md:h3 text-body-70 font-semibold mb-3">
              No Events Found
            </h3>
            <p className="text-body-50 text-base mb-6 max-w-md mx-auto">
              Get started by creating your first event to organize and manage your schedule.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEvent}
              className="bg-gradient-to-r from-primary-70 to-primary-100 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Create Your First Event
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left bg-white">
                  <thead>
                    <tr className="sticky whitespace-nowrap top-0 bg-gradient-to-r from-secondary-70 to-secondary-100 text-white z-10 shadow-md">
                      {headers.map((th) => (
                        <th
                          key={th.key}
                          className={`px-6 py-4 font-semibold text-sm uppercase tracking-wider ${th.className}`}
                        >
                          {th.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-body-30">
                    {data?.map((item, index) => (
                      <motion.tr
                        key={item._id}
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 1.01,
                          backgroundColor: "rgba(99, 255, 180, 0.03)"
                        }}
                        className="group transition-all duration-200"
                      >
                        {/* Serial Number */}
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-body-20 to-body-30 rounded-xl flex items-center justify-center text-body-70 font-bold text-sm">
                            {index + 1}
                          </div>
                        </td>

                        {/* Event Name */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-secondary-50/15 text-secondary-100 border border-secondary-50/30 hover:shadow-md transition-all duration-200">
                            {item?.name || "N/A"}
                          </span>
                        </td>

                        {/* Start Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-ternary-70/20 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-ternary-100" />
                            </div>
                            <span className="text-body-70 font-medium text-sm">
                              {formatDate(item?.startDate)}
                            </span>
                          </div>
                        </td>

                        {/* End Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-ternary-70/20 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-ternary-100" />
                            </div>
                            <span className="text-body-70 font-medium text-sm">
                              {formatDate(item?.endDate)}
                            </span>
                          </div>
                        </td>

                        {/* Submission Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-70/20 rounded-lg flex items-center justify-center">
                              <CalendarDays className="w-4 h-4 text-primary-100" />
                            </div>
                            <div>
                              <span className="text-body-70 font-medium text-sm block">
                                {getSubmissionDate(item?.endDate, item?.submissionExpiry)}
                              </span>
                              <span className="text-body-50 text-xs">
                                {item?.submissionExpiry} days after
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-70/20 rounded-lg flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-primary-100" />
                            </div>
                            <span className="text-body-70 font-medium text-sm">
                              {item?.location || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Edit Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditClick(item)}
                              className="p-2 rounded-xl bg-primary-50/20 hover:bg-primary-50/40 border border-primary-50/30 transition-all duration-200 cursor-pointer group"
                              title="Edit Event"
                            >
                              <Pencil className="w-4 h-4 text-primary-100 group-hover:text-primary-70 transition-colors" />
                            </motion.button>

                            {/* Delete Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleOpenDeleteDialog(item._id)}
                              className="p-2 rounded-xl bg-ternary-100/20 hover:bg-ternary-100/30 border border-ternary-100/30 transition-all duration-200 cursor-pointer group"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4 text-ternary-100 group-hover:text-ternary-70 transition-colors" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <AnimatePresence>
                {data?.map((item, index) => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="border-b border-body-30 last:border-b-0 p-5 hover:bg-body-20/50 transition-all duration-200"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-70 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CalendarDays className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-body-100 text-lg mb-1 truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-body-50">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{item?.location || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-body-30 rounded-lg flex items-center justify-center text-body-70 font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-body-20 rounded-xl">
                        <Calendar className="w-4 h-4 text-ternary-100" />
                        <div>
                          <div className="text-xs text-body-50">Start Date</div>
                          <div className="text-sm font-medium text-body-70">
                            {formatDate(item?.startDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-body-20 rounded-xl">
                        <Calendar className="w-4 h-4 text-ternary-100" />
                        <div>
                          <div className="text-xs text-body-50">End Date</div>
                          <div className="text-sm font-medium text-body-70">
                            {formatDate(item?.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-body-20 rounded-xl sm:col-span-2">
                        <CalendarDays className="w-4 h-4 text-primary-100" />
                        <div>
                          <div className="text-xs text-body-50">Submission Date</div>
                          <div className="text-sm font-medium text-body-70">
                            {getSubmissionDate(item?.endDate, item?.submissionExpiry)}
                          </div>
                          <div className="text-xs text-body-50">
                            {item?.submissionExpiry} days after event
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-body-30">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditClick(item)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50/20 hover:bg-primary-50/40 border border-primary-50/30 text-primary-100 font-medium text-sm transition-all duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenDeleteDialog(item._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ternary-100/20 hover:bg-ternary-100/30 border border-ternary-100/30 text-ternary-100 font-medium text-sm transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-body-30 bg-body-20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-body-50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Showing <span className="font-semibold text-body-70 mx-1">{data.length}</span> 
                  event{data.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <button className="px-4 py-2 rounded-xl border border-body-30 hover:bg-white hover:text-body-70 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-white border border-body-30 rounded-xl font-semibold text-body-70">
                    1
                  </span>
                  <button className="px-4 py-2 rounded-xl border border-body-30 hover:bg-white hover:text-body-70 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F1F2F6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #DFE4EA;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #807E7E;
        }
      `}</style>
    </motion.div>
  );
};

export default EventTableData;