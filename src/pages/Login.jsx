import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getUserFromLocal, saveUserToLocal } from "../Utils/auth";
import { axiosClient } from "../Utils/axiosClient";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    }
    if (!isReset && !formData.password.trim()) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    //  Reset Password Logic
    if (isReset) {
      if (!savedUser) {
        toast.error("user not found!")
        // alert("User not found!");
        return;
      }
      if (savedUser.email === formData.email) {
        saveUserToLocal({ ...savedUser, password: "123456" });
        toast.success("Password reset successfully! New password: 123456")
        // alert("Password reset successfully! New password: 123456");

        setIsReset(false);
      } else {
        toast.error("Email does not match!")
        // alert("Email does not match!");
      }
      return;
    }

    // Signup logic
    if (!isLogin) {
      try {
        const response = await axiosClient.post("/participant", formData);
        console.log(response);

        if (response.data.success) {
          const user = response.data.data;
          toast.success("Account created successfully!");
          // alert("Account created successfully!");
          saveUserToLocal(user);
          login(user);
          navigate("/home");
        } else {
          toast.error(response.data.message || "Signup failed!")
          // alert(response.data.message || "Signup failed!");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        toast.error(error.response.data?.message || "Signup failed. Please try again!");
        // alert(
        //   error.response?.data?.message || "Signup failed. Please try again!"
        // );
      }

      return;
    }

    //  Login logic
    try {
      const response = await axiosClient.post("/participant/login", formData);
      console.log(response);

      if (response.data.success) {
        const user = response.data?.data;
        toast.success("Login success")
        // alert("Login success");
        saveUserToLocal(user);
        login(user);
        navigate("/home");
      }
      //  Store user in LocalStorage


    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials!")
      // alert(error.response?.data?.message || "Invalid credentials!");
    }

    setFormData({ email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md text-left">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {isReset
            ? "Reset Your Password"
            : isLogin
              ? "Sign In"
              : "Create an account"}
        </h2>

        {isReset && (
          <p className="text-gray-600 mb-6">
            Enter your email to receive a password reset link.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`border rounded-lg p-3 mt-1 focus:outline-none focus:ring-1 ${errors.email
                ? "border-red-600 focus:ring-red-600"
                : "focus:ring-[#604C91]"
                }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          {!isReset && (
            <div className="flex flex-col relative">
              <label className="text-gray-700 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                className={`border rounded-lg p-3 mt-1 focus:outline-none focus:ring-1 ${errors.password
                  ? "border-red-600 focus:ring-red-600"
                  : "focus:ring-[#604C91]"
                  }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
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


















// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import { getUserFromLocal, saveUserToLocal } from "../Utils/auth";
// import { axiosClient } from "../Utils/axiosClient";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuthStore();

//   const [isLogin, setIsLogin] = useState(true);
//   const [isReset, setIsReset] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setErrors({ ...errors, [e.target.name]: "" });
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const savedUser = getUserFromLocal();
//     let validationErrors = {};

//     if (!formData.email.trim()) {
//       validationErrors.email = "Email is required";
//     }
//     if (!isReset && !formData.password.trim()) {
//       validationErrors.password = "Password is required";
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     //  Reset Password Logic
//     if (isReset) {
//       if (!savedUser) {
//         alert("User not found!");
//         return;
//       }
//       if (savedUser.email === formData.email) {
//         saveUserToLocal({ ...savedUser, password: "123456" });
//         alert("Password reset successfully! New password: 123456");
//         setIsReset(false);
//       } else {
//         alert("Email does not match!");
//       }
//       return;
//     }

//     // Signup logic
//     if (!isLogin) {
//       try {
//         const response = await axiosClient.post("/participant", formData);
//         console.log(response);

//         if (response.data.success) {
//           const user = response.data.data;
//           alert("Account created successfully!");
//           saveUserToLocal(user);
//           // login(user);
//           navigate("/home");
//         } else {
//           alert(response.data.message || "Signup failed!");
//         }
//       } catch (error) {
//         console.error("Signup Error:", error);
//         alert(
//           error.response?.data?.message || "Signup failed. Please try again!"
//         );
//       }

//       return;
//     }

//     //  Login logic
//     try {
//       const response = await axiosClient.post("/participant/login", formData);
//       console.log(response);

//       if (response.data.success) {
//         const user = response.data?.data;
//         alert("Login success");
//         saveUserToLocal(user);
//         navigate("/home");
//       }
//       //  Store user in LocalStorage

//       // login(user);
//     } catch (error) {
//       alert(error.response?.data?.message || "Invalid credentials!");
//     }

//     setFormData({ email: "", password: "" });
//     setErrors({});
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
//       <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md text-left">
//         <h2 className="text-2xl font-bold mb-6 text-gray-900">
//           {isReset
//             ? "Reset Your Password"
//             : isLogin
//             ? "Sign In"
//             : "Create an account"}
//         </h2>

//         {isReset && (
//           <p className="text-gray-600 mb-6">
//             Enter your email to receive a password reset link.
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`border rounded-lg p-3 mt-1 focus:outline-none focus:ring-1 ${
//                 errors.email
//                   ? "border-red-600 focus:ring-red-600"
//                   : "focus:ring-[#604C91]"
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-600 text-xs mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           {!isReset && (
//             <div className="flex flex-col relative">
//               <label className="text-gray-700 font-medium">Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`border rounded-lg p-3 mt-1 focus:outline-none focus:ring-1 ${
//                   errors.password
//                     ? "border-red-600 focus:ring-red-600"
//                     : "focus:ring-[#604C91]"
//                 }`}
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-10 cursor-pointer text-gray-500"
//               >
//                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//               </span>
//               {errors.password && (
//                 <p className="text-red-600 text-xs mt-1">{errors.password}</p>
//               )}
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-[#604C91] text-white py-3 rounded-lg font-medium hover:bg-[#6a569e] transition-all"
//           >
//             {isReset
//               ? "Reset Password"
//               : isLogin
//               ? "Sign in"
//               : "Create Account"}
//           </button>
//         </form>

//         <div className="text-sm mt-5 space-y-2">
//           {isReset ? (
//             <p className="text-gray-600">
//               Back to{" "}
//               <span
//                 className="text-[#604C91] cursor-pointer font-medium"
//                 onClick={() => setIsReset(false)}
//               >
//                 Sign in
//               </span>
//             </p>
//           ) : isLogin ? (
//             <>
//               <p className="text-gray-600">
//                 Need an account?{" "}
//                 <span
//                   className="text-[#604C91] cursor-pointer font-medium"
//                   onClick={() => setIsLogin(false)}
//                 >
//                   Sign up
//                 </span>
//               </p>

//               <p className="text-gray-600">
//                 Forgot your password?{" "}
//                 <span
//                   className="text-[#604C91] cursor-pointer font-medium"
//                   onClick={() => setIsReset(true)}
//                 >
//                   Reset it
//                 </span>
//               </p>
//             </>
//           ) : (
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <span
//                 className="text-[#604C91] cursor-pointer font-medium"
//                 onClick={() => setIsLogin(true)}
//               >
//                 Sign in
//               </span>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import { getUserFromLocal, saveUserToLocal } from "../Utils/auth";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuthStore();

//   const [isLogin, setIsLogin] = useState(true);
//   const [isReset, setIsReset] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setErrors({ ...errors, [e.target.name]: "" });
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const savedUser = getUserFromLocal();
//     let validationErrors = {};

//     if (!formData.email.trim()) {
//       validationErrors.email = "Email is required";
//     }
//     if (!isReset && !formData.password.trim()) {
//       validationErrors.password = "Password is required";
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     //  Reset Password Logic
//     if (isReset) {
//       if (!savedUser) {
//         alert("User not found!");
//         return;
//       }
//       if (savedUser.email === formData.email) {
//         saveUserToLocal({ ...savedUser, password: "123456" });
//         alert("Password reset successfully! New password: 123456");
//         setIsReset(false);
//       } else {
//         alert("Email does not match!");
//       }
//       return;
//     }

//     // Signup logic
//     if (!isLogin) {
//       saveUserToLocal(formData);
//       login(formData);
//       navigate("/home");
//       return;
//     }

//     //  Login logic
//     if (!savedUser) {
//       alert("User not found! Please SignUp first.");
//       return;
//     }

//     if (
//       savedUser.email === formData.email &&
//       savedUser.password === formData.password
//     ) {
//       login(savedUser);
//       navigate("/home");
//     } else {
//       alert("Invalid credentials!");
//     }

//     setFormData({ email: "", password: "" });
//     setErrors({});
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
//       <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md text-left">
//         <h2 className="text-2xl font-bold mb-6 text-gray-900">
//           {isReset
//             ? "Reset Your Password"
//             : isLogin
//             ? "Sign In"
//             : "Create an account"}
//         </h2>

//         {isReset && (
//           <p className="text-gray-600 mb-6">
//             Enter your email to receive a password reset link.
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`border rounded-lg p-3 mt-1 focus:outline-none focus:ring-1 ${
//                 errors.email
//                   ? "border-red-600 focus:ring-red-600"
//                   : "focus:ring-[#604C91]"
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-600 text-xs mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           {!isReset && (
//             <div className="flex flex-col relative">
//               <label className="text-gray-700 font-medium">Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`border rounded-lg p-3 mt-1 focus:outline-none focus:ring-1 ${
//                   errors.password
//                     ? "border-red-600 focus:ring-red-600"
//                     : "focus:ring-[#604C91]"
//                 }`}
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-10 cursor-pointer text-gray-500"
//               >
//                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//               </span>
//               {errors.password && (
//                 <p className="text-red-600 text-xs mt-1">{errors.password}</p>
//               )}
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-[#604C91] text-white py-3 rounded-lg font-medium hover:bg-[#6a569e] transition-all"
//           >
//             {isReset
//               ? "Reset Password"
//               : isLogin
//               ? "Sign in"
//               : "Create Account"}
//           </button>
//         </form>

//         <div className="text-sm mt-5 space-y-2">
//           {isReset ? (
//             <p className="text-gray-600">
//               Back to{" "}
//               <span
//                 className="text-[#604C91] cursor-pointer font-medium"
//                 onClick={() => setIsReset(false)}
//               >
//                 Sign in
//               </span>
//             </p>
//           ) : isLogin ? (
//             <>
//               <p className="text-gray-600">
//                 Need an account?{" "}
//                 <span
//                   className="text-[#604C91] cursor-pointer font-medium"
//                   onClick={() => setIsLogin(false)}
//                 >
//                   Sign up
//                 </span>
//               </p>

//               <p className="text-gray-600">
//                 Forgot your password?{" "}
//                 <span
//                   className="text-[#604C91] cursor-pointer font-medium"
//                   onClick={() => setIsReset(true)}
//                 >
//                   Reset it
//                 </span>
//               </p>
//             </>
//           ) : (
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <span
//                 className="text-[#604C91] cursor-pointer font-medium"
//                 onClick={() => setIsLogin(true)}
//               >
//                 Sign in
//               </span>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
