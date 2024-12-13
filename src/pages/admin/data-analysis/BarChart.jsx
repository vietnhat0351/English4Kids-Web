import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const BarChart = () => {
  const data = {
    labels: ['0-2', '3-5', '6-8', '9-11', '12-14', '15-17', '18-20'], // Các nhóm tuổi
    datasets: [
      {
        label: 'Số lượng người dùng',
        data: [0, 10, 20, 25, 30, 18, 12], // Số lượng tương ứng
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(100, 200, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(100, 200, 255, 1)',
        ],
        borderWidth: 1, // Độ rộng của viền
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Vị trí của chú thích (legend)
      },
      title: {
        display: true,
        text: 'Thống kê người dùng theo nhóm tuổi',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Nhóm tuổi',
        },
      },
      y: {
        beginAtZero: true, // Bắt đầu từ 0 trên trục Y
        title: {
          display: true,
          text: 'Số lượng người dùng',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
