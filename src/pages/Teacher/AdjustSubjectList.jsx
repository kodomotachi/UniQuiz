import { useState, useEffect } from "react";
import React from "react";

const users = [
   {
      id: "BAS1203_CLC",
      subject: "Calculus 1",
   },
   {
      id: "BAS1204_CLC",
      subject: "Calculus 2",
   },
   {
      id: "BAS1201_CLC",
      subject: "Algebra",
   },
   {
      id: "BAS1224_CLC",
      subject: "Physics 1",
   },
   {
      id: "INT1306_CLC",
      subject: "Data Structures and Algorithms",
   },
   {
      id: "INT14124_CLC",
      subject: "Natural Language Processing",
   },
];

export default function AdjustSubjectList() {
   const [showForm, setShowForm] = useState(false);
   
   useEffect(() => {
      document.title = "Adjust Subject List";
   }, []);

   return (
      <>
         <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-1/6 bg-gray-100 shadow-md px-4 py-20">
               <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 mb-5 rounded-md text-sm transition duration-300 flex items-center w-full"
                        onAction={() => {setShowForm(true)}}>
                  New Subject
               </button>
               <button className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 mb-5 rounded-md text-sm transition duration-300 flex items-center w-full">
                  Restore
               </button>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 overflow-x-auto p-4 flex flex-col items-center bg-gray-50">
               <h2 className="text-2xl font-semibold mb-12 mt-8">Subject List</h2>
               <div className="w-2/3 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
               <table className="min-w-full divide-y divide-gray-200">
                  {/* {" "} */}{" "}
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Id
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Subject
                        </th>
                        <th className="px-6 py-3"></th>
                     </tr>
                  </thead>
                  {/* {" "} */}
                  <tbody className="bg-white divide-y divide-gray-200">
                     {users.map((user, index) => (
                        <tr key={index}>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.id}
                           </td>{" "}
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.subject}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-sm transition duration-300">
                                 Edit
                              </button>
                           </td>                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            </div>
         </div>
      </>
   );
}
