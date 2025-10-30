    // CardItem.jsx
import React from "react";

const CardItem = ({ user, onScoreClick, onPreviewClick, onDownloadClick }) => {
  return (
    <div
      className="relative bg-gradient-to-br from-[#3C2C72] via-[#4A378B] to-[#5A43A4] p-6 rounded-2xl shadow-2xl
                 flex flex-col justify-between items-center
                 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0_25px_#B0A6C8]"
    >
      {/* Glowing border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D73F7F] to-[#B0A6C8] opacity-0 hover:opacity-20 blur-xl transition-opacity duration-500"></div>

      {/* User Name */}
      <h2 className="text-2xl font-semibold mb-8 text-[#FFF] tracking-wide drop-shadow-md z-10">
        {user.name}
      </h2>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full justify-center z-10">
        <button
          onClick={() => onScoreClick(user)}
          className="bg-gradient-to-r from-[#D73F7F] to-[#E16F9F] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
        >
          Score
        </button>

        <button
          onClick={() => onPreviewClick(user)}
          className="bg-gradient-to-r from-[#604C91] to-[#8879AD] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
        >
          Preview
        </button>

        <button
          onClick={() => onDownloadClick(user)}
          className="bg-gradient-to-r from-[#EB9FBF] to-[#E16F9F] text-[#2B003A] font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-pink-300/40 transition-all duration-300 hover:scale-105"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default CardItem;
