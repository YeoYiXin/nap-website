// Written by Grp B
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";

interface LocationOption {
  name: string;
  id: string;
}

interface LocationButtonProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLocations: string[]; // Add selectedDepartments to props
  locationOptions: LocationOption[]; // Pass departmentOptions as prop
}

const location: React.FC<LocationButtonProps> = ({ onClick, isOpen, onClose, setSelectedLocations, selectedLocations, locationOptions  }) => {

  const handleLocationClick = (id: string) => {
 
    setSelectedLocations((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const isSelected = (id: string) => selectedLocations.includes(id);

  const dropdownWidth = locationOptions.reduce(
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
      <MdOutlineLocationOn className="text-sm fill-blue-400 font-bold" />
      <p className="text-sm">Location</p>
    </button>
    {isOpen && (
        <div
        className="absolute mt-2 w-[calc(100% - 4px)] max-w-[calc(100% - 4px)] rounded-md bg-white shadow-lg z-10"
        style={{ width: dropdownWidth, maxHeight: "200px", overflowY: "auto" }}
      >
        {locationOptions.map((option) => (
          <div
            key={option.id}
            className={`px-4 py-2 cursor-pointer border-b-2 border-gray-300 border-opacity-50 hover:border-blue-200 hover:bg-blue-200 ${
              isSelected(option.id) ? "bg-blue-200" : ""
            }`}
            onClick={() => handleLocationClick(option.id)}
          >
            {option.name}
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default location;
