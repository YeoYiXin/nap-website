"use client";
import React, { useEffect, useState } from "react";
// import { clientApp, db } from "../../../firebase/clientApp";
import { db } from "../../../firebase/clientApp";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";

import Template from "./receiveTemplate";
import { error } from "console";
import { get } from "http";

interface Props {
  onEmailClick: (email: FirestoreEmail) => void;
}

// interface Email {
//   workOrderId: string;
//   title: string;
//   submissionUser: string;
//   timestamp: string;
//   problemClass: string;
//   subclass: string;
//   location: string;
//   priority: string;
//   status: string;
//   department: string;
//   description: string;
// }

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

const dummyEmail = ({ onEmailClick }: Props) => {
  const [focusedEmail, setFocusedEmail] = useState<string | null>(null);

  // Use clientApp.firestore() to access Firestore
  // const firestore = clientApp.firestore(); // Access Firestore using clientApp
  // const [emails, loadEmails, emailsError] = useCollection(
  //   collection(db, "problemsRecord"),
  //   {}
  // );
  // const docRef = collection(db, "problemsRecord");
  // const docSnap = await getDocs(docRef);
  // // const q = query(collection(db, "problemsRecord"), orderBy("date"));

  // if (docSnap.docs.length > 0) {
  //   docSnap.docs.forEach((doc) => {
  //     console.log("Document data:", doc.data());
  //   });
  // } else {
  //   console.log("No such document!");
  // }

  // const unsub = onSnapshot(
  //   collection(db, "problemsRecord"),
  //   (doc) => {
  //     console.log("Current data: ", doc.data());
  //   },
  //   (error) => {
  //     console.log("Error fetching data: ", error);
  //   }
  // );
  // unsub();

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

  // const dummyMail = [
  //   {
  //     workOrderId: "#WO-0001",
  //     title: "1Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  //   {
  //     workOrderId: "#WO-0002",
  //     title: "2Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  //   {
  //     workOrderId: "#WO-0003",
  //     title: "3Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  //   {
  //     workOrderId: "#WO-0004",
  //     title: "4Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  //   {
  //     workOrderId: "#WO-0005",
  //     title: "5Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  //   {
  //     workOrderId: "#WO-0006",
  //     title: "6Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  //   {
  //     workOrderId: "#WO-0007",
  //     title: "7Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  //   {
  //     workOrderId: "#WO-0008",
  //     title: "8Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  //   {
  //     workOrderId: "#WO-0009",
  //     title: "9Ants Infestation at BB06",
  //     submissionUser: "hfyce34",
  //     timestamp: "9:15am, 15 February 2024",
  //     problemClass: "Pest",
  //     subclass: "Ants",
  //     location: "BB06",
  //     priority: "High",
  //     status: "In Progress",
  //     department: "Not Assigned",
  //     description:
  //       "Ants infestation at BB06. Please help to resolve the issue as soon as possible. Thank you.",
  //   },
  // ];

  const handleFocusChange = (workOrderId: string) => {
    // Function to handle focus change
    setFocusedEmail(workOrderId);
  };

  return (
    <div className="py-2 cursor-pointer">
      {emails.map((email) => {
        return (
          <Template
            key={email.problemId}
            {...email}
            focused={focusedEmail === email.problemId} // Pass whether this email is focused
            onFocusChange={handleFocusChange} // Pass the function to handle focus change
            onClick={() => onEmailClick(email)}
          />
        );
      })}
    </div>
  );
};

export default dummyEmail;
