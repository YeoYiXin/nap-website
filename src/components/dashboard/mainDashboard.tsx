import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from 'recharts';

// Define the types for your data
interface DataPoint {
  name: string;
  Reported: number;
  Completed: number;
}

interface StatusDataPoint {
  name: string;
  value: number;
}

const MainDashboard: React.FC = () => {
  // Sample data
  const problemsData: DataPoint[] = [
    { name: 'Week 1', Reported: 400, Completed: 240 },
    { name: 'Week 2', Reported: 300, Completed: 139 },
    { name: 'Week 3', Reported: 200, Completed: 980 },
    { name: 'Week 4', Reported: 278, Completed: 390 },
  ];

  const problemStatusData: StatusDataPoint[] = [
    { name: 'Open', value: 400 },
    { name: 'On Hold', value: 300 },
    { name: 'In Progress', value: 300 },
    { name: 'Completed', value: 200 },
  ];

  const problemPriorityData: StatusDataPoint[] = [
    { name: 'Low', value: 300 },
    { name: 'Medium', value: 300 },
    { name: 'High', value: 200 },
  ];

  const problemClasses = [
    { name: 'ROOM DAMAGE', value: 600 },
    { name: 'FURNITURE', value: 300 },
    { name: 'OUTDOOR', value: 300 },
    { name: 'PESTS', value: 200 },
    { name: 'PLUMBING', value: 100 },
    { name: 'ELECTRICAL', value: 150 },
  ];

  const teamProblemsData = [
    { team: 'Air Conditioning Team', problems: Math.floor(Math.random() * 500) },
    { team: 'Civil Engineering Team', problems: Math.floor(Math.random() * 500) },
    { team: 'Cleaning Team', problems: Math.floor(Math.random() * 500) },
    { team: 'Furniture Team', problems: Math.floor(Math.random() * 500) },
    { team: 'Landscape Team', problems: Math.floor(Math.random() * 500) },
    { team: 'Mechanical and Electrical Team', problems: Math.floor(Math.random() * 500) },
    { team: 'Plumbing Team', problems: Math.floor(Math.random() * 500) },
    { team: 'Security Team', problems: Math.floor(Math.random() * 500) },
  ];

  const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate total hours and average time
  const totalHours = problemsData.reduce((acc, cur) => acc + cur.Completed, 0);
  const averageTime = totalHours / problemsData.length;

  return (

    <div className="p-5">
      <h1 className="font-bold text-4xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      
        {/* Line Chart for Problems Reported vs Completed */}
        <div className="shadow-lg p-4 bg-white rounded-lg">
          {/* Title */}
          <h3 className="text-md font-semibold mb-3">Problems Reported vs Completed</h3>
          {/* Responsive Container for Line Chart */}
          <ResponsiveContainer width="100%" height={300}>
            {/* Line Chart */}
            <LineChart data={problemsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {/* X Axis */}
              <XAxis dataKey="name" />
              {/* Y Axis */}
              <YAxis />
              {/* Grid */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* Tooltip */}
              <Tooltip />
              {/* Legend */}
              <Legend />
              {/* Lines */}
              <Line type="monotone" dataKey="Reported" stroke="#8884d8" />
              <Line type="monotone" dataKey="Completed" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>

          {/* Numerical Values */}
          <div className="flex justify-center mt-4">
            {problemsData.map((entry, index) => (
              <div key={`value-${index}`} className="text-center mx-4">
                <span className="font-semibold">{entry.name}</span>:
                <div>Reported: {entry.Reported}</div>
                <div>Completed: {entry.Completed}</div>
              </div>
            ))}
          </div>
        </div>


          {/* Pie Chart for Problem Status */}
          <div className="shadow-lg p-4 bg-white rounded-lg">
            {/* Title */}
            <h3 className="text-md font-semibold mb-3">Problem Status</h3>
            
            {/* Responsive Container for Pie Chart */}
            <ResponsiveContainer width="100%" height={300}>
              {/* Pie Chart */}
              <PieChart>
                {/* Pie */}
                <Pie
                  data={problemStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {/* Customizing Pie Colors */}
                  {problemStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {/* Tooltip */}
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Numerical Values */}
            <div className="flex justify-center mt-4">
              {problemStatusData.map((entry, index) => (
                <div key={`value-${index}`} className="text-center mx-4">
                  <span className="font-semibold">{entry.name}:</span> {entry.value}
                </div>
              ))}
            </div>
          </div>

          {/* Donut Pie Chart for Problem Priority */}
          <div className="shadow-lg p-4 bg-white rounded-lg">
            {/* Title */}
            <h3 className="text-md font-semibold mb-3">Problem Priority</h3>

            {/* Responsive Container for Donut Pie Chart */}
            <ResponsiveContainer width="100%" height={300}>
              {/* Donut Pie Chart */}
              <PieChart>
                {/* Donut Pie */}
                <Pie
                  data={problemPriorityData.filter(entry => entry.name !== 'None')}
                  dataKey="value"
                  fill="#8884d8"
                  label={(entry) => entry.name}
                  innerRadius={60} // Adjust inner radius for the donut effect
                >
                  {/* Customizing Pie Colors */}
                  {problemPriorityData
                    .filter(entry => entry.name !== 'None')
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                {/* Tooltip */}
                <Tooltip />
                {/* Legend */}
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Numerical Values */}
            <div className="flex justify-center mt-4">
              {problemPriorityData
                .filter(entry => entry.name !== 'None')
                .map((entry, index) => (
                  <div key={`value-${index}`} className="text-center mx-4">
                    <span className="font-semibold">{entry.name}:</span> {entry.value}
                  </div>
                ))}
            </div>
          </div>

       {/* Bar Chart for Problem Frequency */}
        <div className="shadow-lg p-4 bg-white rounded-lg col-span-1 lg:col-span-2">
          <h3 className="text-md font-semibold mb-3">Frequency of Problem Priority</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={problemClasses}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            {problemClasses.map((entry, index) => (
              <div key={`value-${index}`} className="text-center mx-4">
                <span className="font-semibold">{entry.name}:</span> {entry.value}
              </div>
            ))}
          </div>
        </div> 

        {/*Line Chart for Time to Complete */}
        <div className="shadow-lg p-4 bg-white rounded-lg col-span-1 lg:col-span-1">
          <h3 className="text-md font-semibold mb-3">Time to Complete</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={problemsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Completed" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <div>Total Hours: {totalHours}</div>
            <div>Average Time: {averageTime.toFixed(2)} hours</div>
          </div>
        </div>


        {/* Bar Chart for Problem Frequency */}
        <div className="shadow-lg p-4 bg-white rounded-lg col-span-full">
          <h3 className="text-md font-semibold mb-3">Number of Problems by Team</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamProblemsData}>
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="problems" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            {teamProblemsData.map((entry, index) => (
              <div key={`value-${index}`} className="text-center mx-4">
                <span className="font-semibold">{entry.team}:</span> {entry.problems}
              </div>
            ))}
          </div>
        </div> 



      </div>
    </div>
  );
}

export default MainDashboard;
