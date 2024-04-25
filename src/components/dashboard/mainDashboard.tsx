import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line // Added LineChart and Line
} from 'recharts';
import { isPointInPolygon } from 'geolib';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { areaPolygons } from './location';
import HeatMap from 'react-heatmap-grid';
import './MainDashboard.css';
import PieChartLocations from './PieChartLocations';
import PieChartProblems from './PieChartProblem';

// Firebase config and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBK8yLJkRtukow-9xr60aaMUh7BWz4VNNM",
  authDomain: "nott-a-problem.firebaseapp.com",
  projectId: "nott-a-problem",
  storageBucket: "nott-a-problem.appspot.com",
  messagingSenderId: "935607970977",
  appId: "1:935607970977:web:70ed606a35eec5cc4a94e0",
  measurementId: "G-KFMPTTR8YY"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define your data types
interface DepartmentData {
  name: string;
  problemCount: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface PieLabel {
  name: string;
  percent: number;
}

interface HeatmapDisplayData {
  areaName: string;
  problemCount: number;
  latitude: number;
  longitude: number;
}


interface HeatmapPoint {
  latitude: number;
  longitude: number;
  areaName?: string;
  problemCount: number;
}

interface ClassData {
  name: string;
  count: number;
}

interface TransformedData {
  xLabel: string;
  yValue: number;
}

 // Mock data for issue reports over a period of a month
 const weeklyReportData = [
  { week: 'Week 1', issues: 10 },
  { week: 'Week 2', issues: 15 },
  { week: 'Week 3', issues: 20 },
  { week: 'Week 4', issues: 12 },
 
];


const MainDashboard: React.FC = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [priorityData, setPriorityData] = useState<StatusData[]>([]);
  const [indoorOutdoorData, setIndoorOutdoorData] = useState<StatusData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [classData, setClassData] = useState<ClassData[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      const fetchProblemsByDepartment = async () => {
        const departmentCounts: Record<string, number> = {};
        const problemsSnapshot = await getDocs(collection(db, 'problemsRecord'));
        problemsSnapshot.forEach((doc) => {
          const data = doc.data();
          const department = data.problemDepartment;
          departmentCounts[department] = (departmentCounts[department] || 0) + 1;
        });
        const formattedData: DepartmentData[] = Object.entries(departmentCounts).map(([name, problemCount]) => ({
          name,
          problemCount
        }));
        setDepartmentData(formattedData);
      };

      const fetchProblemsByClass = async () => {
        const classCounts: Record<string, number> = {};
        const problemsSnapshot = await getDocs(collection(db, 'problemsRecord'));
        problemsSnapshot.forEach((doc) => {
          const data = doc.data();
          const problemClass = data.problemClass;
          classCounts[problemClass] = (classCounts[problemClass] || 0) + 1;
        });
        const formattedClassData: ClassData[] = Object.entries(classCounts).map(([name, count]) => ({
          name,
          count
        }));
        setClassData(formattedClassData);
      };

      const fetchStatusDistribution = async () => {
        const statusDistribution: Record<string, number> = {};
        const statusSnapshot = await getDocs(collection(db, 'problemsRecord'));
        statusSnapshot.forEach((doc) => {
          const status = doc.data().problemStatus;
          statusDistribution[status] = (statusDistribution[status] || 0) + 1;
        });
        setStatusData(Object.entries(statusDistribution).map(([name, value]) => ({ name, value })));
      };

      const fetchPriorityDistribution = async () => {
        const priorityCounts: Record<string, number> = {};
        const prioritySnapshot = await getDocs(collection(db, 'problemsRecord'));
        prioritySnapshot.forEach((doc) => {
          const priority = doc.data().problemPriority;
          priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
        });
        setPriorityData(Object.entries(priorityCounts).map(([name, value]) => ({ name, value })));
      };

      const fetchIndoorOutdoorCounts = async () => {
        let indoorCount = 0;
        let outdoorCount = 0;
        const problemsSnapshot = await getDocs(collection(db, 'problemsRecord'));
        
        problemsSnapshot.forEach((doc) => {
          const data = doc.data();
          // Assuming 'pIndoorLocation' is a string and 'pOutdoor' is a boolean
          if (data.pIndoorLocation && !data.pOutdoor) {
            indoorCount++;
          } else {
            outdoorCount++;
          }
        });
      
        setIndoorOutdoorData([
          { name: 'Indoor', value: indoorCount },
          { name: 'Outdoor', value: outdoorCount }
        ]);
      };
 
      const fetchUserCount = async () => {
        const userSnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(userSnapshot.size);
      };

      await fetchProblemsByDepartment();
      await fetchProblemsByClass();
      await fetchStatusDistribution();
      await fetchPriorityDistribution();
      await fetchIndoorOutdoorCounts();
      await fetchUserCount();
    };

    fetchData();
  }, []);



      interface LabelProps {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        index: number;
      }
      
      // Chart colors and styles
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
      const RADIAN = Math.PI / 180;
    
      // Customized label for pie charts
    const renderCustomizedLabel = ({
      cx, cy, midAngle, innerRadius, outerRadius, percent, index
    }: LabelProps) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };
    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

   
    
    return (
      
      <div>
        <h1 className="font-bold text-3xl mb-1 ml-5">Dashboard</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gridTemplateRows: '1fr 1fr', 
          gap: '20px',
          margin: '0 auto',
          maxWidth: '100%', 
          padding: '20px',
          height: '100vh', 
        }}>
            {/* Bar Chart for Indoor vs Outdoor Problems */}
            <div style={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: '#fff',
              gridColumn: '1', // Align to the first column
              gridRow: '1', // Align to the first row
            }}>
              <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Indoor vs Outdoor Problems</h4>
              <ResponsiveContainer width="100%" height={300} >
                <BarChart data={indoorOutdoorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                  <XAxis dataKey="name" tick={{ fill: '#6c757d' }} />
                  <YAxis tick={{ fill: '#6c757d' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ffc107" name="Problems" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          

          {/* Pie Chart for Problem Priority */}
          <div style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          gridColumn: '1', // first column
          gridRow: '3', // start at second row and span 2 rows
        }}>
          <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' ,fontWeight: 'bold'}}>
            Problem Priority Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: PieLabel) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart for issue reports over a period of a month */}
        <div style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          gridColumn: '1 / span 2', // spans two columns
          gridRow: '6', // fifth row
        }}>
          <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
            Issue Reports Over a Period of a Month
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyReportData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="week" tick={{ fill: '#6c757d' }} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              {/* Line series */}
              <Line yAxisId="left" type="monotone" dataKey="issues" stroke="#ff7300" name="Weekly Issues Trend" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart for problem locations */}
        <div style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          gridColumn: '1', // spans two columns
          gridRow: '5', // fifth row
        }}><h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' ,fontWeight: 'bold'}}>
        Top 5 Problem Locations
         </h4>
        <PieChartLocations />
        </div>

          {/* Pie chart for problems */}
        <div style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        gridColumn: '2', // spans two columns
        gridRow: '5', // fifth row
        }}><h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' ,fontWeight: 'bold'}}>
        Top 5 Problems
         </h4>
        <PieChartProblems />
        </div>


        {/* Bar Chart for Number of Problems by Department*/}
        <div style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          gridColumn: '1 / span 2', // first column
          gridRow: '2', // start at second row and span 2 rows
        }}>
          <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
            Number of Problems by Department
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="name" tick={{ fill: '#6c757d' }} />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="problemCount" fill="#007bff" name="Total Problems" />
            </BarChart>
          </ResponsiveContainer>
      </div>

{/* Pie Chart for Problem Status */}
<div style={{
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: '#fff',
  gridColumn: '2 / 3', // second column
  gridRow: '1 / 2', // first row
}}>
  <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Problem Status Distribution</h4>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        dataKey="value"
        isAnimationActive={true}
        data={statusData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {statusData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      {/* Legend */}
      <Legend align="center" verticalAlign="bottom" iconSize={10} />
    </PieChart>
  </ResponsiveContainer>
</div>


      {/* Bar Chart for Number of Problems by Class */}
          <div style={{
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            gridColumn: '1 / span 2', // spans two columns
            gridRow: '4', // fourth row
          }}>
            <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
              Number of Problems by Class
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                <XAxis dataKey="name" tick={{ fill: '#6c757d' }} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="count" fill="#82ca9d" name="Number of Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>

      
          {/* Total User Count at the bottom right */}
          <div style={{
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            gridColumn: '2', 
            gridRow: '3', 
          }}>
            <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
              Total Users
            </h4>
            <p style={{ textAlign: 'center', color: '#333', fontSize: '100px', margin: '0' }}>
              {totalUsers}
            </p>
          </div>
        </div>
      </div>
    );


}

export default MainDashboard;