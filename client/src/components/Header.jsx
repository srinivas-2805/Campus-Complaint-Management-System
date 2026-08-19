
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const userRole = user ? user.role : "guest";

  const links = [
    { name: "Home", path: "/", roles: ["guest", "student", "staff", "admin", "faculty"] },
    { name: "Login", path: "/login", roles: ["guest"] },
    { name: "Register", path: "/register", roles: ["guest"] },
    { name: "Raise Complaint", path: "/raise-complaint", roles: ["student"] },
    { name: "My Complaints", path: "/my-complaints", roles: ["student"] },
    { name: "All Complaints", path: "/all-complaints", roles: ["staff", "admin"] },
    { name: "Add Faculty", path: "/create-faculty", roles: ["admin"] },
    { name: "Manage Faculty", path: "/manage-faculty", roles: ["admin"] },
    { name: "Department Complaints", path: "/department-complaints", roles: ["faculty"] },
  ];

  return (
    <header className="border-b border-pink-500/30">
      <div className="px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="font-extrabold text-pink-400 text-lg">CCMS</Link>
         {/* <Link to="/">
            <img 
              src="/logo.png" 
              alt="CCMS Logo" 
              className="h-10 w-auto md:h-12" 
            />
          </Link> */}
    
    
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          {links
            .filter((link) => link.roles.includes(userRole))
            .map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`hover:text-pink-300 transition-colors ${
                  isActive(link.path) ? "text-pink-400 font-semibold" : "text-gray-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
          {user && (
            <button
              onClick={logout}
              className="hover:text-pink-300 font-semibold transition-colors text-gray-500"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none flex items-center justify-center p-2 rounded-md hover:text-pink-400 transition-colors text-gray-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        menuOpen ? "max-h-96" : "max-h-0"
      }`}>
        <div className="px-8 py-4 space-y-2 bg-white border-t border-gray-200">
          {links
            .filter((link) => link.roles.includes(userRole))
            .map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={`block py-2 text-sm transition-colors ${
                  isActive(link.path) ? "text-pink-400 font-semibold" : "text-gray-500 hover:text-pink-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          {user && (
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="block w-full text-left py-2 text-sm font-semibold transition-colors text-gray-500 hover:text-pink-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
