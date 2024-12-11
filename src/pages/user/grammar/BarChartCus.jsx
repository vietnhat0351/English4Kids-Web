import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import customFetch from "../../../utils/customFetch";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartCus = ({ lessonId, userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);  // Để hiển thị loading khi dữ liệu đang tải

  console.log(lessonId, userId, "Props");  // Kiểm tra props

  useEffect(() => {
    if (!lessonId || !userId) {
      console.error("Lesson ID or User ID is missing");
      return;  // Không tiếp tục nếu thiếu ID
    }

    const fetchData2 = async () => {
      try {
        const response = await customFetch.get(
          `/api/v1/lessons/get-statistic?lessonId=${lessonId}&userId=${userId}`
        );
        const jsonData = response.data;
        console.log(jsonData, "API Response");  // Kiểm tra dữ liệu API
        setData(jsonData.reverse());  // Đảo ngược mảng để hiển thị mới nhất trước
        setLoading(false);  // Dữ liệu đã tải xong
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);  // Dừng loading nếu có lỗi
      }
    };

    fetchData2();  // Gọi API khi lessonId và userId hợp lệ

  }, [lessonId, userId]);

  const chartData = {
    labels: data.length > 0 ? data.map((item) => `Attempt ${item.attemptRank}`) : [],
    datasets: [
      {
        label: "Score",
        data: data.length > 0 ? data.map((item) => item.score) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Time (seconds)",
        data: data.length > 0 ? data.map((item) => item.time) : [],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;  // Hiển thị khi đang tải dữ liệu
  }

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Quiz Attempts: Score and Time",
      },
    },
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChartCus;
