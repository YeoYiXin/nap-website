"use client";
import React, { useState } from "react";
import Image from "next/image";
import UserProfile from "../../../../public/userProfile.png";
import { LuDot } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";

interface Props {
  workOrderId: string;
  title: string;
  submissionUser: string;
  timestamp: string;
  problemClass: string;
  subclass: string;
  location: string;
  priority: string;
  status: string;
  department: string;
  description: string;
  focused: boolean;
  onFocusChange: (workOrderId: string) => void;
  onClick: () => void;
}

const Template = ({
  workOrderId,
  title,
  submissionUser,
  timestamp,
  problemClass,
  subclass,
  location,
  priority,
  status,
  department,
  description,
  focused,
  onFocusChange,
  onClick,
}: Props) => {
  const [prio, setPrio] = useState(priority);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  const handleEmailClick = () => {
    onFocusChange(workOrderId); // Set this email to focus
    onClick();
  };

  const availableStatusOptions = ["Open", "In Progress", "Done"];

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setShowStatusOptions(false);
    // You can perform any other actions related to status change here
  };

  let dotColor = "";
  switch (prio.toLowerCase()) {
    case "high":
      dotColor = "text-red-500 text-3xl font-bold";
      break;
    case "medium":
      dotColor = "text-orange-500 text-3xl font-bold";
      break;
    case "low":
      dotColor = "text-yellow-500 text-3xl font-bold";
      break;
    default:
      dotColor = "text-gray-500 text-3xl font-bold";
  }

  return (
    <div
      className={` w-full border-b-2 border-gray-400 hover:bg-slate-400 hover:bg-opacity-10 ${
        focused
          ? "border-opacity-60 shadow-sm border-l-4 border-l-blue-700"
          : "border-opacity-30"
      }`}
      onClick={handleEmailClick}
    >
      <div className="grid grid-flow-col-dense grid-cols-7">
        <div className="col-span-1 flex items-center justify-center ">
          <div className="rounded-full overflow-hidden bg-slate-200">
            <Image
              src={UserProfile}
              width={40}
              height={40}
              alt="Default user image"
            />
          </div>
        </div>

        <div className="px-2 grid grid-flow-row-dense grid-rows-3 col-span-6">
          {/* title */}
          <div className="row-span-1 font-semibold">{title}</div>

          {/* requester and workorderid */}
          <div className="w-full grid grid-flow-col-dense grid-cols-4 row-span-1">
            <div className="col-span-3 text-md text-gray-500">
              <p className="">
                Requested by <span className="">{submissionUser}</span>
              </p>
            </div>
            <div className="col-span-1 ">
              <p className="text-gray-500">{workOrderId}</p>
            </div>
          </div>

          <div className="w-full grid grid-flow-col-dense grid-cols-4 row-span-1">
            <div className="col-span-3 text-md flex flex-row items-start gap-2">
              <p className="text-gray-500">{status}</p>
              <button onClick={() => setShowStatusOptions(!showStatusOptions)}>
                <IoChevronDownOutline className="text-blue-500 mt-1" />
              </button>
            </div>
            <div className="w-fit h-fit col-span-1 flex flex-row items-center justify-center ">
              <LuDot className={dotColor} />
              <p className="text-black font-bold">{priority}</p>
            </div>
            {showStatusOptions && (
            <div className="absolute mt-6 ml-4 bg-white rounded-sm border border-gray-300">
              {availableStatusOptions.map((option) => (
                <p
                  key={option}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                  onClick={() => handleStatusChange(option)}
                >
                  {option}
                </p>
              ))}
            </div>
          )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Template;
