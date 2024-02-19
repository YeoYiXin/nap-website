"use client";
import React, { useState } from "react";
import { LuDot } from "react-icons/lu";
import DummyEmail from "./dummyEmail";

interface Props {
  onEmailClick: (email: Email) => void;
}

interface Email {
  workOrderId: string;
  title: string;
  submissionUser: string;
  timestamp: string;
  problemClass: string;
  subclass: string;
  location: string;
  priority: string;
  status: string;
  department:string;
  description: string;
}

const ReceiveEmails = ({ onEmailClick }: Props) => {
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
        <p>Sort By: Priority: Highest First</p>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto">
        <DummyEmail onEmailClick={onEmailClick} />

        {/* Email section: {active} */}
      </div>
    </div>
  );
};

export default ReceiveEmails;
