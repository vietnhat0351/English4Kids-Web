import React, { useEffect, useState } from 'react'
import customFetch from '../../../utils/customFetch';
import PieChart from './PieChart';
import { CircularProgress } from '@mui/material';
import LineChart from './LineChart';
import BarChart from './BarChart';

const DataAnalysis = () => {

  const [dataAnalysis, setDataAnalysis] = useState({})

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataAnalysis) {
      console.log(dataAnalysis.genderAnalysis);
      setLoading(false);
    }
  }, [dataAnalysis])

  useEffect(() => {
    customFetch.get("/api/v1/data-analysis/get-data")
      .then(res => {
        console.log(res.data);
        setDataAnalysis(res.data);
      })
      .catch(err => {
        console.log(err);
      })

  }, [])

  return (
    <div style={{
      padding: '20px',
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      gap: '20px',
      overflowY: 'hidden',
      overflowX: 'hidden',
    }}>
      <h1>Data</h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
      }}>
        {
          loading ? <CircularProgress color="success" /> : <PieChart genderData={dataAnalysis.genderAnalysis} />
        }
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        // height: '400px',
      }}>
        {/* <LineChart /> */}
        <BarChart />
      </div>
    </div>
  )
}

export default DataAnalysis
