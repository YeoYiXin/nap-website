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
  

// This function transforms the fetched heatmap data for display.
const transformToHeatmapDisplayData = (fetchedHeatmapData: HeatmapPoint[]): HeatmapDisplayData[] => {
  const heatmapDisplayData: Record<string, HeatmapDisplayData> = {};

  // Iterate over the fetched heatmap data to group by areaName
  fetchedHeatmapData.forEach(point => {
    // If areaName is defined and it's a new area, initialize it in the heatmapDisplayData
    if (point.areaName && !heatmapDisplayData[point.areaName]) {
      heatmapDisplayData[point.areaName] = {
        areaName: point.areaName,
        problemCount: 0, // Initialize problemCount for this area
        latitude: point.latitude, // Assume the first point's latitude and longitude represent the area
        longitude: point.longitude
      };
    }

    // Aggregate the problemCount for each area
    if (point.areaName) {
      heatmapDisplayData[point.areaName].problemCount += point.problemCount;
    }
  });

  // Convert the heatmapDisplayData object into an array of values
  return Object.values(heatmapDisplayData);
};

const calculateSizeBasedOnValue = (value: number, maxValue: number): number => {
  const maxSize = 100; // Define the maximum size of your circles
  return (value / maxValue) * maxSize; // This gives you a size relative to the maximum value
};

const transformCoordinatesToPosition = (
  latitude: number,
  longitude: number,
  containerWidth: number,
  containerHeight: number
) => {
  // Placeholder: These should be your actual min and max latitude and longitude
  const minLat = -90;
  const maxLat = 90;
  const minLng = -180;
  const maxLng = 180;

  // Convert latitude and longitude to a percentage of the container dimensions
  const xPercent = ((longitude - minLng) / (maxLng - minLng)) * containerWidth;
  const yPercent = ((latitude - minLat) / (maxLat - minLat)) * containerHeight;

  return {
    left: `${xPercent}px`,
    top: `${yPercent}px`,
  };
};


const cellStyle = (problemCount: number, maxProblemCount: number): React.CSSProperties => {
  const maxSize = 50; // Maximum size of the circle
  const size = Math.max((problemCount / maxProblemCount) * maxSize, 10); // Calculate size, with a minimum size to ensure visibility

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ff4500', // Color of the circle
    borderRadius: '50%', // Make it round
    width: `${size}px`, // Set width based on the problemCount
    height: `${size}px`, // Ensure height is the same as width to maintain circle shape
    position: 'absolute' as 'absolute', // Absolute positioning within the heatmap
    transform: 'translate(-50%, -50%)', // Center the circle
    margin: 'auto'
  };
};

const containerWidth = document.querySelector('.heatmap')?.clientWidth || 0;
const containerHeight = document.querySelector('.heatmap')?.clientHeight || 0;


const renderHeatmap = (data: HeatmapDisplayData[]) => {
  // Find the maximum problem count for scaling
  const maxProblemCount = Math.max(...data.map(d => d.problemCount));

  return data.map(point => {
    const dotPosition = transformCoordinatesToPosition(point.latitude, point.longitude, containerWidth, containerHeight);
    const dotStyle = cellStyle(point.problemCount, maxProblemCount);

    // Define position for the label here, positioning it above the dot using the bottom property
    const labelStyle: React.CSSProperties = {
      position: 'absolute',
      left: dotPosition.left,
      bottom: `calc(100% - ${dotPosition.top} + 10px)`, // Adjust bottom position based on the top of the dot plus an offset
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      zIndex: 10,
      background: '#fff',
      padding: '2px 5px',
      borderRadius: '3px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      fontSize: '12px',
      color: '#333',
      textAlign: 'center',
      pointerEvents: 'none',
    };

    return (
      <>
        {/* The dot itself */}
        <div className="heatmap-point" style={dotStyle} />
        
        {/* The label, positioned absolutely in relation to the heatmap container */}
        <div className="heatmap-label" style={labelStyle}>
          {point.areaName} ({point.problemCount})
        </div>
      </>
    );
  });
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
      
        // Transform the data for heatmap display
        const displayData = transformToHeatmapDisplayData(fetchedHeatmapData);
      
        // Set the transformed data to state
        setTransformedHeatmapData(displayData);
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