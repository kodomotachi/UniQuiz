// components/Navbar.jsx
// import { useState } from 'react';
import { Menu, X } from "lucide-react";
import "../../index.css";
import { Link } from "react-router-dom";

export default function NavBar() {
   return (
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
         <Link to="/">
            <h2 className="text-xl font-medium text-black py-2 cursor-pointer">
               UniQuiz
            </h2>
         </Link>
      </div>
   );
}
