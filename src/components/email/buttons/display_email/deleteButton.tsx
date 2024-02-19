import React from 'react';
import { MdDeleteOutline } from "react-icons/md";

const deleteButton = () => {
  return (
    <button className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-red-400 shadow-md hover:border-red-300 hover:bg-red-300">
      <MdDeleteOutline className="text-md fill-red-400 font-bold" />
      <p className="text-sm text-red-400">Delete</p>
    </button>
  )
}

export default deleteButton;