import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { saveUserToLocal } from "../../Utils/auth";

const TherapistNavbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    {
      name: "Dashboard",
      pathname: "/dashboard",
    },
    {
      name: "Assignment",
      pathname: "/assignment",
    },
  ];

  const handleLogout = () => {
    logout();
    saveUserToLocal(null);
    navigate("/");
  };

  return (
    <nav className="bg-white text-[#604C91] shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto  py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center bg-w">
          <img
            src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
            alt="Speechgears Research Institute"
            className="w-[294.9px] md:w-[427.7px] mx-0"
          />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((item) => (
            <li
              key={item.name}
              onClick={() => navigate(item.pathname)}
              className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                item.pathname === pathname
                  ? "text-[#D73F7F] font-semibold"
                  : "text-[#604C91]"
              }`}
            >
              <span>{item.name}</span>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden md:block bg-[#D73F7F] hover:bg-[#E16F9F] text-white px-4 py-2 rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-[#8879AD] text-white flex justify-around py-3 text-sm font-medium">
        <Link to="/dashboard" className="hover:text-[#FFD2E1]">
          Dashboard
        </Link>
        <Link to="/assignment" className="hover:text-[#FFD2E1]">
          Assignment
        </Link>
        <button onClick={handleLogout} className="hover:text-[#FFD2E1]">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TherapistNavbar;
