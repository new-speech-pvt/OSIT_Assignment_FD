import React, { useEffect, useState } from "react";
import CardItem from "./CardItem";
import { axiosClient } from "../../Utils/axiosClient";

const CardsSection = ({
  title = "USER DASHBOARD",
  apiUrl,              
  transformData,     
  onScoreClick,
  onPreviewClick,
  onDownloadClick,
  footerText = "Helpful message or instruction here.",
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!apiUrl) return;
      try {
        setLoading(true);
        const { data } = await axiosClient.get(apiUrl);
        console.log("API response:", data);

      
        const response = data?.data || data?.assignments || data || [];
        const formatted = transformData ? transformData(response) : response;
        setUsers(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [apiUrl, transformData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0825] via-[#1B1440] to-[#2C1E60] text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-12 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#B0A6C8] to-[#E16F9F] drop-shadow-lg">
        {title}
      </h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-gray-400">No data found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
          {users.map((user, idx) => (
            <CardItem
              key={user.id || idx}
              user={user}
              onScoreClick={onScoreClick}
              onPreviewClick={onPreviewClick}
              onDownloadClick={onDownloadClick}
            />
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400 mt-12 text-center max-w-md">{footerText}</p>
    </div>
  );
};

export default CardsSection;


