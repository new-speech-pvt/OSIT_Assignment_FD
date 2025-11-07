import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Calculator, CheckCircle, AlertCircle } from "lucide-react";
import { axiosClient } from "../../Utils/axiosClient";
import toast from "react-hot-toast";

const OSITScoringForm = ({ ositAssigmnentId, callback }) => {
  const criteriaList = [
    "Relevance and clarity in problem selection",
    "Appropriateness and detail in plan of action",
    "Justification and effectiveness of tool selection",
    "Design and execution of intervention plan",
    "Clarity, structure, and presentation of report",
  ];

  const [scores, setScores] = useState(
    criteriaList.map(() => ({ obtainedMarks: "", remarks: "" }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (index, field, value) => {
    setScores((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const total = scores.reduce(
    (sum, item) => sum + (parseFloat(item.obtainedMarks) || 0),
    0
  );

  const maxTotal = criteriaList.length * 10;
  const completionPercentage = (total / maxTotal) * 100;

  // ✅ Check if all scores are filled
  const isFormComplete = scores.every(
    (item) => item.obtainedMarks !== "" && !isNaN(item.obtainedMarks)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    setIsSubmitting(true);
    
    const payload = {
      OSITAssignment_Id: ositAssigmnentId,
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
      if (response.status === 200) {
        toast.success("Assessment scored successfully!");
       await callback();
        setScores(criteriaList.map(() => ({ obtainedMarks: "", remarks: "" })));
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to submit scoring. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return "text-primary-100";
    if (numScore >= 6) return "text-secondary-100";
    if (numScore >= 4) return "text-ternary-100";
    return "text-error";
  };

  const getProgressColor = () => {
    if (completionPercentage >= 80) return "bg-primary-100";
    if (completionPercentage >= 60) return "bg-secondary-100";
    if (completionPercentage >= 40) return "bg-ternary-100";
    return "bg-error";
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Card */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 mb-4 md:mb-6">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary-50 to-primary
          -100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-xl md:h1 text-body-100 font-bold mb-2">OSIT Assessment Scoring</h1>
          <p className="text-body-70 text-sm md:text-lg">Evaluate participant performance</p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
          <div className="bg-body-20 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-primary-100">{total}</div>
            <div className="text-body-50 text-xs md:text-sm">Current</div>
          </div>
          <div className="bg-body-20 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-body-100">{maxTotal}</div>
            <div className="text-body-50 text-xs md:text-sm">Max</div>
          </div>
          <div className="bg-body-20 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-secondary-100">
              {completionPercentage.toFixed(0)}%
            </div>
            <div className="text-body-50 text-xs md:text-sm">Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 md:mt-4">
          <div className="flex justify-between text-xs md:text-sm text-body-50 mb-1 md:mb-2">
            <span>Scoring Progress</span>
            <span>{completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-body-30 rounded-full h-1 md:h-2">
            <div
              className={`h-1 md:h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Scoring Criteria */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-secondary-70 rounded-lg md:rounded-xl flex items-center justify-center">
              <Calculator className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:h3 text-body-100 font-semibold">Scoring Criteria</h2>
              <p className="text-body-50 text-xs md:text-sm">Rate each criterion from 0 to 10</p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            {criteriaList.map((criteria, index) => (
              <div
                key={index}
                className="border border-body-30 rounded-lg md:rounded-xl p-3 md:p-4 lg:p-6 hover:border-body-50 transition-all duration-200 bg-gradient-to-r from-white to-body-20/30"
              >
                <div className="flex flex-col gap-3 md:gap-4">
                  {/* Criteria Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                        <span className="text-primary-100 font-semibold text-xs md:text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-body-100 text-sm md:text-base">
                        {criteria}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-body-50">
                      <span>Max: 10 points</span>
                      {scores[index].obtainedMarks && (
                        <span className={`font-semibold ${getScoreColor(scores[index].obtainedMarks)}`}>
                          Current: {scores[index].obtainedMarks}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full">
                    {/* Score Input */}
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={scores[index].obtainedMarks}
                        onChange={(e) =>
                          handleChange(index, "obtainedMarks", e.target.value)
                        }
                        className="w-full md:w-40 px-3 md:px-4 py-2 md:py-3 border border-body-30 rounded-lg md:rounded-xl text-center font-semibold text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 transition-all duration-200 bg-white text-sm md:text-base"
                        placeholder="0-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none">
                        <Star className="w-3 h-3 md:w-5 md:h-4 text-body-50" />
                      </div>
                    </div>

                    {/* Remarks Input */}
                    <input
                      type="text"
                      value={scores[index].remarks}
                      onChange={(e) =>
                        handleChange(index, "remarks", e.target.value)
                      }
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-body-30 rounded-lg md:rounded-xl text-body-70 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 transition-all duration-200 bg-white text-sm md:text-base"
                      placeholder="Remarks (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
            {/* Total Score Display */}
            <div className="flex-1">
              <div className="bg-gradient-to-r from-primary-50/20 to-primary-70/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-primary-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-body-100 text-sm md:text-lg">Total Score</h3>
                    <p className="text-body-50 text-xs md:text-sm">Overall assessment</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-100">
                      {total} / {maxTotal}
                    </div>
                    <div className="text-body-50 text-xs md:text-sm">
                      {completionPercentage.toFixed(1)}% complete
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-2 md:gap-3">
              {!isFormComplete && !isSubmitting && (
                <div className="flex items-center gap-1 md:gap-2 text-error text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Please fill all scores
                </div>
              )}
              
              <button
                type="submit"
                disabled={!isFormComplete || isSubmitting}
                className="flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-primary-70 to-primary-100 hover:from-primary-100 hover:to-primary-70 text-white px-4 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full lg:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm md:text-base">Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Submit Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scoring Guide */}
          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-body-30">
            <h4 className="font-semibold text-body-100 text-sm md:text-base mb-2 md:mb-3">Scoring Guide</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-primary-100 rounded-full"></div>
                <span className="text-body-70">8-10: Excellent</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-secondary-100 rounded-full"></div>
                <span className="text-body-70">6-7: Good</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-ternary-100 rounded-full"></div>
                <span className="text-body-70">4-5: Average</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-error rounded-full"></div>
                <span className="text-body-70">0-3: Needs Help</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default OSITScoringForm;