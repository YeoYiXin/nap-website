import React from 'react';
import accommodation from './teamIcons/home.png';
import aircon from './teamIcons/air-conditioner.png';
import plumbing from './teamIcons/faucet.png';
import civil from './teamIcons/tool.png';
import electrical from './teamIcons/generator.png';
import landscape from './teamIcons/mountain.png';
import furniture from './teamIcons/workspace.png';
import cleaning from './teamIcons/household.png';
import Image, { StaticImageData } from 'next/image';

interface Team {
  name: string;
  members: number;
  email: string;
  classes: string[];
  imagePath: StaticImageData;
}

const teams: Team[] = [
  {
    name: 'Accommodation',
    members: 3,
    email: 'accommodation@nottingham.edu.my',
    classes: ['Everything within Block I or J'],
    imagePath: accommodation,
  },
  {
    name: 'Air-Con Team',
    members: 6,
    email: 'aircon@nottingham.edu.my',
    classes: ['Air-con'],
    imagePath: aircon,
  },
  {
    name: 'Civil Team',
    members: 4,
    email: 'civil@nottingham.edu.my',
    classes: ['Wall Damage', 'Floor Damage', 'Ceiling Damage', 'Road Damage', 'Cabinet'],
    imagePath: civil,
  },
  {
    name: 'Cleaning Team',
    members: 7,
    email: 'cleaning@nottingham.edu.my',
    classes: ['Wasps', 'Ants'],
    imagePath: cleaning,
  },
  {
    name: 'Furniture Team',
    members: 4,
    email: 'furniture@nottingham.edu.my',
    classes: ['Chair', 'Table'],
    imagePath: furniture,
  },
  {
    name: 'Landscape Team',
    members: 5,
    email: 'landscape@nottingham.edu.my',
    classes: ['Exposed Trash', 'Overgrown Greenery'],
    imagePath: landscape,
  },
  {
    name: 'Mechanical and Electrical Team',
    members: 10,
    email: 'mechelec@nottingham.edu.my',
    classes: ['Light', 'Fan'],
    imagePath: electrical,
  },
  {
    name: 'Plumbing Team',
    members: 4,
    email: 'plumbing@nottingham.edu.my',
    classes: ['Toilet', 'Sink', 'Pipes'],
    imagePath: plumbing,
  },
  // ... more teams
];

const mainDepartment: React.FC = () => {
  return (
    <div className="flex flex-col flex-grow h-screen p-4">
      <h1 className="font-bold text-4xl mb-4">Teams</h1>
      <div className="grid grid-cols-4 gap-4">
        {teams.map((team, index) => (
          <div key={index} className="shadow-lg rounded-lg flex flex-col items-center p-4 m-2" style={{ height: '380px' }}> {/* Adjust height here */}
            <Image src={team.imagePath} alt={team.name} width={120} height={120} className='m-6' />
            <h2 className="font-bold text-xl mt-2 text-center">{team.name}</h2>
            <p className="text-center mb-4">{team.email}</p>
            <p className="text-center"><strong>Members:</strong> {team.members}</p>
            <p className="text-center"><strong>Classes:</strong> {team.classes.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default mainDepartment;