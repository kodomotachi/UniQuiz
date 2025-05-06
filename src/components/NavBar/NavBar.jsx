// components/Navbar.jsx
// import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import '../../index.css';

export default function NavBar() {
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">UniQuiz</h2>
    </div>
  );
}