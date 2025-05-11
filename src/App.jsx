import React from 'react'
import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './index.css'
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />    
        <Route path="/teacher_dashboard" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App