import React from "react";
import { BiMessageAltError } from "react-icons/bi";

const priority = () => {
  return (
    <button className="flex flex-row items-center gap-1 justify-center rounded-sm px-2 border-2 border-gray-300 shadow-md hover:border-blue-200 hover:bg-blue-200">
      <BiMessageAltError className="text-sm fill-blue-400 font-bold" />
      <p className="text-sm">Priority</p>
    </button>
  );
};

export default priority;
