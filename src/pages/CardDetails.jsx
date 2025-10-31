import CardsSection from "../components/cardComponents/CardsSection"
import { useAuthStore } from "../store/authStore";

const CardDetails = () => {
const { user } = useAuthStore();
  // const navigate = useNavigate(); // agar redirect chahiye

  const apiUrl = `/osit-assignments/participant/${user?.email}`;

  // const handleScore = (assignment) => {
  //   console.log("Score clicked:", assignment);
  //   // Navigate to scoring page
  //   navigate(`/score/${assignment.id}`);
  // };

  // const handlePreview = (assignment) => {
  //   console.log("Preview clicked:", assignment);
  //   // Open preview modal or page
  // };

  // const handleDownload = (assignment) => {
  //   console.log("Download clicked:", assignment);
    // Trigger PDF download
  // };
    const transform = (response) => {
    const assignments = response?.data?.assignments || [];
    return assignments.map((item) => ({
      id: item.assignmentId,
      name: item.childProfile?.name || item.assignmentDetail?.title || "Assignment",
    }));
  };

  return (
    <CardsSection
      title="Your Assignments"
      apiUrl={apiUrl}
      transformData={transform}
      // onScoreClick={handleScore}
      // onPreviewClick={handlePreview}
      // onDownloadClick={handleDownload}
      footerText="Score, preview or download your submitted assignments."
    />
  );
};

export default CardDetails;