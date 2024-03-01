"use client";
import React, { useState } from "react";
import SearchBox from "./features/searchBox";
import AssignedToButton from "./buttons/assignedTo";
import PriorityButton from "./buttons/priority";
import ProblemClassButton from "./buttons/problemClass";
import StatusButton from "./buttons/status";
import LocationButton from "./buttons/location";
import ReceiveEmails from "./features/receiveEmails";
import DisplayEmail from "./features/displayEmail";

interface FirestoreEmail {
  date: string;
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
}

const mainEmail = () => {
  const [selectedEmail, setSelectedEmail] =
    useState<FirestoreEmail | null>(null);

  const handleEmailClick = (email: FirestoreEmail) => {
    setSelectedEmail(email);
  };
  return (
    <div className=" flex flex-col flex-grow h-screen">
      <div className="flex flex-col h-[10%]">
        {/* the first two lines */}
        <div className="grid grid-flow-row-dense grid-cols-2">
          {/* Work orders row */}
          <div className="row-span-1 flex flex-row">
            {/* for work orders */}
            <h1 className="ml-2 mt-2 font-bold text-xl">Work Orders</h1>
          </div>
          <div className="row-span-1 flex flex-row-reverse gap-2  pr-5 pt-2">
            <div>
              <SearchBox />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4  py-2 mb-1 px-2">
          {/* Made them into functional filter buttons - in button files*/}
          <div>
            <AssignedToButton />
          </div>
          <div>
            <PriorityButton />
          </div>
          <div>
            <ProblemClassButton />
          </div>
          <div>
            <StatusButton />
          </div>
          <div>
            <LocationButton />
          </div>
        </div>
      </div>

      {/* email part */}
      <div className="pl-5 pt-3 h-[90%] flex flex-row flex-grow gap-5 ">
        <div>
          <ReceiveEmails onEmailClick={handleEmailClick} />
        </div>
        <div>
          <DisplayEmail selectedEmail={selectedEmail} />
        </div>
      </div>
    </div>
  );
};

export default mainEmail;
