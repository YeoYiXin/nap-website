// Written by Grp B
"use client";
import React, { useState } from "react";
import { LuDot } from "react-icons/lu";
import DummyEmail from "./dummyEmail";
import { Timestamp } from "@firebase/firestore";

interface Props {
  onEmailClick: (email: FirestoreEmail) => void;
  selectedDepartments: string[];
  selectedProblemClasses: string[];
  selectedLocations: string[];
  selectedPriorities: string;
}

interface FirestoreEmail {
  date: Timestamp;
  pIndoorLocation: string;
  problemClass: string;
  problemDepartment: string;
  problemDescription: string;
  problemId: string;
  problemImageURL: string;
  problemLocation: string;
  problemPriority: string;
  problemReportNum: number;
  problemStatus: string;
  problemSubClass: string;
  problemTitle: string;
  uid: string;
  latitude: number;
  longitude: number;
}

const ReceiveEmails = ({
  onEmailClick,
  selectedDepartments,
  selectedProblemClasses,
  selectedLocations,
  selectedPriorities,
}: // clickedEmails,
Props) => {
  const [active, setActive] = useState("To do");

  const handleClick = (section: React.SetStateAction<string>) => {
    setActive(section);
  };

  return (
    <div className="w-[450px] h-full border-2 border-gray-400 border-opacity-30 rounded-sm flex flex-col flex-grow">
      <div className="border-b-2 border-gray-400 border-opacity-30 w-full flex flex-row cursor-pointer">
        <div
          className={`flex-1 flex flex-row items-center justify-center text-center cursor-pointer ${
            active === "To do"
              ? "text-blue-500 border-b-2 border-blue-300 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => handleClick("To do")}
        >
          <LuDot
            className={`text-3xl ${
              active === "To do" ? "text-blue-500 font-bold" : "hidden"
            }`}
          />
          To do
        </div>
        <div
          className={`flex-1 flex flex-row items-center justify-center text-center cursor-pointer ${
            active === "Done"
              ? "text-blue-500 border-b-2 border-blue-300 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => handleClick("Done")}
        >
          <LuDot
            className={`text-3xl ${
              active === "Done" ? "text-blue-500 font-bold" : "hidden"
            }`}
          />
          Done
        </div>
      </div>
      <div className="border-b-2 border-gray-400 border-opacity-30 py-2 px-2">
        {/* put list of studd that is added in filter */}
        <p>
          Filter By:
          {selectedDepartments.length === 0 &&
          selectedProblemClasses.length === 0 &&
          selectedLocations.length === 0 &&
          selectedPriorities.length === 0
            ? " None;"
            : `${selectedDepartments.length > 0 ? " Department;" : ""}
               ${selectedProblemClasses.length > 0 ? " Problem Class;" : ""}
               ${selectedLocations.length > 0 ? " Location;" : ""}
               ${selectedPriorities.length > 0 ? " Priority;" : ""}`}
        </p>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto">
        <DummyEmail
          onEmailClick={onEmailClick}
          active={active}
          selectedDepartments={selectedDepartments}
          selectedProblemClasses={selectedProblemClasses}
          selectedLocations={selectedLocations}
          selectedPriorities={selectedPriorities}
        />
      </div>
    </div>
  );
};

export default ReceiveEmails;
