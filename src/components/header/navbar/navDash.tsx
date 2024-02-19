import React from "react";
// import "../../../styles/navStyle.css"
interface Props {
  onClick: () => void;
  isActive: boolean;
}
const navDash = ({ onClick, isActive }: Props) => {
  return (
    <div
      className={`border-2 border-l-0 border-r-0 border-y-slate-800 hover:border-opacity-20 hover:text-gray-100 hover:shadow-md w-full left-0 px-2 py-3 ${
        isActive ? "border-opacity-20 text-gray-100 shadow-md" : "border-opacity-10"
      }`}
      onClick={onClick}
    >
      <a href="" className="no-underline ">
        Dashboard
      </a>
    </div>
  );
};

export default navDash;
