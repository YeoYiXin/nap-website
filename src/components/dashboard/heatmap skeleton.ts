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

const firebaseConfig = { /* Firebase config */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define your data types
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

    await fetchHeatmapData();


    fetchData();
  }, []);
  
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
    </div>
  );
}

export default MainDashboard;
