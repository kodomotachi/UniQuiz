import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
   return (
      <BrowserRouter>
         {" "}
         <Routes>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />}>
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
                  element={<AdjustTeacherList />}
               />
               <Route
                  path="adjust-question-list"
                  element={<AdjustQuestionList />}
               />
               <Route
                  path="prepare-examination"
                  element={<PrepareExamination />}
               />
            </Route>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/check-table" element={<CheckTable />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
