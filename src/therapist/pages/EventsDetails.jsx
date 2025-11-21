import { useCallback, useEffect, useState } from "react";
import { axiosClient } from "../../Utils/axiosClient";
import EventTableData from "../components/events/EventTableData";
import Dialog from "../../components/Dialogs/Dialog";
import { Loader2, Trash2, Calendar, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EventsDetails = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Events
  const getEventsList = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/events`);
      setEvents(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventsList();
  }, []);

  // Open Delete Dialog
  const handleOpenDeleteDialog = (id) => {
    setSelectedEventId(id);
    setShowDeleteDialog(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedEventId) return;
    setDeleteLoading(true);
    try {
      await axiosClient.delete(`/events/${selectedEventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== selectedEventId));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateEvents = useCallback((data) => {
    setEvents((prevEvents) => {
      return prevEvents?.map((event) => {
        return event._id === data._id ? data : event;
      });
    });
  }, []);

  // Loading State
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-body-20 to-white flex items-center justify-center p-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative inline-block"
          >
            <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-primary-100" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-70 blur-sm opacity-30 rounded-full"
            />
          </motion.div>
          <motion.h3
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h4 text-body-100 mt-6 font-semibold"
          >
            Loading Events
          </motion.h3>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-body-50 mt-2 text-sm md:text-base"
          >
            Preparing your event data
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Empty State
  // if (!loading && events.length === 0) {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       className="min-h-screen bg-gradient-to-br from-body-20 to-white flex items-center justify-center p-4"
  //     >
  //       <div className="text-center max-w-md">
  //         <motion.div
  //           initial={{ scale: 0 }}
  //           animate={{ scale: 1 }}
  //           transition={{ type: "spring", duration: 0.5 }}
  //           className="bg-white rounded-2xl p-8 shadow-lg border border-body-30"
  //         >
  //           <div className="relative inline-block mb-4">
  //             <Calendar className="w-16 h-16 text-body-50" />
  //             <div className="absolute -top-1 -right-1 w-6 h-6 bg-ternary-70 rounded-full flex items-center justify-center">
  //               <span className="text-white text-xs font-bold">0</span>
  //             </div>
  //           </div>
  //           <h3 className="h3 text-body-100 mb-2 font-semibold">
  //             No Events Found
  //           </h3>
  //           <p className="text-body-50 mb-6">
  //             There are no events scheduled at the moment. Create your first event to get started.
  //           </p>
  //           <motion.button
  //             whileHover={{ scale: 1.02 }}
  //             whileTap={{ scale: 0.98 }}
  //             className="bg-primary-100 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-70 transition-colors"
  //           >
  //             Create Event
  //           </motion.button>
  //         </motion.div>
  //       </div>
  //     </motion.div>
  //   );
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-body-20 to-white p-4 md:p-6"
    >
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="h1 text-body-100 mb-2"
        >
          Event Management
        </motion.h1>
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-body-50 text-lg"
        >
          Manage and organize your events efficiently
        </motion.p>
      </div>

      {/* Events Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-body-30 overflow-hidden"
      >
        <EventTableData
          data={events}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          updateEvents={updateEvents}
          setEvents={setEvents}
        />
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <Dialog
            onclose={() => !deleteLoading && setShowDeleteDialog(false)}
            showIcon={true}
            clickAwayToClose={!deleteLoading}
            width="min(90vw, 440px)"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="p-6 md:p-8 text-center bg-white rounded-2xl"
            >
              {/* Icon with gradient background */}
              <div className="relative mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-br from-ternary-100 to-ternary-70 rounded-full flex items-center justify-center mx-auto"
                >
                  <Trash2 className="w-7 h-7 text-white" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute -top-1 -right-1"
                >
                  <AlertTriangle className="w-5 h-5 text-ternary-100" />
                </motion.div>
              </div>

              {/* Content */}
              <h2 className="h3 text-body-100 mb-3 font-semibold">
                Delete Event
              </h2>
              <p className="text-body-70 mb-6 leading-relaxed">
                This action will permanently remove the event and cannot be undone. 
                Are you sure you want to proceed?
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleteLoading}
                  className="px-6 py-3 border border-body-30 text-body-70 rounded-xl font-medium hover:bg-body-20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: deleteLoading ? 1 : 1.02 }}
                  whileTap={{ scale: deleteLoading ? 1 : 0.98 }}
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="px-6 py-3 bg-gradient-to-r from-ternary-100 to-ternary-70 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex-1 sm:flex-none relative overflow-hidden"
                >
                  {deleteLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete Event"
                  )}
                  
                  {/* Loading overlay */}
                  {deleteLoading && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-white opacity-20"
                    />
                  )}
                </motion.button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventsDetails;