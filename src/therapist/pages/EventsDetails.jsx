import { useCallback, useEffect, useState } from "react";
import { axiosClient } from "../../Utils/axiosClient";
import EventTableData from "../components/events/EventTableData";
import Dialog from "../../components/Dialogs/Dialog";
import { Loader2, Trash2 } from "lucide-react";

const EventsDetails = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  //  Fetch Events
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

  //  Open Delete Dialog
  const handleOpenDeleteDialog = (id) => {
    setSelectedEventId(id);
    setShowDeleteDialog(true);
  };

  //  Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/events/${selectedEventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== selectedEventId));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateEvents = useCallback((data) => {
    setEvents((prevEvents) => {
      return prevEvents?.map((event) => {
        return event._id === data._id ? data : event;
      });
    });
  }, []);

  console.log(events);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-body-20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="animate-spin text-primary-100 w-12 h-12 md:w-16 md:h-16" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-70 blur-sm opacity-20 rounded-full animate-pulse"></div>
          </div>
          <h3 className="h4 text-body-100 mt-4 md:mt-6 font-semibold">
            Loading Assignments
          </h3>
          <p className="text-body-50 mt-2 text-sm md:text-base">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  return (
    <>
      <EventTableData
        data={events}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        updateEvents={updateEvents}
        setEvents={setEvents}
      />

      {/* Dialog for Delete Confirmation */}
      {showDeleteDialog && (
        <Dialog
          onclose={() => setShowDeleteDialog(false)}
          showIcon={true}
          clickAwayToClose={true}
          width="400px"
        >
          <div className="p-6 text-center bg-white rounded-xl">
            <Trash2 className="w-10 h-10 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Event
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-70"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default EventsDetails;
