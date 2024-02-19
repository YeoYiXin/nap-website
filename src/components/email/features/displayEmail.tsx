// displayEmail.jsx
"use client";
import React, { useState, useEffect } from "react";
import EditButton from "../buttons/display_email/edit";
import DeleteButton from "../buttons/display_email/deleteButton";
import InProgressButton from "../buttons/display_email/inProgressButton";
import DoneButton from "../buttons/display_email/done";
import { LuDot } from "react-icons/lu";
import "./scrollbar.css";

interface Props {
  selectedEmail: {
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
  } | null;
}

const DisplayEmail = ({ selectedEmail }: Props) => {
  const [stat, setStat] = useState<string | null>(null);

  const [prio, setPrio] = useState<string | null>(null);

  //   const [assigned, setAssigned] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEmail) {
      setStat(selectedEmail.status);
    }
  }, [selectedEmail]);

  useEffect(() => {
    if (selectedEmail) {
      setPrio(selectedEmail.priority);
    }
  }, [selectedEmail]);

  //   useEffect(() => {
  //     if (selectedEmail) {
  //       setAssigned(selectedEmail.department);
  //     }
  //   }, [selectedEmail]);

  const handleStatusClick = (status: string) => {
    setStat(status);
  };

  let dotColor = "";
  if (prio) {
    switch (prio.toLowerCase()) {
      case "high":
        dotColor = "text-red-500 text-3xl font-bold pb-1";
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
  }

  return (
    <div className="w-[850px] h-full border-2 border-gray-400 border-opacity-30 rounded-sm flex flex-col flex-grow">
      <div className="flex flex-row h-[10%] items-center px-3 border-b-2 border-b-gray-400 border-opacity-30">
        {selectedEmail && (
          <>
            <div className="flex-1">
              <h2 className="font-bold text-lg">{selectedEmail.title}</h2>
            </div>
            <div className="flex-1 flex flex-row-reverse gap-5 pr-5">
              {/* edit (problem summarisation) */}

              <div className="">
                <DeleteButton />
              </div>
              <div className="">
                <EditButton />
              </div>
            </div>
          </>
        )}
      </div>
      {selectedEmail && (
        <>
          <div className="flex flex-col h-[90%] overflow-y-auto scrollbar-thumb-rounded-full scrollbar scrollbar-thumb-slate-700  ">
            <div className="flex flex-col h-[35%] border-b-2 border-b-gray-400 border-opacity-30 mb-2">
              <div className="mt-2 flex-1 flex flex-col flex-grow px-5 gap-3">
                <div>
                  <p className="mt-1 font-bold">
                    Status{" "}
                    <span className="text-gray-400 font-normal">
                      {"("}Click to Update{")"}
                    </span>
                  </p>
                </div>
                <div className="grid grid-flow-col-dense grid-cols-8">
                  <div className="col-span-7 flex flex-row flex-grow gap-2">
                    {/* open, in progress, done */}

                    <InProgressButton
                      clicked={() => handleStatusClick("In Progress")}
                      isSelected={stat === "In Progress"}
                    />

                    <DoneButton
                      clicked={() => handleStatusClick("Done")}
                      isSelected={stat === "Done"}
                    />
                  </div>

                  <div className="">Copy Link</div>
                </div>
              </div>
              <div className="grid grid-flow-col-dense grid-cols-4 mb-2">
                {/*class, subclass, priority, workId */}

                <div className=" col-span-1 flex flex-col items-start justify-center">
                  <div className="px-5">
                    <p className="font-bold">Class</p>
                  </div>
                  <div className="px-5 flex flex-row items-start justify-center">
                    {selectedEmail.problemClass}
                  </div>
                </div>

                <div className=" col-span-1 flex flex-col items-start justify-center">
                  <div className="px-5">
                    <p className="font-bold">Problem</p>
                  </div>
                  <div className="px-5 flex flex-row items-start justify-center">
                    {selectedEmail.subclass}
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-start justify-center">
                  <div className="px-5">
                    <p className="font-bold">Priority</p>
                  </div>
                  <div className="px-2 flex flex-row items-start justify-center">
                    <LuDot className={dotColor} />
                    {selectedEmail.priority}
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-start justify-center">
                  <div className="px-5">
                    <p className="font-bold">Work Order ID</p>
                  </div>
                  <div className="px-5 flex flex-row items-start justify-center">
                    {selectedEmail.workOrderId}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row h-[15%] px-5 gap-3 items-center justify-start">
              <div className="flex flex-row">
                <div>
                  <p className="font-bold">Assigned To{": "}</p>
                </div>
                <div className="px-5 flex flex-row items-start justify-center">
                  {selectedEmail.department.toLowerCase() === "not assigned" ? (
                    <span className="px-2 bg-red-500">
                      {selectedEmail.department}
                    </span>
                  ) : (
                    <span>{selectedEmail.department}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-row">
                <div>
                  <p className="font-bold">Submitted By{": "}</p>
                </div>
                <div className="px-5 flex flex-row items-start justify-center">
                  {selectedEmail.submissionUser}
                </div>
              </div>
              <div className="flex flex-row">
                <div>
                  <p className="font-bold">Time{": "}</p>
                </div>
                <div className="px-5 flex flex-row items-start justify-center">
                  {selectedEmail.timestamp}
                </div>
              </div>
            </div>

            <div className="flex flex-col h-[50%] px-5 gap-3">
              <div className="flex flex-col">
                <div>
                  <p className="font-bold">Description</p>
                </div>
                <div>{selectedEmail.description}</div>
              </div>

              <div className="flex flex-row gap-2">
                <div className="flex-1 flex flex-col border-r-2 border-gray-400 border-opacity-30">
                  <div>
                    <p className="font-bold">Problem Image</p>
                  </div>
                  <div>{"--"}Problem Image</div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div>
                    <p className="font-bold">
                      Solved - activate approval status, if approved, then done
                    </p>
                  </div>
                  <div>{"--"}Solved Image</div>
                </div>
              </div>

              <div className="flex flex-col">
                <div>
                  <p className="font-bold">Location</p>
                </div>
                <div>{selectedEmail.location}</div>
                <div>{"--"}Location Image</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayEmail;
