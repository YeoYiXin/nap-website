import React from 'react'
import { MdOutlineLocationOn } from "react-icons/md";

const location = () => {
  return (
    <button className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-gray-300 shadow-md hover:border-blue-200 hover:bg-blue-200">
      <MdOutlineLocationOn className="text-sm fill-blue-400 font-bold" />
      <p className="text-sm">Location</p>
    </button>
  )
}

export default location