import React, { useState } from "react";
import { BiMessageAltError } from "react-icons/bi";

interface PriorityClassOption {
  name: string;
  id: string;
}

interface PriorityButtonProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  setSelectedPriority: React.Dispatch<React.SetStateAction<string>>;
  selectedPriority: string;
  priorityOptions: PriorityClassOption[];
}
const priority: React.FC<PriorityButtonProps> = ({ onClick, isOpen, onClose, setSelectedPriority, selectedPriority, priorityOptions }) => {

  const handlePrioClick = (id: string) => {
    if (selectedPriority === id) {
      // If the clicked priority is already selected, remove it
      setSelectedPriority("");
    } else {
      // If the clicked priority is not selected, select it
      setSelectedPriority(id);
    }
    onClose(); // Close dropdown after selecting or deselecting a priority
  };

  const dropdownWidth = priorityOptions.reduce(
    (max, option) => Math.max(max, option.name.length * 8),
    120
  );

  return (
    <div>
      <button
        className="flex flex-row items-center justify-center gap-1 rounded-sm px-2 border-2 border-gray-300 shadow-md hover:border-blue-200 hover:bg-blue-200"
        onClick={() => {
          onClick(); // Toggle dropdown
          if (isOpen) onClose(); // Close dropdown if it's already open
        }}
      >
        <BiMessageAltError className="text-sm fill-blue-400 font-bold" />
        <p className="text-sm">Priority</p>
      </button>
      {isOpen && (
        <div
          className="absolute mt-2 w-[calc(100% - 4px)] max-w-[calc(100% - 4px)] rounded-md bg-white shadow-lg z-10"
          style={{ width: dropdownWidth }}
        >
          {priorityOptions.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-2 cursor-pointer border-b-2 border-gray-300 border-opacity-50 hover:border-blue-200 hover:bg-blue-200 ${
                selectedPriority === option.id ? "bg-blue-200" : ""
              }`}
              onClick={() => handlePrioClick(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default priority;
