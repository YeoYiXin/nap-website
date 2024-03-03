"use client";
import React, { useEffect, useState } from "react";
// import SearchBox from "./features/searchBox";
import AssignedToButton from "./buttons/assignedTo";
import PriorityButton from "./buttons/priority";
import ProblemClassButton from "./buttons/problemClass";
import LocationButton from "./buttons/location";
import ReceiveEmails from "./features/receiveEmails";
import DisplayEmail from "./features/displayEmail";
import { db } from "@/firebase/clientApp";

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
  const [selectedEmail, setSelectedEmail] = useState<FirestoreEmail | null>(
    null
  );
  const [openDropdown, setOpenDropdown] = useState<String | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedProblemClasses, setSelectedProblemClasses] = useState<
    string[]
  >([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string>("");
  // Define state to track clicked emails
  //  // Fetch clicked emails data from localStorage when component mounts
  //  useEffect(() => {
  //   const localStorageClickedEmails = localStorage.getItem('clickedEmails');
  //   if (localStorageClickedEmails) {
  //     const clickedEmailsData = JSON.parse(localStorageClickedEmails);
  //     // Here you can set the state or perform any other necessary actions with the clicked emails data
  //   }
  // }, []);
  // const [clickedEmails, setClickedEmails] = useState<Record<string, boolean>>(
  //   {}
  // );

  // useEffect(() => {
  //   // Fetch clicked emails data from localStorage when component mounts
  //   const localStorageClickedEmails = localStorage.getItem("clickedEmails");
  //   if (localStorageClickedEmails) {
  //     setClickedEmails(JSON.parse(localStorageClickedEmails));
  //   }
  // }, []);

  // Define departmentOptions here
  const departmentOptions = [
    { name: "Accommodation Team", id: "Accommodation Team" },
    { name: "Air-Conditioner Team", id: "Air-Conditioner Team" },
    { name: "Civil Team", id: "Civil Team" },
    { name: "Cleaning Team", id: "Cleaning Team" },
    { name: "Furniture Team", id: "Furniture Team" },
    { name: "Landscape Team", id: "Landscape Team" },
    {
      name: "Mechanical and Electrical Team",
      id: "Mechanical and Electrical Team",
    },
    { name: "Plumbing Team", id: "Plumbing Team" },
    { name: "Security Team", id: "Security Team" },
  ];

  //Define locationOptions here
  const locationOptions = [
    { name: "Block A; Trent Building", id: "Block A; Trent Building" },
    {
      name: "Block B and B1; Faculty of Science and Engineering",
      id: "Block B and B1; Faculty of Science and Engineering",
    },
    {
      name: "Block C and C1; Faculty of Science and Engineering",
      id: "Block C and C1; Faculty of Science and Engineering",
    },
    {
      name: "Block D; Faculty of Engineering",
      id: "Block D; Faculty of Engineering",
    },
    {
      name: "Block E; Faculty of Arts and Social Sciences",
      id: "Block E; Faculty of Arts and Social Sciences",
    },
    {
      name: "Block F1; Central Teaching 1",
      id: "Block F1; Central Teaching 1",
    },
    {
      name: "Block F2; Information Services - IT Support",
      id: "Block F2; Information Services - IT Support",
    },
    {
      name: "Block F3; Central Teaching 2",
      id: "Block F3; Central Teaching 2",
    },
    {
      name: "Block F4; Central Teaching 3",
      id: "Block F4; Central Teaching 3",
    },
    { name: "Block G; Library", id: "Block G; Library" },
    {
      name: "Block H; Student Association",
      id: "Block H; Student Association",
    },
    { name: "Block I1; Tioman Hall", id: "Block I1; Tioman Hall" },
    { name: "Block I2; Langkawi Hall", id: "Block I2; Langkawi Hall" },
    { name: "Block I3; Redang Hall", id: "Block I3; Redang Hall" },
    { name: "Block I4; Pangkor Hall", id: "Block I4; Pangkor Hall" },
    { name: "Block I5; Kapas Hall", id: "Block I5; Kapas Hall" },
    { name: "Block J1; Sipadan Hall", id: "Block J1; Sipadan Hall" },
    { name: "Block J2; Mabul Hall", id: "Block J2; Mabul Hall" },
    { name: "Block J3; Lankayan Hall", id: "Block J3; Lankayan Hall" },
    { name: "Block J4; Rawa Hall", id: "Block J4; Rawa Hall" },
    { name: "Block J5; Gemia Hall", id: "Block J5; Gemia Hall" },
    { name: "Block J6; Perhentian Hall", id: "Block J6; Perhentian Hall" },
    { name: "Block SH 1; Nexus", id: "Block SH 1; Nexus" },
    { name: "Block SH 2; Radius", id: "Block SH 2; Radius" },
    { name: "Block K; Sports Complex", id: "Block K; Sports Complex" },
    { name: "Block L1; Warden House", id: "Block L1; Warden House" },
    {
      name: "Block L2; Warden House (Tioman Lodge)",
      id: "Block L2; Warden House (Tioman Lodge)",
    },
    {
      name: "Block L3; Warden House (Langkawi Lodge)",
      id: "Block L3; Warden House (Langkawi Lodge)",
    },
    {
      name: "Block L4; HR Office (Redang Lodge)",
      id: "Block L4; HR Office (Redang Lodge)",
    },
    {
      name: "Block VH 1; Visitor House 1 (Pedu)",
      id: "Block VH 1; Visitor House 1 (Pedu)",
    },
    {
      name: "Block VH 2; Visitor House 2 (Titiwangsa)",
      id: "Block VH 2; Visitor House 2 (Titiwangsa)",
    },
    {
      name: "Block VH 3; Visitor House 3 (Chini)",
      id: "Block VH 3; Visitor House 3 (Chini)",
    },
    {
      name: "Block VH 4; Visitor House 4 (Kenyir)",
      id: "Block VH 4; Visitor House 4 (Kenyir)",
    },
    { name: "Block M; Islamic Centre", id: "Block M; Islamic Centre" },
    {
      name: "Block N; Engineering Research Building",
      id: "Block N; Engineering Research Building",
    },
    { name: "Engineering Mixing Lab", id: "Engineering Mixing Lab" },
    {
      name: "Creche; Taska, Childcare Centre",
      id: "Creche; Taska, Childcare Centre",
    },
  ];

  // Define problemClassOptions here
  const problemClassOptions = [
    { name: "Electrical", id: "Electrical" },
    { name: "Furniture", id: "Furniture" },
    { name: "Outdoor", id: "Outdoor" },
    { name: "Pests", id: "Pests" },
    { name: "Plumbing", id: "Plumbing" },
    { name: "Room Damage", id: "Room Damage" },
  ];

  //Define priorityOptions here
  const priorityOptions = [
    { name: "Low", id: "Low" },
    { name: "Medium", id: "Medium" },
    { name: "High", id: "High" },
  ];

  const handleEmailClick = (email: FirestoreEmail) => {
    // Update clicked emails state and store it in localStorage
    // const clickedEmailsData = localStorage.getItem('clickedEmails');
    // const updatedClickedEmails = clickedEmailsData ? JSON.parse(clickedEmailsData) : {};
    // updatedClickedEmails[email.problemId] = true;
    // localStorage.setItem('clickedEmails', JSON.stringify(updatedClickedEmails));

    // if (!clickedEmails[email.problemId]) {
    //   // Update clicked emails state and store it in localStorage
    //   const updatedClickedEmails = {
    //     ...clickedEmails,
    //     [email.problemId]: true,
    //   };
    //   console.log("Main email updatedClickedEmails:", updatedClickedEmails);
    //   setClickedEmails(updatedClickedEmails);
    //   localStorage.setItem(
    //     "clickedEmails",
    //     JSON.stringify(updatedClickedEmails)
    //   );
    // }
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
          {/* <div className="row-span-1 flex flex-row-reverse gap-2  pr-5 pt-2">
            <div>
              <SearchBox />
            </div>
          </div> */}
        </div>
        <div className="flex flex-row gap-4  py-2 mb-1 px-2">
          {/* Made them into functional filter buttons - in button files*/}
          <div className="">
            <AssignedToButton
              onClick={() => setOpenDropdown("assignedTo")}
              isOpen={openDropdown === "assignedTo"}
              onClose={() => setOpenDropdown(null)}
              setSelectedDepartments={setSelectedDepartments}
              selectedDepartments={selectedDepartments}
              departmentOptions={departmentOptions}
            />
          </div>
          <div>
            <PriorityButton
              onClick={() => setOpenDropdown("priority")}
              isOpen={openDropdown === "priority"}
              onClose={() => setOpenDropdown(null)}
              setSelectedPriority={setSelectedPriorities}
              selectedPriority={selectedPriorities}
              priorityOptions={priorityOptions}
            />
          </div>
          <div>
            <ProblemClassButton
              onClick={() => setOpenDropdown("class")}
              isOpen={openDropdown === "class"}
              onClose={() => setOpenDropdown(null)}
              setSelectedProblemClasses={setSelectedProblemClasses}
              selectedProblemClasses={selectedProblemClasses}
              problemClassOptions={problemClassOptions}
            />
          </div>
          <div>
            <LocationButton
              onClick={() => setOpenDropdown("location")}
              isOpen={openDropdown === "location"}
              onClose={() => setOpenDropdown(null)}
              setSelectedLocations={setSelectedLocations}
              selectedLocations={selectedLocations}
              locationOptions={locationOptions}
            />
          </div>
        </div>
      </div>

      {/* email part */}
      <div className="pl-5 pt-3 h-[90%] flex flex-row flex-grow gap-5 ">
        <div>
          <ReceiveEmails
            onEmailClick={handleEmailClick} // Pass the function to handle email click event
            selectedDepartments={selectedDepartments} // Pass selected departments
            selectedProblemClasses={selectedProblemClasses} // Pass selected problem classes
            selectedLocations={selectedLocations} // Pass selected locations
            selectedPriorities={selectedPriorities} // Pass selected priorities
            // clickedEmails={clickedEmails} // Pass clicked emails state
          />
        </div>
        <div>
          <DisplayEmail selectedEmail={selectedEmail} />
        </div>
      </div>
    </div>
  );
};

export default mainEmail;
