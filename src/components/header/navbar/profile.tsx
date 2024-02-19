import React from "react";
import Image from "next/image";
import UserProfile from "../../../../public/userProfile.png";
// import "../../../styles/navStyle.css";
const profile = () => {
  return (
    <div className="mt-5 ml-3 flex flex-row items-center">
      {/* User profile */}
      <div className="rounded-full overflow-hidden bg-slate-200">
        <Image
          src={UserProfile}
          width={40}
          height={40}
          alt="Default user image"
        />
      </div>

      <div className="ml-2 text-white text-sm">
        {/* Hello, username */}
       <p className="font-bold">username</p>
      </div>
    </div>
  );
};

export default profile;
