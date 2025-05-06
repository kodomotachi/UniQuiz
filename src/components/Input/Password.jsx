import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function Password({ value, onChange, placeholder }) {
   const [isShowPassword, setIsShowPassword] = useState(false);

   const toggleShowPassword = () => {
      setIsShowPassword(!isShowPassword);
   };

   return (
      <div className="flex items-center rounded-lg bg-transparent border-[1.5px] px-5 py-3 mb-3">
         <input
            value={value}
            onChange={onChange}
            type={isShowPassword ? "text" : "password"}
            placeholder={placeholder || "Password"}
            className="w-full bg-transparent outline-none"
         />

         {isShowPassword ? (
            <FaRegEye
               size={22}
               className="text-primary cursor-pointer"
               onClick={() => toggleShowPassword()}
            />
         ) : (
            <FaRegEyeSlash
               size={22}
               className="text-slate-400 cursor-pointer"
               onClick={() => toggleShowPassword()}
            />
         )}
      </div>
   );
}
