"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import NavBar from "../components/header/navbar/navBar";
import Email from "../components/email/mainEmail";
import Department from "../components/department/mainDepartment";
import Dashboard from "../components/dashboard/mainDashboard";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState<string>("email");
  let focused = false;

  const handlePageClick = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <>
      <div className="bg-white flex min-h-screen" style={{ paddingLeft: '10rem' }}>
        <NavBar onSectionClick={handlePageClick} />

        {/* Main content - statistics first*/}

        {selectedPage.toLowerCase() === "email" && (
          <div className="w-full">
            <Email />
          </div>
        )}
        {selectedPage.toLowerCase() === "department" && (
          <div className="w-full">
            <Department />
          </div>
        )}
        {selectedPage.toLowerCase() === "dashboard" && (
          <div className="w-full">
            <Dashboard />
          </div>
        )}
      </div>
    </>
  );
}
