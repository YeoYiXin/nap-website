// displayEmail.jsx
"use client";
import React, { useState, useEffect } from "react";
import EditButton from "../buttons/display_email/edit";
import DeleteButton from "../buttons/display_email/deleteButton";
import InProgressButton from "../buttons/display_email/inProgressButton";
import DoneButton from "../buttons/display_email/done";
import { Location } from "./location";
import { LuDot } from "react-icons/lu";
import { db } from "../../../firebase/clientApp";
import "./scrollbar.css";
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

interface Props {
  selectedEmail: {
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
  } | null;
}

const DisplayEmail = ({ selectedEmail }: Props) => {
  const [selected, setSelected] = useState(selectedEmail);
  const [stat, setStat] = useState<string | null>(null);

  const [prio, setPrio] = useState<string | null>(null);

  const [submissionUserEmail, setSubmissionUserEmail] = useState<string | null>(
    null
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);

  const [editedEmail, setEditedEmail] = useState(
    selectedEmail ?? {
      date: Timestamp.now(),
      pIndoorLocation: "",
      problemClass: "",
      problemDepartment: "",
      problemDescription: "",
      problemId: "",
      problemImageURL: "",
      problemLocation: "",
      problemPriority: "",
      problemReportNum: 0,
      problemStatus: "",
      problemSubClass: "",
      problemTitle: "",
      uid: "",
      latitude: 0,
      longitude: 0,
    }
  );

  useEffect(() => {
    if (selectedEmail) {
      setStat(selectedEmail.problemStatus);
      setPrio(selectedEmail.problemPriority);

      // Fetch submission user's email
      fetchSubmissionUserEmail(selectedEmail.uid);
      // setEditedEmail(selectedEmail);
      setSelected(selectedEmail);
      setEditedEmail(selectedEmail);

      // Subscribe to changes on the Firestore document
      const emailDocRef = doc(db, "problemsRecord", selectedEmail.problemId);
      const unsubscribe = onSnapshot(emailDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log("hi reach here, ediiiiiiit");
          const updatedEmailData = docSnapshot.data() as {
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
          };
          setEditedEmail(updatedEmailData);
        } else {
          console.log("No such document!");
        }
      });

      // Unsubscribe from the snapshot listener when component unmounts
      return () => unsubscribe();
    }
  }, [selectedEmail]);

  const fetchSubmissionUserEmail = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // setSubmissionUserEmail(docSnap.data().email);

      const userData = docSnap.data();
      if (userData && userData.email) {
        const emailParts = userData.email.split("@");
        if (emailParts.length > 0) {
          setSubmissionUserEmail(emailParts[0]); // Get the part before the "@" symbol
        }
      }
    } else {
      console.log("No such document!");
    }
  };

  const handleDelete = async () => {
    if (selectedEmail) {
      try {
        const emailDocRef = doc(db, "problemsRecord", selectedEmail.problemId);
        await deleteDoc(emailDocRef);
        console.log("Email deleted successfully!");
      } catch (error) {
        console.error("Error deleting email: ", error);
      }
    }
    setShowDeleteConfirmation(false); // Hide the confirmation popup after deletion
  };

  // Function to update Firestore document
  const updateEmailInFirestore = async (
    updatedEmail: Props["selectedEmail"]
  ) => {
    if (selectedEmail && updatedEmail) {
      try {
        const emailDocRef = doc(db, "problemsRecord", selectedEmail.problemId);
        await updateDoc(emailDocRef, updatedEmail);
        console.log("Email updated successfully!");
        // Update state with edited email content

        setEditedEmail(updatedEmail);
        setSelected(updatedEmail);
        setShowEditForm(false); // Hide the edit form after submission
      } catch (error) {
        console.error("Error updating email: ", error);
      }
    }
  };

  // Event handler for "Save Changes" button click
  const handleEditSubmit = async () => {
    // Call updateEmailInFirestore function to update Firestore document
    const updatedEmail: Props["selectedEmail"] = { ...editedEmail }; // Annotate updatedEmail with the same type as editedEmail
    updateEmailInFirestore(updatedEmail);
  };

  useEffect(() => {
    if (selectedEmail) {
      setStat(selectedEmail.problemStatus);
    }
  }, [selectedEmail]);

  useEffect(() => {
    if (selectedEmail) {
      setPrio(selectedEmail.problemPriority);
    }
  }, [selectedEmail]);

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

  return (
    <div className="w-[850px] h-full border-2 border-gray-400 border-opacity-30 rounded-sm flex flex-col flex-grow">
      <div className="w-[850px] flex flex-row h-[10%] items-center px-3 border-b-2 border-b-gray-400 border-opacity-30">
        {selectedEmail && (
          <>
            <div className="flex-1">
              <h2 className="font-bold text-lg">
                {selectedEmail.problemTitle}
              </h2>
            </div>
            <div className="flex flex-row-reverse justify-end gap-5 pr-5">
              {/* edit (problem summarisation) */}

              <div className="">
                <DeleteButton onClick={() => setShowDeleteConfirmation(true)} />
              </div>
              <div className="">
                <EditButton onClick={() => setShowEditForm(true)} />
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
                    {/* <span className="text-gray-400 font-normal">
                      {"("}Click to Update{")"}
                    </span> */}
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
                </div>
              </div>
              <div className="grid grid-flow-col-dense grid-cols-4 mb-2">
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
                    {selectedEmail.problemSubClass}
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-start justify-center">
                  <div className="px-5">
                    <p className="font-bold">Priority</p>
                  </div>
                  <div className="px-2 flex flex-row items-start justify-center">
                    <LuDot className={dotColor} />

                    {selectedEmail.problemPriority}
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-start justify-center">
                  <div className="px-5">
                    <p className="font-bold">Work Order ID</p>
                  </div>
                  <div className="px-5 flex flex-row items-start justify-center">
                    {selectedEmail.problemId}
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
                  {selected?.problemDepartment.toLowerCase() ===
                  "not assigned" ? (
                    <span className="px-2 bg-red-500">
                      {selected?.problemDepartment}
                    </span>
                  ) : (
                    <span>{selected?.problemDepartment}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-row">
                <div>
                  <p className="font-bold">Submitted By{": "}</p>
                </div>
                <div className="px-5 flex flex-row items-start justify-center">
                  {submissionUserEmail}
                </div>
              </div>
              <div className="flex flex-row">
                <div>
                  <p className="font-bold">Time{": "}</p>
                </div>
                <div className="px-5 flex flex-row items-start justify-center">
                  {
                    selectedEmail.date instanceof Date // Check if it's already a Date object
                      ? selectedEmail.date.toLocaleString() // If so, format directly
                      : selectedEmail.date.toDate().toLocaleString() // If not, convert Timestamp to Date and format
                  }
                </div>
              </div>
            </div>

            <div className="flex flex-col h-[50%] px-5 gap-3">
              <div className="flex flex-col">
                <div>
                  <p className="font-bold">Description</p>
                </div>
                <div>{selected?.problemDescription}</div>
              </div>

              <div className="flex flex-row gap-2">
                <div className="flex-1 flex flex-col border-r-2 border-gray-400 border-opacity-30">
                  <div>
                    <p className="font-bold mb-3">Problem Image</p>
                  </div>
                  <div>
                    {selectedEmail.problemImageURL ? (
                      <img
                        src={selectedEmail.problemImageURL}
                        alt="Problem"
                        className="max-w-[80%] h-auto"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>{" "}
                  {/**display image */}
                </div>
                <div className="flex-1 flex flex-col">
                  <div>
                    <p className="font-bold">Solved</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div>
                  <p className="font-bold">Location</p>
                </div>
                <div className="mb-2">
                  {selectedEmail.pIndoorLocation},{" "}
                  {selectedEmail.problemLocation}
                </div>
                <div className="mb-4">
                  <Location
                    latitude={selectedEmail.latitude}
                    longitude={selectedEmail.longitude}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showDeleteConfirmation && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md border-2 border-blue-500 border-opacity-50">
          <p>Are you sure you want to delete this email?</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              className="mr-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              No
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {showEditForm && (
        <div className="fixed top-1/2 left-1/2 w-[40%] h-[55%] transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-blue-500 border-opacity-50 p-4 rounded shadow-md flex-flex-row gap-5">
          <div className="mb-4">
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              value={editedEmail?.problemDepartment || ""}
              onChange={(e) =>
                setEditedEmail((prevEditedEmail) => ({
                  ...prevEditedEmail,
                  problemDepartment: e.target.value,
                }))
              }
              className="mt-1 p-1 focus:ring-blue-500 focus:border-blue-500 block w-full max-h-[150px] overflow-auto shadow-sm sm:text-sm border-2 border-gray-500 rounded-md"
            >
              {departmentOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              value={editedEmail?.problemPriority || ""}
              onChange={(e) =>
                setEditedEmail((prevEditedEmail) => ({
                  ...prevEditedEmail,
                  problemPriority: e.target.value,
                }))
              }
              className="mt-1 p-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-[30px] shadow-sm sm:text-sm border-2 border-gray-500 rounded-md"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={editedEmail?.problemDescription || ""}
              onChange={(e) =>
                setEditedEmail((prevEditedEmail) => ({
                  ...prevEditedEmail,
                  problemDescription: e.target.value,
                }))
              }
              className="mt-1 p-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-[100px] shadow-sm sm:text-sm border-2 border-gray-500 rounded-md"
            />
          </div>
          <div className="justify-center flex flex-col-dense gap-5">
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
              onClick={handleEditSubmit}
            >
              Save Changes
            </button>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              onClick={() => setShowEditForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayEmail;
