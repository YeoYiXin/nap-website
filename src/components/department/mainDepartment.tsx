import React, { useEffect, useState } from 'react';
import accommodation from './teamIcons/home.png';
import aircon from './teamIcons/air-conditioner.png';
import plumbing from './teamIcons/faucet.png';
import civil from './teamIcons/tool.png';
import electrical from './teamIcons/generator.png';
import landscape from './teamIcons/mountain.png';
import furniture from './teamIcons/workspace.png';
import cleaning from './teamIcons/household.png';
import Image, { StaticImageData } from 'next/image';
import { db } from "../../firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";

interface Team {
  depName: string;
  depMembers: number;
  depEmail: string;
  depTask: string;
  imagePath: StaticImageData;
}

// Mapping department names to static images
const imageMap: { [key: string]: StaticImageData } = {
  'Accommodation': accommodation,
  'Air-Con Team': aircon,
  'Plumbing Team': plumbing,
  'Civil Team': civil,
  'Mechanical and Electrical Team': electrical,
  'Landscape Team': landscape,
  'Furniture Team': furniture,
  'Cleaning Team': cleaning,
  // Add more mappings if needed
};

const mainDepartment: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, 'departments');
      const teamSnapshot = await getDocs(teamsCollection);
      const teamsList = teamSnapshot.docs.map(doc => ({
        ...doc.data(),
        imagePath: imageMap[doc.data().depName], // Assign the corresponding image from the map
      })) as Team[];
      setTeams(teamsList);
    };

    fetchTeams();
  }, []);

  return (
    <div className="flex flex-col flex-grow h-screen p-4">
      <h1 className="font-bold text-4xl mb-4">Teams</h1>
      <div className="grid grid-cols-4 gap-4">
        {teams.map((team, index) => (
          <div key={index} className="shadow-lg rounded-lg flex flex-col items-center p-4 m-2" style={{ height: '380px' }}>
            <Image src={team.imagePath} alt={team.depName} width={120} height={120} className='m-6' />
            <h2 className="font-bold text-xl mt-2 text-center">{team.depName}</h2>
            <p className="text-center mb-4">{team.depEmail}</p>
            <p className="text-center"><strong>Members:</strong> {team.depMembers}</p>
            <p className="text-center"><strong>Tasks:</strong> {team.depTask}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default mainDepartment;