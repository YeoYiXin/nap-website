"use client";
import React, { useState } from "react";

import Template from "./receiveTemplate";
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
  department: string;
  description: string;
}

const dummyEmail = ({ onEmailClick }: Props) => {
  const [focusedEmail, setFocusedEmail] = useState<string | null>(null);
  const dummyMail = [
    {
      workOrderId: "#WO-0001",
      title: "1Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      workOrderId: "#WO-0002",
      title: "2Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
    {
      workOrderId: "#WO-0003",
      title: "3Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
    {
      workOrderId: "#WO-0004",
      title: "4Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
    {
      workOrderId: "#WO-0005",
      title: "5Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
    {
      workOrderId: "#WO-0006",
      title: "6Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
    {
      workOrderId: "#WO-0007",
      title: "7Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
    {
      workOrderId: "#WO-0008",
      title: "8Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
    {
      workOrderId: "#WO-0009",
      title: "9Ants Infestation at BB06",
      submissionUser: "hfyce34",
      timestamp: "9:15am, 15 February 2024",
      problemClass: "Pest",
      subclass: "Ants",
      location: "BB06",
      priority: "High",
      status: "In Progress",
      department: "Not Assigned",
      description:
        "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
    },
  ];

  const handleFocusChange = (workOrderId: string) => {
    // Function to handle focus change
    setFocusedEmail(workOrderId);
  };

  return (
    <div className="py-2 cursor-pointer">
      {dummyMail.map((email) => {
        return (
          <Template
            key={email.workOrderId}
            {...email}
            focused={focusedEmail === email.workOrderId} // Pass whether this email is focused
            onFocusChange={handleFocusChange} // Pass the function to handle focus change
            onClick={() => onEmailClick(email)}
          />
        );
      })}
    </div>
  );
};

export default dummyEmail;
