// Written by Grp B
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#82ca9d']; 

const mockLocations = ['Trent Building', 'Cafeteria', 'Radius', 'TCR', 'Library'];
const mockNumIssues = [2, 4, 5, 2, 1];

const PieChartLocations = () => {
  const data = mockLocations.map((location, index) => ({
    name: location,
    value: mockNumIssues[index] 
  }));

  return (
    <ResponsiveContainer width="100%" height={300}> 
      <PieChart>
        <Pie 
          data={data} 
          cx="50%" 
          cy="50%" 
          outerRadius={80} 
          fill="#8884d8" 
          dataKey="value"
          label={(entry) => `${entry.name}: ${entry.value}`}  
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartLocations;
