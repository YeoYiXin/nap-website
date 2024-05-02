// Written by Grp B
import React from "react";
import { GrFormEdit } from "react-icons/gr";

interface Props {
  onClick: () => void;
}

const edit = ({onClick}:Props) => {
  return (
    <button className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-blue-400 shadow-md hover:border-blue-200 hover:bg-blue-200" onClick={onClick}>
      <GrFormEdit className="text-md text-blue-400 font-bold" />
      <p className="text-sm text-blue-400">Edit</p>
    </button>
  );
};

export default edit;
