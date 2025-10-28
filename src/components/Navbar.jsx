import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");
  //   navigate("/");
  // };
  const navLinks = [
    {
      name: "Home",
      link: "/home",
    },
    {
      name: "About",
      link: "/about",
    },
  ];

  return (
    <nav className="bg-white text-black shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <ul className="hidden md:flex space-x-8">
          {/* {navLinks.map((item) => (
            <li
              key={item}
              className="hover:text-secondary-c1 transition font-medium cursor-pointer"
            >
              {item}
            </li>
          ))} */}
          {navLinks.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                navigate(item.link);
              }}
              className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer ${
                item.link === pathname
                  ? "bg-primary-c1 text-black"
                  : "text-primary-c1"
              }`}
            >
              <span>{item.name}</span>
            </li>
          ))}
        </ul>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="hidden md:block bg-secondary-c1 px-4 py-2 rounded-lg hover:bg-secondary-c2 transition font-medium"
        >
          Login
        </button>
        {/* <button
          onClick={logOut}
          className="hidden md:block bg-secondary-c1 px-4 py-2 rounded-lg hover:bg-secondary-c2 transition font-medium"
        >
          Log Out
        </button> */}
      </div>
    </nav>
  );
}
