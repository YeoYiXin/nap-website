import React from "react";
import { GoPerson } from "react-icons/go";

const assignedToButton = () => {
  return (
    <button className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-gray-300 shadow-md hover:border-blue-200 hover:bg-blue-200">
      <GoPerson className="text-sm fill-blue-400 font-bold" />
      <p className="text-sm">Assigned To</p>
    </button>
  );
};

export default assignedToButton;
