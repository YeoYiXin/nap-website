// Written by Grp B
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#82ca9d'];

const mockProblems = ['Snake', 'Broken Chair', 'Broken AC'];
const mockNumIssues = [2, 4, 5];

const PieChartProblems = () => {
  const data = mockProblems.map((problem, index) => ({
    name: problem,
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

export default PieChartProblems; 
