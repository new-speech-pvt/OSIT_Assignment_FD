// CardDetails.jsx
import React from "react";
import CardsSection from "../components/cardComponents/CardsSection";

const CardDetails = () => {
  const apiUrl = "https://jsonplaceholder.typicode.com/users";

  const handleScore = (user) => {
    alert(`Score clicked for ${user.name}`);
  };

  const handlePreview = (user) => {
    alert(`Preview clicked for ${user.name}`);
  };

  const handleDownload = (user) => {
    alert(`Download clicked for ${user.name}`);
  };

  return (
    <CardsSection
      title="Registered Users"
      apiUrl={apiUrl}
      transformData={(data) => data.map((u) => ({ name: u.name, email: u.email }))}
      onScoreClick={handleScore}
      onPreviewClick={handlePreview}
      onDownloadClick={handleDownload}
      footerText="Each card represents a registered user."
    />
  );
};

export default CardDetails;
