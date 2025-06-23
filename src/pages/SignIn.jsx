import { useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import "../index.css";
import Password from "../components/Input/Password";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [selectedRole, setSelectedRole] = useState("");
   const navigate = useNavigate();

   const roles = ["Teacher", "Student"];

   const checkRole = (selectedRole) => {
      if (selectedRole === "Student")
         return "Student ID";
      else if (selectedRole === "Teacher")
         return "Teacher ID";
      else
         return "Login";
   }

   const handleLogin = async (e) => {
      e.preventDefault();
      if (selectedRole === "Teacher") {
         try {
            const response = await fetch('http://localhost:3000/teacher/login', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ teacherId: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
               localStorage.setItem('token', data.token);
               const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
               localStorage.setItem('role', tokenPayload.role);
               // Lưu fullName nếu có
               if (data.fullName) {
                  localStorage.setItem('fullName', data.fullName);
               } else {
                  localStorage.removeItem('fullName');
               }
               navigate('/teacher-dashboard');
            } else {
               alert(data.message || 'Login failed');
            }
         } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
         }
      } else if (selectedRole === "Student") {
         try {
            const response = await fetch('http://localhost:3000/student/login', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ studentId: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
               localStorage.setItem('token', data.token);
               const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
               localStorage.setItem('role', tokenPayload.role);
               if (data.fullName) {
                  localStorage.setItem('fullName', data.fullName);
               } else {
                  localStorage.removeItem('fullName');
               }
               navigate('/student-examinations');
            } else {
               alert(data.message || 'Login failed');
            }
         } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
         }
      }
   };

   return (
      <>
         <NavBar />
         <div className="flex items-center justify-center h-screen">
            <div className="border border-gray-400 bg-white rounded-xl px-10 py-2 shadow-md w-[650px] h-[500px]">
               <form onSubmit={handleLogin}>
                  <h4 className="text-2xl my-9 text-center">Login</h4>

                  <div className="w-full flex items-center justify-center mb-5">
                     <h2 className="mr-3 items-center">Role</h2>
                     <select
                        id="listbox"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className=" w-full rounded border py-3 px-3 outline-none"
                     >
                        <option value="">-- Select an item --</option>
                        {roles.map((item, index) => (
                           <option key={index} value={item}>
                              {item}
                           </option>
                        ))}
                     </select>
                  </div>
                  {selectedRole && (
                     <div className="mt-2 text-sm text-red-400">
                        You selected: {selectedRole}
                     </div>
                  )}

                  <input
                     type="text"
                     placeholder={checkRole(selectedRole)}
                     className="login-email-box"
                     value={email}
                     onChange={(e) => {
                        setEmail(e.target.value);
                     }}
                  />

                  <Password
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />

                  <button type="submit" className="btn-primary">
                     Sign In
                  </button>

                  <p className="text-sm text-center">
                     Not registered yet?{" "}
                     <Link to="/signup" className="text-blue-500 underline">
                        Create an account
                     </Link>
                  </p>
               </form>
            </div>
         </div>
      </>
   );
}
