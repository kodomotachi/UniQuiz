import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./index.css";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdjustSubjectList from "./pages/Teacher/AdjustSubjectList";
import AdjustStudentList from "./pages/Teacher/AdjustStudentList";
import AdjustTeacherList from "./pages/Teacher/AdjustTeacherList";
import AdjustQuestionList from "./pages/Teacher/AdjustQuestionList";
import PrepareExamination from "./pages/Teacher/PrepareExamination";
import TeacherDashboardButton from "./pages/TeacherDashboardButton";
import CheckTable from "./CheckTable";
import AdminViewExaminations from "./pages/Teacher/AdminViewExaminations";
import StudentExaminations from "./pages/StudentExaminations";
import Exam from "./pages/Exam";
import ExamResult from "./pages/ExamResult";

// Allows any logged-in teacher
const ProtectedRoute = ({ children }) => {
   const token = localStorage.getItem('token');
   if (!token) {
      return <Navigate to="/signin" />;
   }
   // Optional: Check if token is valid/not expired
   return children; 
};

// Allows only the 'admin' user
const AdminRoute = ({ children }) => {
   const token = localStorage.getItem('token');
   try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.id === 'admin') {
         return children;
      }
   } catch (error) {
      console.error("Invalid token:", error);
   }
   // Redirect if not admin or on error
   return <Navigate to="/teacher-dashboard" />;
};

function App() {
   return (
      <BrowserRouter>
         {" "}
         <Routes>
            <Route 
               path="/teacher-dashboard" 
               element={
                  <ProtectedRoute>
                     <TeacherDashboard />
                  </ProtectedRoute>
               }
            >
               <Route index element={<TeacherDashboardButton />} />
               <Route
                  path="adjust-subject-list"
                  element={<AdjustSubjectList />}
               />
               <Route
                  path="adjust-student-list"
                  element={<AdjustStudentList />}
               />
               <Route
                  path="adjust-teacher-list"
                  element={
                     <AdminRoute>
                        <AdjustTeacherList />
                     </AdminRoute>
                  }
               />
               <Route
                  path="adjust-question-list"
                  element={<AdjustQuestionList />}
               />
               <Route
                  path="prepare-examination"
                  element={
                     <ProtectedRoute>
                        <PrepareExamination />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="admin-view-examinations"
                  element={
                     <AdminRoute>
                        <AdminViewExaminations />
                     </AdminRoute>
                  }
               />
            </Route>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/check-table" element={<CheckTable />} />
            <Route path="/student-examinations" element={<StudentExaminations />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam-result" element={<ExamResult />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
