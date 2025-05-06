import { useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import "../index.css";
import Password from "../components/Input/Password";
import { Link } from "react-router-dom";

export default function SignIn() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [selectedRole, setSelectedRole] = useState("");

   const roles = ["Teacher", "Student"];

   const checkRole = (selectedRole) => {
      if (selectedRole === "Student")
         return "Student ID";
      else if (selectedRole === "Teacher")
         return "Teacher ID";
      else
         return "Login";
   }

   return (
      <>
         <NavBar />
         <div className="flex items-center justify-center h-screen">
            <div className="border border-gray-400 bg-white rounded-xl px-10 py-2 shadow-md w-[650px] h-[500px]">
               <form onSubmit={() => {}}>
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
                        console.log("Email:", e.target.value);
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
