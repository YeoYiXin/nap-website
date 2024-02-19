"use client";
import React, {useState} from "react";
import Image from "next/image";
import Profile from "./profile"; //admin name and logo
import NavEmail from "./navEmail"; //email template
import NavDash from "./navDash"; //all the statistic
import NavDep from "./navDep"; //list of department
import NottsLogo from "../../../../public/nottsLogo.png";
import SignOutButton from "../button/signout";
// import "../../../styles/navStyle.css";
//main for navbar
//connect other navbar components
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
    <div className="left-0 w-[10rem] min-h-screen sticky shadow-[rgba(0,0,1,0.5)_1.5px_0px_5px_0px] bg-blue-500 bg-opacity-70">
      <div className="ml-3">
        <Image
          src={NottsLogo}
          alt="Notts Logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
      <div className="mb-5">
        <Profile />
      </div>
      <div className="flex flex-col flex-wrap text-white">
        {/*put admin name and logo*/}

        <NavEmail onClick={() => handleNavClick("email")} isActive={active === "email"} />
        <NavDash onClick={() => handleNavClick("dashboard")} isActive={active === "dashboard"} />
        <NavDep onClick={() => handleNavClick("department")} isActive={active === "department"}  />
        
      </div>
      <div className="flex items-center justify-center mt-20">
        <SignOutButton />
      </div>
    </div>
  );
};

export default navbar;
