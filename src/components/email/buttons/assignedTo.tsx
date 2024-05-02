// Written by Grp B
import React from "react";
import { GoPerson } from "react-icons/go";

interface DepartmentOption {
  name: string;
  id: string;
}

interface AssignedToButtonProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  setSelectedDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDepartments: string[]; // Add selectedDepartments to props
  departmentOptions: DepartmentOption[]; // Pass departmentOptions as prop
}

const AssignedToButton: React.FC<AssignedToButtonProps> = ({
  onClick,
  isOpen,
  onClose,
  setSelectedDepartments,
  selectedDepartments,
  departmentOptions,
}) => {
  const handleDepartmentClick = (id: string) => {
    setSelectedDepartments((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const isSelected = (id: string) => selectedDepartments.includes(id);

  const dropdownWidth = departmentOptions.reduce(
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
        <GoPerson className="text-sm fill-blue-400 font-bold" />
        <span className="text-sm">Assigned To</span>
      </button>
      {isOpen && (
        <div
          className="absolute mt-2 w-[calc(100% - 4px)] max-w-[calc(100% - 4px)] rounded-md bg-white shadow-lg z-10"
          style={{ width: dropdownWidth }}
        >
          {departmentOptions.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-2 cursor-pointer border-b-2 border-gray-300 border-opacity-50 hover:border-blue-200 hover:bg-blue-200 ${
                isSelected(option.id) ? "bg-blue-200" : ""
              }`}
              onClick={() => handleDepartmentClick(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedToButton;
