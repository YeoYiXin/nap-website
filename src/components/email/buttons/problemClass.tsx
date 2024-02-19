import React from 'react'
import { MdClass } from "react-icons/md";

const problemClass = () => {
  return (
    <button className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-gray-300 shadow-md hover:border-blue-200 hover:bg-blue-200">
    <MdClass className="text-sm fill-blue-400 font-bold" />
    <p className="text-sm">Problem Class</p>
  </button>
  )
}

export default problemClass