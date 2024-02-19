import React from "react";
import { GrStatusUnknown } from "react-icons/gr";

//dropdown button
const status = () => {
  return (
    <button className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-gray-300 shadow-md hover:border-blue-200 hover:bg-blue-200">
      <GrStatusUnknown className="text-sm text-blue-400 font-bold " />
      <p className="text-sm">Status</p>
    </button>
  );
};

export default status;
