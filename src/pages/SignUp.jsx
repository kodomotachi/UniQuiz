import { useState } from "react";
import NavBar from "../components/NavBar/NavBar";

export default function SignUp() {
   const [studentId, setStudentId] = useState("");
   const [teacherId, setTeacherId] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [classId, setClassId] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
   const [selectedRole, setSelectedRole] = useState("");
   const [address, setAddress] = useState("");

   const roles = ["Student", "Teacher"];

   const checkRole = (selectedRole) => {
      if (selectedRole === "Student") return "Student ID";
      else if (selectedRole === "Teacher") return "Teacher ID";
      else return "Login";
   };

   const switchComponent = (selectedRole) => {
      if (selectedRole === "Student") {
         return (
            <>
               <input
                  type="text"
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded border py-3 px-3 outline-none mb-5"
               />

               <div className="flex flex-row gap-4 mb-5">
                  <input
                     type="text"
                     placeholder="First name"
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                     className="basis-1/3 rounded border py-3 px-3 outline-none"
                  />
                  <input
                     type="text"
                     placeholder="Second name"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     className="basis-2/3 rounded border py-3 px-3 outline-none"
                  />
               </div>

               <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded border py-3 px-3 outline-none mb-5"
               />

               <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded border py-3 px-3 outline-none mb-5"
               />
            </>
         );
      } else if (selectedRole === "Teacher") {
         return (
            <>
               <input
                  type="text"
                  placeholder="Teacher ID"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full rounded border py-3 px-3 outline-none mb-5"
               />

               <div className="flex flex-row gap-4 mb-5">
                  <input
                     type="text"
                     placeholder="First name"
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                     className="basis-1/3 rounded border py-3 px-3 outline-none"
                  />
                  <input
                     type="text"
                     placeholder="Second name"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     className="basis-2/3 rounded border py-3 px-3 outline-none"
                  />
               </div>

               <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded border py-3 px-3 outline-none mb-5"
               />

               <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded border py-3 px-3 outline-none mb-5"
               />
            </>
         );
      }
   };

   return (
      <>
         <NavBar />
         <div className="flex items-center justify-center h-screen">
            <div className="border border-gray-400 bg-white rounded-xl px-10 py-2 shadow-md w-[650px] h-[700px]">
               <form onSubmit={() => {}}>
                  <h4 className="text-2xl my-9 text-center">Create Account</h4>

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

                  {switchComponent(selectedRole)}
               </form>
            </div>
         </div>
      </>
   );
}
