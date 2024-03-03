import React, { useState } from "react";
import { MdClass } from "react-icons/md";

interface ProblemClassOption {
  name: string;
  id: string;
}

interface ProblemClassButtonProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  setSelectedProblemClasses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedProblemClasses: string[];
  problemClassOptions: ProblemClassOption[];
}

const problemClass: React.FC<ProblemClassButtonProps> = ({
  onClick,
  isOpen,
  onClose,
  setSelectedProblemClasses,
  selectedProblemClasses,
  problemClassOptions,
}) => {
  const handleProblemClassClick = (id: string) => {
    setSelectedProblemClasses((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };
  const isSelected = (id: string) => selectedProblemClasses.includes(id);

  const dropdownWidth = problemClassOptions.reduce(
    (max, option) => Math.max(max, option.name.length * 8),
    120
  );

  return (
    <div className="assigned-to-button-container relative">
      <button
        className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-gray-300 shadow-md hover:border-blue-200 hover:bg-blue-200"
        onClick={() => {
          onClick(); // Toggle dropdown
          if (isOpen) onClose(); // Close dropdown if it's already open
        }}
      >
        <MdClass className="text-sm fill-blue-400 font-bold" />
        <p className="text-sm">Problem Class</p>
      </button>
      {isOpen && (
        <div
          className="absolute mt-2 w-[calc(100% - 4px)] max-w-[calc(100% - 4px)] rounded-md bg-white shadow-lg z-10"
          style={{ width: dropdownWidth }}
        >
          {problemClassOptions.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-2 cursor-pointer border-b-2 border-gray-300 border-opacity-50 hover:border-blue-200 hover:bg-blue-200 ${
                isSelected(option.id) ? "bg-blue-200" : ""
              }`}
              onClick={() => handleProblemClassClick(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default problemClass;
