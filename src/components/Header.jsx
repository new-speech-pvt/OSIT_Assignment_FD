// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import { saveUserToLocal } from "../Utils/auth";

// export default function Header() {
//   const { logout } = useAuthStore();
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const navLinks = [
//     {
//       name: "Dashboard",
//       link: "/dashboard",
//     },
//     {
//       name: "Assignment",
//       link: "/assignment",
//     },
//   ];

//   const handleLogout = () => {
//     logout();
//     saveUserToLocal(null);
//     navigate("/");
//   };

//   return (
//     <header className=" text-[#604C91]  shadow-md">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//         {/* Logo */}
//         <div className="text-2xl font-bold tracking-wide cursor-pointer">
//           <Link to="/">Logo</Link>
//         </div>

//         {/* Nav Links */}
//         <ul className="border border-red-400">
//           {navLinks.map((item) => (
//             <li
//               key={item.name}
//               onClick={() => {
//                 navigate(item.link);
//               }}
//               //   className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer ${
//               //     item.link === pathname
//               //       ? "bg-primary-c1 text-black"
//               //       : "text-primary-c1"
//               //   }`}
//               className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer ${
//                 item.link == pathname
//                   ? "text-[#D73F7F] nav-item-active"
//                   : "text-[#604C91]"
//               }`}
//             ></li>
//           ))}
//         </ul>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="bg-[#D73F7F] hover:bg-[#E16F9F] text-white px-4 py-2 rounded-lg transition"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Mobile Nav */}
//       <div className="md:hidden bg-[#8879AD] flex justify-around py-2 text-sm">
//         <Link to="/assignments">Assignments</Link>
//         <Link to="/dashboard">Dashboard</Link>
//       </div>
//     </header>
//   );
// }
