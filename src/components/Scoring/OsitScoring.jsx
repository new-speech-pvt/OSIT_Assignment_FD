import { useState } from "react";

import { motion } from "framer-motion";
import { axiosClient } from "../../Utils/axiosClient";

// --- UI Components ---

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`bg-[#69559c] hover:bg-[#604C91] text-white px-6 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

// --- Main Component ---

const OSITScoringForm = ({ ositAssigmnentId }) => {
  const criteriaList = [
    "Understanding of Instructions",

    "Attention to Detail",

    "Response Time",

    "Social Interaction",

    "Emotional Regulation",
  ];

  const [scores, setScores] = useState(
    criteriaList.map(() => ({ obtainedMarks: "", remarks: "" }))
  );

  const handleChange = (index, field, value) => {
    setScores((prev) => {
      const updated = [...prev];

      updated[index][field] = value;

      return updated;
    });
  };

  const total = scores.reduce(
    (sum, item) => sum + (parseFloat(item.obtainedMarks) || 0), 0 );

     // ✅ Check if all scores are filled
  const isFormComplete = scores.every(
    (item) => item.obtainedMarks !== "" && !isNaN(item.obtainedMarks)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      OSITAssignment_Id: ositAssigmnentId, // dummy ID

      criteriaList: criteriaList.map((criteria, i) => ({
        criteria,

        maxMarks: 10,

        obtainedMarks: Number(scores[i].obtainedMarks) || 0,

        remarks: scores[i].remarks || "",
      })),
    };
    try {
      const response = await axiosClient.post(
        `/osit-assignments/score`,
        payload
      );
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }

    console.log("Submitting scoring:", payload);

    alert("Form submitted! Check console for payload.");
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
        🧠 OSIT Assessment Scoring
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {criteriaList.map((criteria, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-100 font-medium text-sm sm:text-base">
                    {criteria}
                  </p>
                  <p className="text-xs text-gray-500">Max Marks: 10</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scores[index].obtainedMarks}
                    onChange={(e) =>
                      handleChange(index, "obtainedMarks", e.target.value)
                    }
                    className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-sm focus:ring-2 focus:ring-[#8879AD] outline-none"
                    placeholder="Score"
                  />
                  <input
                    type="text"
                    value={scores[index].remarks}
                    onChange={(e) =>
                      handleChange(index, "remarks", e.target.value)
                    }
                    className="w-full sm:w-60 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#8879AD] outline-none"
                    placeholder="Optional remark"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total:{" "}
            <span className="text-[#604C91] dark:text-[#6a5995]">{total}</span> /{" "}
            50
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button type="submit" className="w-full sm:w-auto " disabled={!isFormComplete}>
            Submit Scoring
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default OSITScoringForm;
