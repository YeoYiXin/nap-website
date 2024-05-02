// Written by Grp B
import React from "react";
import { TbReload } from "react-icons/tb";
interface Props{
  clicked: () => void;
  isSelected: boolean;
}
const inProgressButton = ({clicked, isSelected}:Props) => {
  return (
    <button className={`w-[100px] flex flex-col items-center justify-center gap-1 rounded-md px-2 border-2  shadow-md hover:border-blue-400 ${isSelected ? 'border-blue-400 bg-blue-400' : 'border-gray-400'}`}
    onClick={clicked}>
      <TbReload className={`mt-1 text-xl font-bold ${isSelected? "text-white":"text-blue-400"}`} />
      <p className={`text-sm ${isSelected? "text-white":"text-blue-400"}`}>In Progress</p>
    </button>
  );
};

export default inProgressButton;
