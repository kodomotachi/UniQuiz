// components/Navbar.jsx
// import { useState } from 'react';
import { Menu, X } from "lucide-react";
import "../../index.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NavBar() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [fullName, setFullName] = useState("");
   const [role, setRole] = useState("");
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      const checkAuth = () => {
         const token = localStorage.getItem('token');
         setIsLoggedIn(!!token);
         const name = localStorage.getItem('fullName');
         setFullName(name || "");
         const userRole = localStorage.getItem('role');
         setRole(userRole || "");
      };

      checkAuth();

      window.addEventListener('storage', checkAuth);

      return () => {
         window.removeEventListener('storage', checkAuth);
      };
   }, []);

   const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('fullName');
      setIsLoggedIn(false);
      setFullName("");
      navigate('/signin');
      // This is a workaround to force re-render on pages that don't auto-update
      window.dispatchEvent(new Event("storage"));
   };

   return (
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
         <Link to="/">
            <h2 className="text-xl font-medium text-black py-2 cursor-pointer">
               UniQuiz
            </h2>
         </Link>
         <div className="flex items-center gap-4">
            {/* Hiển thị tên cho teacher (không phải admin) */}
            {isLoggedIn && fullName && role?.toLowerCase() === "teacher" && fullName.toLowerCase() !== "admin" && (
               <span className="font-medium text-black whitespace-nowrap">{fullName}</span>
            )}
            {/* Hiển thị tên cho student */}
            {isLoggedIn && fullName && role?.toLowerCase() === "student" && (
               <span className="font-medium text-black whitespace-nowrap">{fullName}</span>
            )}
            {isLoggedIn && location.pathname !== "/signin" && (
               <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-300"
               >
                  Sign Out
               </button>
            )}
         </div>
      </div>
   );
}
