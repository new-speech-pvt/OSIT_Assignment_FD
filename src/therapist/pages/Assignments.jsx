import { useEffect, useState } from "react";
import {
  Loader2,
  Calendar,
  FileText,
  Users,
  Filter,
  Search,
  Plus,
  UserPlus,
  Send,
  Award,
} from "lucide-react";
import { getUserFromLocal } from "../../Utils/auth";
import { axiosClient } from "../../Utils/axiosClient";
import AssignmenTableData from "../components/assignments/AssignmenTableData";

const Assignments = () => {
  const user = getUserFromLocal("authUser");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const getAllAssignments = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/osit-assignments/therapist/assignments`
        );
        setData(response?.data?.data?.assignments);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllAssignments();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-white via-body-20 to-white">
      {/* Modern Header */}
      <div className="bg-white border-b border-body-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 md:gap-6">
            {/* Page Title Section */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:h1 text-body-100 font-bold tracking-tight">
                    Assignment Manager
                  </h1>
                  <p className="text-body-70 text-sm md:text-lg mt-1">
                    Manage and monitor all patient assignments efficiently
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex flex-wrap gap-2 md:gap-3">
              <button className="px-4 py-2 md:px-6 md:py-3 cursor-pointer bg-white border border-body-30 rounded-xl text-body-70 font-semibold hover:bg-body-20 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-sm md:text-base">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-primary-70 to-primary-100 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 shadow-md cursor-pointer flex items-center gap-2 text-sm md:text-base">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Assignment</span>
                <span className="sm:hidden">New</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Stats Overview */}


<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-6 mb-6 md:mb-8">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
    {/* 1️⃣ Registered Users */}
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-body-30 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-70 font-medium text-xs md:text-sm mb-1 md:mb-2">
            Registered Users
          </p>
          <p className="text-lg md:h2 text-body-100 font-bold">
            {/* {stats?.registered || 0} */} 0
          </p>
        </div>
        <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center">
          <UserPlus className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-body-30">
        <span className="text-xs text-body-50">All signed-up users</span>
      </div>
    </div>

    {/* 2️⃣ Assignments Created */}
    

    {/* 3️⃣ Assignments Submitted */}
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-body-30 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-70 font-medium text-xs md:text-sm mb-1 md:mb-2">
            Assignments Submitted
          </p>
          <p className="text-lg md:h2 text-body-100 font-bold">
            {/* {stats?.submitted || 0} */} 0
          </p>
        </div>
        <div className="w-8 h-8 md:w-12 md:h-12 bg-green-50 rounded-lg md:rounded-xl flex items-center justify-center">
          <Send className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
        </div>
      </div>
      <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-body-30">
        <span className="text-xs text-body-50">Awaiting admin review</span>
      </div>
    </div>

    {/* 4️⃣ Assignments Scored */}
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-body-30 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-70 font-medium text-xs md:text-sm mb-1 md:mb-2">
            Score Given
          </p>
          <p className="text-lg md:h2 text-body-100 font-bold">
            {/* {stats?.scored || 0} */} 0
          </p>
        </div>
        <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-50 rounded-lg md:rounded-xl flex items-center justify-center">
          <Award className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
        </div>
      </div>
      <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-body-30">
        <span className="text-xs text-body-50">Reviewed & graded</span>
      </div>
    </div>
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-body-30 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-70 font-medium text-xs md:text-sm mb-1 md:mb-2">
            Score Pending
          </p>
          <p className="text-lg md:h2 text-body-100 font-bold">
            {/* {stats?.created || 0} */} 0
          </p>
        </div>
        <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-50 rounded-lg md:rounded-xl flex items-center justify-center">
          <FileText className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
        </div>
      </div>
      <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-body-30">
        <span className="text-xs text-body-50">Forms started by users</span>
      </div>
    </div>
  </div>
</div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
        {/* Search and Filter Bar */}
        {/* <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
            <div className="flex-1 max-w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Search assignments or patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-3 border border-body-30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 transition-all duration-200 bg-body-20 text-sm md:text-base"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 md:px-4 md:py-3 border border-body-30 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 bg-white transition-all duration-200 text-sm md:text-base flex-1 min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>

              <div className="flex items-center gap-2 text-body-50 text-xs md:text-sm bg-body-20 px-3 py-2 md:px-4 md:py-3 rounded-xl">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span>Updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Table Container */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-body-30 overflow-hidden">
          <AssignmenTableData data={data} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Assignments;
