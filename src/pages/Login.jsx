import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getUserFromLocal, saveUserToLocal } from "../Utils/auth";
import { axiosClient } from "../Utils/axiosClient";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    state: "",
    city: "",
    therapistType: "",
    enrollmentId: "",
  });

  const [errors, setErrors] = useState({});



  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savedUser = getUserFromLocal();
    let validationErrors = {};

    if (!formData.email.trim()) validationErrors.email = "Email is required";
    if (!isReset && !formData.password.trim())
      validationErrors.password = "Password is required";
    if (!isLogin && !formData.fName.trim())
      validationErrors.fName = "First name is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Password Reset
    if (isReset) {
      if (!savedUser) {
        toast.error("User not found!");
        return;
      }
      if (savedUser.email === formData.email) {
        saveUserToLocal({ ...savedUser, password: "123456" });
        toast.success("Password reset successfully! New password: 123456");
        setIsReset(false);
      } else {
        toast.error("Email does not match!");
      }
      return;
    }

    // Signup logic
    if (!isLogin) {
      try {
        const response = await axiosClient.post("/participant", formData);
        if (response.data.success) {
          const user = response.data.data;
          toast.success("Account created successfully!");
          saveUserToLocal(user);
          login(user);
          navigate("/");
        } else {
          toast.error(response.data.message || "Signup failed!");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        toast.error(
          error.response?.data?.message || "Signup failed. Please try again!"
        );
      }
      return;
    }

    // Login logic
    try {
      const response = await axiosClient.post("/participant/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const user = response.data?.data;
        login(user);
        saveUserToLocal(user);
        toast.success("Login success");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials!");
    }
    setErrors({});
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md text-left overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {isReset
            ? "Reset Your Password"
            : isLogin
              ? "Sign In"
              : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Common fields */}
          {!isLogin ? (
            <>
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fName"
                  placeholder="Enter first name"
                  value={formData.fName}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Last Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lName"
                  placeholder="Enter last name"
                  value={formData.lName}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-1">Gender<span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone<span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium mb-1">State<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-1">City<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                />
              </div>

              {/* Therapist Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Therapist Type<span className="text-red-500">*</span></label>
                <select
                  name="therapistType"
                  value={formData.therapistType}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                >
                  <option value="">Select Therapist Type</option>
                  <option value="Speech Therapist">Speech Therapist</option>
                  <option value="Physical Therapist">Physical Therapist</option>
                  <option value="Occupational Therapist">Occupational Therapist</option>
                  <option value="Special Educator">Special Educator</option>
                  <option value="Psychologist">Psychologist</option>
                  <option value="Physiotherapist">Physiotherapist</option>
                </select>
              </div>

              {/* Enrollment ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enrollment ID
                </label>
                <input
                  type="text"
                  name="enrollmentId"
                  placeholder="Enter enrollment ID"
                  value={formData.enrollmentId}
                  onChange={handleChange}
                  className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
                />
              </div>
            </>
          ) : null}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email<span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
            />
          </div>

          {/* Password */}
          {!isReset && (
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Password<span className="text-red-500">*</span></label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded-lg p-3 mt-1 w-full focus:ring-[#604C91] focus:outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#604C91] text-white py-3 rounded-lg font-medium hover:bg-[#6a569e] transition-all"
          >
            {isReset
              ? "Reset Password"
              : isLogin
                ? "Sign in"
                : "Create Account"}
          </button>
        </form>

        <div className="text-sm mt-5 space-y-2">
          {isReset ? (
            <p className="text-gray-600">
              Back to{" "}
              <span
                className="text-[#604C91] cursor-pointer font-medium"
                onClick={() => setIsReset(false)}
              >
                Sign in
              </span>
            </p>
          ) : isLogin ? (
            <>
              <p className="text-gray-600">
                Need an account?{" "}
                <span
                  className="text-[#604C91] cursor-pointer font-medium"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </span>
              </p>
              <p className="text-gray-600">
                Forgot your password?{" "}
                <span
                  className="text-[#604C91] cursor-pointer font-medium"
                  onClick={() => setIsReset(true)}
                >
                  Reset it
                </span>
              </p>
            </>
          ) : (
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                className="text-[#604C91] cursor-pointer font-medium"
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
