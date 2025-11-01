import { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus, Key, User, Mail, Phone, MapPin, Calendar, Stethoscope, Briefcase, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getUserFromLocal, saveUserToLocal } from "../Utils/auth";
import { axiosClient } from "../Utils/axiosClient";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const savedUser = getUserFromLocal();
    let validationErrors = {};

    if (!formData.email.trim()) validationErrors.email = "Email is required";
    if (!isReset && !formData.password.trim())
      validationErrors.password = "Password is required";
    if (!isLogin && !formData.fName.trim())
      validationErrors.fName = "First name is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    // Password Reset
    if (isReset) {
      if (!savedUser) {
        toast.error("User not found!");
        setIsLoading(false);
        return;
      }
      if (savedUser.email === formData.email) {
        saveUserToLocal({ ...savedUser, password: "123456" });
        toast.success("Password reset successfully! New password: 123456");
        setIsReset(false);
      } else {
        toast.error("Email does not match!");
      }
      setIsLoading(false);
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
      } finally {
        setIsLoading(false);
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
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials!");
    } finally {
      setIsLoading(false);
    }
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      fName: "", lName: "", gender: "", dob: "", phone: "", email: "", password: "",
      state: "", city: "", therapistType: "", enrollmentId: "",
    });
    setErrors({});
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setIsReset(false);
    resetForm();
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setIsReset(false);
    resetForm();
  };

  const switchToReset = () => {
    setIsReset(true);
    setIsLogin(false);
    resetForm();
  };

  const inputClass = "w-full px-4 py-3 border border-body-30 rounded-xl text-body-100 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 transition-all duration-200 bg-white placeholder-body-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-body-20 to-primary-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-body-30 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-secondary-70 to-ternary-100 text-white p-8 lg:p-12 hidden lg:flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Stethoscope className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold mb-4">OSIT Therapy Platform</h1>
              <p className="text-white/80 text-lg mb-6">
                Professional oral sensorimotor integration therapy management system for therapists and participants.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span>Secure participant management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Progress tracking & assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Multi-therapist support</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="p-6 md:p-8 lg:p-12 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:hidden">
                  {isReset ? <Key className="w-8 h-8 text-white" /> : 
                   isLogin ? <LogIn className="w-8 h-8 text-white" /> : 
                   <UserPlus className="w-8 h-8 text-white" />}
                </div>
                <h2 className="h1 text-body-100 font-bold mb-2">
                  {isReset ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-body-70">
                  {isReset ? "Enter your email to reset password" : 
                   isLogin ? "Sign in to your account" : 
                   "Join our therapy platform today"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Signup Fields - Better Organized */}
                  {!isLogin && !isReset && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6 "
                    >
                      {/* Personal Information Section */}
                      <div className="bg-body-20 rounded-xl p-4">
                        <h3 className="font-semibold text-body-100 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-primary-100" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">First Name <span className="text-error">*</span></label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                              <input
                                type="text"
                                name="fName"
                                placeholder="Enter first name"
                                value={formData.fName}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            {errors.fName && <p className="text-error text-sm">{errors.fName}</p>}
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">Last Name <span className="text-error">*</span></label>
                            <input
                              type="text"
                              name="lName"
                              placeholder="Enter last name"
                              value={formData.lName}
                              onChange={handleChange}
                              className={inputClass}
                            />
                          </div>

                          {/* Gender */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">Gender <span className="text-error">*</span></label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className={inputClass}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          {/* DOB */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">Date of Birth <span className="text-error">*</span></label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                              <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information Section */}
                      <div className="bg-body-20 rounded-xl p-4">
                        <h3 className="font-semibold text-body-100 mb-4 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary-100" />
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Phone */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">Phone <span className="text-error">*</span></label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                              <input
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-body-70">Email <span className="text-error">*</span></label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                              <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            {errors.email && <p className="text-error text-sm">{errors.email}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Location Information Section */}
                      <div className="bg-body-20 rounded-xl p-4">
                        <h3 className="font-semibold text-body-100 mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary-100" />
                          Location Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* State */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">State <span className="text-error">*</span></label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                              <input
                                type="text"
                                name="state"
                                placeholder="Enter your state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>

                          {/* City */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">City <span className="text-error">*</span></label>
                            <input
                              type="text"
                              name="city"
                              placeholder="Enter your city"
                              value={formData.city}
                              onChange={handleChange}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Professional Information Section */}
                      <div className="bg-body-20 rounded-xl p-4">
                        <h3 className="font-semibold text-body-100 mb-4 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-primary-100" />
                          Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Therapist Type */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">Therapist Type <span className="text-error">*</span></label>
                            <select
                              name="therapistType"
                              value={formData.therapistType}
                              onChange={handleChange}
                              className={inputClass}
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
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-body-70">Enrollment ID</label>
                            <div className="relative">
                              <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                              <input
                                type="text"
                                name="enrollmentId"
                                placeholder="Enter enrollment ID"
                                value={formData.enrollmentId}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Password Section */}
                      <div className="bg-body-20 rounded-xl p-4">
                        <h3 className="font-semibold text-body-100 mb-4 flex items-center gap-2">
                          <Key className="w-5 h-5 text-primary-100" />
                          Security
                        </h3>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-body-70">Password <span className="text-error">*</span></label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Enter password"
                              value={formData.password}
                              onChange={handleChange}
                              className={`${inputClass} pl-10 pr-10`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-body-50 hover:text-body-70 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-error text-sm">{errors.password}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field for Login/Reset */}
                {(isLogin || isReset) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-body-70">Email <span className="text-error">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                    {errors.email && <p className="text-error text-sm">{errors.email}</p>}
                  </motion.div>
                )}

                {/* Password Field for Login */}
                {!isReset && isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-body-70">Password <span className="text-error">*</span></label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-50 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${inputClass} pl-10 pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-body-50 hover:text-body-70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-error text-sm">{errors.password}</p>}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-70 to-primary-100 hover:from-primary-100 hover:to-primary-70 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isReset ? "Resetting..." : isLogin ? "Signing in..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {isReset ? <Key className="w-5 h-5" /> : 
                       isLogin ? <LogIn className="w-5 h-5" /> : 
                       <UserPlus className="w-5 h-5" />}
                      {isReset ? "Reset Password" : isLogin ? "Sign In" : "Create Account"}
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer Links */}
              <div className="text-center mt-6 space-y-3">
                <AnimatePresence mode="wait">
                  {isReset ? (
                    <motion.p
                      key="reset"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-body-70"
                    >
                      Remember your password?{" "}
                      <button
                        onClick={switchToLogin}
                        className="text-primary-100 hover:text-primary-70 font-semibold transition-colors"
                      >
                        Back to Sign in
                      </button>
                    </motion.p>
                  ) : isLogin ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <p className="text-body-70">
                        Need an account?{" "}
                        <button
                          onClick={switchToSignup}
                          className="text-primary-100 hover:text-primary-70 font-semibold transition-colors"
                        >
                          Sign up
                        </button>
                      </p>
                      <p className="text-body-70">
                        Forgot your password?{" "}
                        <button
                          onClick={switchToReset}
                          className="text-primary-100 hover:text-primary-70 font-semibold transition-colors"
                        >
                          Reset it
                        </button>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="signup"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-body-70"
                    >
                      Already have an account?{" "}
                      <button
                        onClick={switchToLogin}
                        className="text-primary-100 hover:text-primary-70 font-semibold transition-colors"
                      >
                        Sign in
                      </button>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}