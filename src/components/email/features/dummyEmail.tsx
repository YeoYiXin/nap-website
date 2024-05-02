// Written by Grp B
"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/clientApp";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

import Template from "./receiveTemplate";

interface Props {
  onEmailClick: (email: FirestoreEmail) => void;
  active: string;
  selectedDepartments: string[]; // Added selectedDepartments prop
  selectedProblemClasses: string[]; // Added selectedProblemClasses prop
  selectedLocations: string[]; // Added selectedLocations prop
  selectedPriorities: string; // Added selectedPriorities prop
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

const dummyEmail = ({
  onEmailClick,
  active,
  selectedDepartments,
  selectedProblemClasses,
  selectedLocations,
  selectedPriorities,
}: // clickedEmails,
Props) => {
  const [focusedEmail, setFocusedEmail] = useState<string | null>(null);

  const [emails, setEmails] = useState<FirestoreEmail[]>([]);

  useEffect(() => {
    const emails = onSnapshot(collection(db, "problemsRecord"), (snapshot) => {
      const emailsData: FirestoreEmail[] = [];
      snapshot.forEach((doc) => {
        emailsData.push(doc.data() as FirestoreEmail);
      });
      setEmails(emailsData);
    });

    // Clean up function to unsubscribe from the snapshot listener
    return () => emails();
  }, []);

  const handleFocusChange = (workOrderId: string) => {
    // Function to handle focus change
    setFocusedEmail(workOrderId);
  };

  const [clickedEmails, setClickedEmails] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const clickedEmails = localStorage.getItem("clickedEmails");
    if (clickedEmails) {
      setClickedEmails(JSON.parse(clickedEmails));
    }
  }, []);

  const handleEmailClick = (email: FirestoreEmail) => {
    console.log("Email clicked:", email.problemId);

    if (!clickedEmails[email.problemId]) {
      console.log("Updating clickedEmails state and localStorage");

      // Update clicked emails state and store it in localStorage
      const updatedClickedEmails = {
        ...clickedEmails,
        [email.problemId]: true,
      };
      localStorage.setItem(
        "clickedEmails",
        JSON.stringify(updatedClickedEmails)
      );
      onEmailClick(email);
    } else {
      console.log("Email already clicked:", email.problemId);

      // Email has already been clicked, set it back to false in the state and localStorage
      const updatedClickedEmails = {
        ...clickedEmails,
        [email.problemId]: false,
      };
      localStorage.setItem(
        "clickedEmails",
        JSON.stringify(updatedClickedEmails)
      );
      setClickedEmails(updatedClickedEmails);
    }
  };

  // return integer
  const parseWorkOrderId = (id: string) => {
    // Assuming the ID format is `#WA-<number>`
    const matches = id.match(/#WA-(\d+)/);
    return matches ? parseInt(matches[1], 10) : 0;
  };

  return (
    <div className="py-2 cursor-pointer">
      {emails
        .filter((email) => {
          if (selectedDepartments.length === 0) {
            // If no department is selected, display emails from all departments
            return true;
          } else {
            // Display emails that match with selected departments
            return selectedDepartments.includes(email.problemDepartment);
          }
        })
        .filter((email) => {
          if (selectedProblemClasses.length === 0) {
            // If no problem class is selected, display emails from all problem classes
            return true;
          } else {
            // Display emails that match with selected problem classes
            return selectedProblemClasses.includes(email.problemClass);
          }
        })
        .filter((email) => {
          if (selectedLocations.length === 0) {
            // If no location is selected, display emails from all locations
            return true;
          } else {
            return selectedLocations.includes(email.problemLocation);
          }
        })
        .filter((email) => {
          if (selectedPriorities === "") {
            // If no priority is selected, display emails from all priorities
            return true;
          } else {
            return selectedPriorities === email.problemPriority;
          }
        })
        .filter((email) =>
          active === "To do"
            ? email.problemStatus === "In Progress"
            : email.problemStatus === "Done"
        )
        .sort(
          (a, b) =>
            parseWorkOrderId(b.problemId) - parseWorkOrderId(a.problemId)
        ) // Sorting in descending order
        .map((email) => {
          const isClicked = clickedEmails[email.problemId];
          const previousEmailContent = localStorage.getItem(email.problemId);
          const isNewContent =
            previousEmailContent &&
            previousEmailContent !== JSON.stringify(email);
          return (
            <div
              key={email.problemId}
              className={`email ${
                isClicked ? "bg-yellow-100 bg-opacity-50" : ""
              } ${isNewContent ? "bg-yellow-100 bg-opacity-50" : ""}`}
              onClick={() => handleEmailClick(email)}
            >
              <Template
                key={email.problemId}
                {...email}
                focused={focusedEmail === email.problemId}
                onFocusChange={handleFocusChange}
                onClick={() => onEmailClick(email)}
              />
            </div>
          );
        })}
    </div>
  );
};

export default dummyEmail;
