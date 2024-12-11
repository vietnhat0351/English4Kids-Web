import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import customFetch from "../../../utils/customFetch";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";

import BarCharCus from "./BarChartCus";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { setLessons } from "../../../redux/slices/lessonSlice";

// Register các thành phần cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Grammar = () => {
  const user = useSelector((state) => state.user.profile);
  const lessons = useSelector((state) => state.lessons);
  const dispatch = useDispatch();
  const [lessonID, setLessonID] = useState(1);

  const [chartData, setChartData] = useState(null);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
  const fetchDataLesson = async () => {
    try {
      const response = await customFetch.get(
        "/api/v1/lessons/get-all-for-user"
      );
      if (response.status === 200) {
        dispatch(setLessons(response.data.sort((a, b) => a.id - b.id)));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!user || !user.id) {
      console.error("User or User ID is missing");
      return; // Nếu không có user hoặc user.id, không thực hiện fetch data
    }
    if(lessons.length === 0){
      fetchDataLesson();
    }
    // Dữ liệu mẫu, thay thế bằng API thực tế của bạn
    const fetchData = async () => {
      const response = await customFetch.get(
        "/api/v1/lessons/get-point-seven-day/" + user.id
      );
      const jsonData = await response.data;

      const labels = jsonData.map((item) => formatDate(item.day)); // Ví dụ: ["2024-12-02", "2024-12-03", ...]
      const scores = jsonData.map((item) => item.total_score); // Tổng điểm: [10, 20, ...]

      setChartData({
        labels,
        datasets: [
          {
            label: "Total Score by Day",
            data: scores,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });
    };

    fetchData();
  }, [user,lessons  ]);

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  const handle = (e) => {
    setLessonID(e.target.value);
  };

  return (
    <div className="s-container">
      <div className="s-container-left">
        <h2>Line Chart: Total Score in Last 7 Days</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Total Score in Last 7 Days",
              },
            },
          }}
        />
      </div>
      <div className="s-container-right">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
          width: "100%"
        }}> 
         <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "25%",
            }}
          ></div>
          <h2>Bar Chart: Quiz Attempts</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "25%",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Lesson name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={lessonID}
                label="Lesson name"
                onChange={handle}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </MenuItem>
                ))}
                {/* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
              </Select>
            </FormControl>
          </div>
        </div>

        <BarCharCus lessonId={lessonID} userId={user.id} />
      </div>
    </div>
  );
};

export default Grammar;
