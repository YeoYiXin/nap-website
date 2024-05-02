// Written by Grp B
"use client";
import React, {useState} from "react";
import Image from "next/image";
import Profile from "./profile"; //admin name and logo
import NavEmail from "./navEmail"; //email template
import NavDash from "./navDash"; //all the statistic
import NavDep from "./navDep"; //list of department
import NottsLogo from "../../../../public/nottsLogo.png";
import SignOutButton from "../button/signout";

interface Props{
  onSectionClick: (section: string) => void;
}

const navbar = ({onSectionClick}:Props) => {
  const [active, setActive] = useState("email");

  const handleNavClick = (section: string) => {
    setActive(section);
    onSectionClick(section); // Notify parent component of the click
  };

  return (
    <div className="fixed top-0 left-0 w-[10rem] min-h-screen z-50 shadow-[rgba(0,0,1,0.5)_1.5px_0px_5px_0px] " style={{ backgroundColor: '#69B6FA' }}>
      {/* Center the logo with flexbox and add padding, setting the image to fill the width of its container */}
      <div className="flex flex-col items-center p-4 w-full"> 
        <Image
          src={NottsLogo}
          alt="Notts Logo"
          layout="responsive"
          width={100} // This value is now relative due to the responsive layout.
          height={100} // Maintains aspect ratio based on the width.
          objectFit="contain" // Ensures the image scales correctly within its container.
        />
      </div>
      <div className="mb-5">
        <Profile />
      </div>
      <div className="flex flex-col flex-wrap text-white">
        <NavEmail onClick={() => handleNavClick("email")} isActive={active === "email"} />
        <NavDash onClick={() => handleNavClick("dashboard")} isActive={active === "dashboard"} />
        <NavDep onClick={() => handleNavClick("department")} isActive={active === "department"} />
      </div>
      <div className="flex items-center justify-center mt-20">
        <SignOutButton />
      </div>
    </div>
  );
};

export default navbar;
