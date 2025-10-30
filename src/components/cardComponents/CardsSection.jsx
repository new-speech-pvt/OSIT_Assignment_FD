// CardsSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "./CardItem";

const CardsSection = ({
  title = "USER DASHBOARD",
  apiUrl,                      // API endpoint
  transformData,               // optional: format API data
  onScoreClick,
  onPreviewClick,
  onDownloadClick,
  footerText = "Helpful message or instruction here.",
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch API Data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(apiUrl);
        const formatted = transformData ? transformData(res.data) : res.data;
        setUsers(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (apiUrl) fetchUsers();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0825] via-[#1B1440] to-[#2C1E60] text-white flex flex-col items-center p-8">
      
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-12 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#B0A6C8] to-[#E16F9F] drop-shadow-lg">
        {title}
      </h1>

      {/* Loading & Error */}
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
          {users.map((user, index) => (
            <CardItem
              key={index}
              user={user}
              onScoreClick={onScoreClick}
              onPreviewClick={onPreviewClick}
              onDownloadClick={onDownloadClick}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-sm text-gray-400 mt-12 text-center max-w-md">
        {footerText}
      </p>
    </div>
  );
};

export default CardsSection;
