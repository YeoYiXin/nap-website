import Link from "next/link";
import React from "react";
interface Props {
  onClick: () => void;
  isActive: boolean;
}
const navDep = ({ onClick, isActive }: Props) => {
  return (
    <div
      className={`cursor-pointer border-2 border-l-0 border-r-0 border-y-slate-800 hover:border-opacity-20 hover:text-gray-100 hover:shadow-md w-full left-0 px-2 py-3 ${
        isActive
          ? "border-opacity-20 text-gray-100 shadow-md"
          : "border-opacity-10"
      }`}
      onClick={onClick}
    >
      <p className="cursor-pointer">Department</p>
    </div>
  );
};

export default navDep;
