import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, // Import LabelList
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  DocumentData
} from 'firebase/firestore';

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
  open: number;
  resolved: number;
}

interface StatusData {
  name: string;
  value: number;
}

// Main dashboard component
const MainDashboard: React.FC = () => {
  const [data, setData] = useState<DepartmentData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [priorityData, setPriorityData] = useState<StatusData[]>([]);
  const [indoorOutdoorData, setIndoorOutdoorData] = useState<StatusData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  

  useEffect(() => {
    const fetchData = async () => {
      // Fetch problems and group by department
      const fetchProblemsByDepartment = async () => {
        const problemsSnapshot = await getDocs(collection(db, 'problemsRecord'));
        const departmentCounts: Record<string, { open: number; resolved: number }> = {};

        problemsSnapshot.forEach((doc) => {
          const data = doc.data();
          const department = data.problemDepartment;
          const status = data.problemStatus;

          if (!departmentCounts[department]) {
            departmentCounts[department] = { open: 0, resolved: 0 };
          }

          if (status === 'Open') {
            departmentCounts[department].open += 1;
          } else if (status === 'Resolved') {
            departmentCounts[department].resolved += 1;
          }
        });

        const formattedData = Object.entries(departmentCounts).map(([name, counts]) => ({
          name,
          open: counts.open,
          resolved: counts.resolved,
        }));

        setData(formattedData);
      };

      fetchProblemsByDepartment();

      // Fetch status distribution
      const statusSnapshot = await getDocs(collection(db, 'problemsRecord'));
      const statusDistribution: { [key: string]: number } = {};

      statusSnapshot.forEach((doc) => {
        const status = doc.data().problemStatus as string;
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;
      });

      setStatusData(Object.entries(statusDistribution).map(([name, value]) => ({ name, value })));

      // Fetch the distribution of problem priority
      const fetchPriorityDistribution = async () => {
        const prioritySnapshot = await getDocs(collection(db, 'problemsRecord'));
        const priorityCounts: { [key: string]: number } = {
          Low: 0,
          Medium: 0,
          High: 0
        };

        prioritySnapshot.forEach((doc) => {
          const priority = doc.data().problemPriority as string;
          if (priority && priorityCounts.hasOwnProperty(priority)) {
            priorityCounts[priority]++;
          }
        });

        setPriorityData(Object.entries(priorityCounts).map(([name, value]) => ({ name, value })));
      };

      fetchPriorityDistribution();

      

      // Fetch the breakdown of indoor vs. outdoor problems
      const fetchIndoorOutdoorCounts = async () => {
        const problemsSnapshot = await getDocs(collection(db, 'problemsRecord'));

        let indoorCount = 0;
        let outdoorCount = 0;

        problemsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.pIndoorLocation && data.pIndoorLocation.trim() !== "") {
            indoorCount++;
          }
          if (data.pOutdoorLocation && data.pOutdoorLocation.trim() !== "") {
            outdoorCount++;
          }
        });

        setIndoorOutdoorData([
          { name: 'Indoor', value: indoorCount },
          { name: 'Outdoor', value: outdoorCount }
        ]);
      };

      fetchIndoorOutdoorCounts();

      // Fetch the total number of users
      const fetchUserCount = async () => {
        const userQuery = query(collection(db, 'users'));
        const userSnapshot = await getDocs(userQuery);
        setTotalUsers(userSnapshot.size); // Set the total number of users
      };

      fetchUserCount();
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
    <h1 style={{ textAlign: 'left', marginTop: '20px', fontSize: '36px', fontWeight: 'bold' }}>Dashboard</h1>
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
    <div style={{ /* styles for the chart container */ }}>
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
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

{/*
 <div style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        gridColumn: '1 / 2', // first column
        gridRow: '2 / 3', // second row
      }}>
        <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
          Number of Problems by Department
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
            <XAxis dataKey="name" tick={{ fill: '#6c757d' }} />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="open" fill="#007bff" name="Open Problems" />
            <Bar dataKey="resolved" fill="#28a745" name="Resolved Problems" />
          </BarChart>
        </ResponsiveContainer>
      </div>
*/}


      {/* Pie Chart for Problem Status */}
      <div style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        gridColumn: '2 / 3', // second column
        gridRow: '1 / 2', // first row
      }}>
        <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' , fontWeight: 'bold'}}>Problem Status Distribution</h4>
        <ResponsiveContainer width="100%" height={300} >
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Total User Count at the bottom right */}
      <div style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        gridColumn: '2', 
        gridRow: '2', 
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
