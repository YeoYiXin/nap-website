// Written by Grp B
import React from 'react';
import { MdDone } from "react-icons/md";

interface Props{
    clicked: () => void;
    isSelected: boolean;
}

const done = ({clicked, isSelected}:Props) => {
  return (
    <button className={`w-[100px] flex flex-col items-center justify-center gap-1 rounded-md px-2 border-2 shadow-md hover:border-blue-400 ${isSelected ? 'border-blue-400 bg-blue-400' : 'border-gray-400'}`}
    onClick={clicked}>
      <MdDone className={`mt-1 text-xl font-bold ${isSelected? "text-white":"text-blue-400"}`} />
      <p className={`text-sm ${isSelected? "text-white":"text-blue-400"}`}>Done</p>
    </button>
  )
}

export default done