import React from "react";
import { CiSearch } from "react-icons/ci";

const searchBox = () => {
  return (
    <div className="relative h-full">
      <input
        type="search"
        placeholder="Search work order"
        className="border-2 border-gray-300 rounded-md px-8 shadow-sm hover:border-blue-300 focus:outline-none focus:border-blue-300 active:border-blue-300 transition-all duration-300 ease-in-out"
        style={{ paddingLeft: "36px" }}
      />
      <button>
        <CiSearch className="absolute left-2 top-[6px] transform  text-gray-400 hover:fill-blue-300 focus:fill-blue-300" />
      </button>
    </div>
  );
};

export default searchBox;
