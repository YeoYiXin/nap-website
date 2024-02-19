import React from "react";
import { FiPlus } from "react-icons/fi";
const newWorkOrder = () => {
  return (
    <div>
      <button className="relative h-[26px] flex flex-row items-center gap-2 justify-center bg-blue-500 px-2 rounded-md shadow-sm text-white hover:bg-blue-400 ">
        <FiPlus className="text-sm" />
        <p className="text-sm">New Work Order</p>
      </button>
    </div>
  );
};

export default newWorkOrder;
