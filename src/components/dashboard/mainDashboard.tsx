import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { isPointInPolygon } from 'geolib';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { areaPolygons } from './location';
import HeatMap from 'react-heatmap-grid';
import './MainDashboard.css';

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

const MainDashboard: React.FC = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [priorityData, setPriorityData] = useState<StatusData[]>([]);
  const [indoorOutdoorData, setIndoorOutdoorData] = useState<StatusData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [gridData, setGridData] = useState<number[][]>([]);
  const [transformedHeatmapData, setTransformedHeatmapData] = useState<any[]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; } | null>(null);

// Define cellStyle function here
const cellStyle = (value: number | null) => {
  // Assume a maximum value for scaling the dot size
  const maxValue = 10; // You should adjust this to your actual max value
  const size = value ? Math.sqrt(value / maxValue) * 20 : 10; // Scale the size of the dot

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ff4500', // Color for the dot
    borderRadius: '50%', // Make it round
    width: `${size}px`, // Width based on the value
    height: `${size}px`, // Height based on the value
    margin: 'auto' // Center the dot within the cell
  };
};

const cellRender = (x: number, y: number, value: number | null): JSX.Element | null => {
  if (value !== null && value > 0) { // Check for a non-null and positive value
    const style = cellStyle(value); // Get the dynamic style based on the value
    return (
      <div className="heatmap-cell-wrapper">
        {/* Apply the dynamic style */}
        <div className="heatmap-cell-dot" style={style} />
      </div>
    );
  }

  return null; // Render nothing if there is no value or value is 0
};




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

      const getHeatmapDataFromFirebase = async (): Promise<HeatmapPoint[]> => {
        const heatmapDataPoints: HeatmapPoint[] = [];
        const querySnapshot = await getDocs(collection(db, 'problemsRecord'));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const point: HeatmapPoint = { latitude: data.latitude, longitude: data.longitude, problemCount: 0 };

          for (const areaName in areaPolygons) {
            const polygon = areaPolygons[areaName].map(({ lat, lng }) => ({ latitude: lat, longitude: lng }));
            if (isPointInPolygon(point, polygon)) {
              heatmapDataPoints.push({ ...point, areaName });
              break;
            }
          }
        });
        return heatmapDataPoints;
      };

      const fetchHeatmapData = async () => {
        // Fetch and transform data from Firebase
        const fetchedHeatmapData = await getHeatmapDataFromFirebase();
      
        // Now increment the problemCount for each point
        fetchedHeatmapData.forEach((point) => {
          // This assumes every document represents a problem, and thus increments the problem count.
          point.problemCount += 1;
        });
      
        // Continue with the rest of your code
        setHeatmapData(fetchedHeatmapData);
        transformToGridData(fetchedHeatmapData);
      };
      
      fetchHeatmapData(); // Call the function here, outside itself
      
    

      const fetchUserCount = async () => {
        const userSnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(userSnapshot.size);
      };

      await fetchProblemsByDepartment();
      await fetchProblemsByClass();
      await fetchStatusDistribution();
      await fetchPriorityDistribution();
      await fetchIndoorOutdoorCounts();
      await fetchHeatmapData();
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


    const getHeatmapDataFromFirebase = async (): Promise<HeatmapPoint[]> => {
      const querySnapshot = await getDocs(collection(db, 'problemsRecord'));
      const heatmapDataPoints: HeatmapPoint[] = [];
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const point: HeatmapPoint = { latitude: data.latitude, longitude: data.longitude, problemCount: 0 };

        
        Object.entries(areaPolygons).forEach(([areaName, coordinates]) => {
          const polygon = coordinates.map(coord => ({ latitude: coord.lat, longitude: coord.lng }));
          if (isPointInPolygon(point, polygon)) {
            heatmapDataPoints.push({ ...point, areaName });
          }
        });
      });
  
      return heatmapDataPoints;
    };
  
    const transformToGridData = (heatmapData: HeatmapPoint[]) => {
      const MAX_COLUMNS = 10; 
      const countsMap = new Map<string, number>();
      
      
    
      heatmapData.forEach((point) => {
        if (point.areaName) {
          countsMap.set(point.areaName, (countsMap.get(point.areaName) || 0) + point.problemCount);
        }
      });
    
   
      const dataPoints = Array.from(countsMap, ([areaName, value]) => ({
        areaName, value
      }));
    
      
      let gridData: number[][] = [];
      let currentRow: number[] = [];
      dataPoints.forEach((point, index) => {
        currentRow.push(point.value);
        if ((index + 1) % MAX_COLUMNS === 0 || index === dataPoints.length - 1) {
          gridData.push(currentRow);
          currentRow = []; 
        }
      });
    
 
      const yLabels = ['']; 
      const xLabels = dataPoints.slice(0, MAX_COLUMNS).map(point => point.areaName); 
    
      setGridData(gridData);
      setXLabels(xLabels);
     
    };
    
    
    const [xLabels, setXLabels] = useState<string[]>([]);
    
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

        {/* Bar Chart for Number of Problems by Department*/}
        <div style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          gridColumn: '1 / span 2', // first column
          gridRow: '3', // start at second row and span 2 rows
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

       {/* HeatMap for problem Locations */}
       <div
        style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          gridColumn: '1 / span 2', 
          gridRow: '5 / span 3', 
        }}
        className='heatmap-container'
      >
        <h4 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
          Heatmap of Problem Locations
        </h4>
        {gridData.length > 0 ? (
          <HeatMap
            xLabels={xLabels}
            yLabels={['']}
            data={gridData}
            cellStyle={cellStyle}
            cellRender={cellRender}
          />
        ) : null}
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
