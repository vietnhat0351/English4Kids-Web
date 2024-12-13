import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = () => {
  const data = {
    labels: ['02/12', '03/12', '04/12', '05/12', '06/12', '07/12', '08/12', '09/12', '10/12', '11/12'],
    datasets: [
      {
        label: 'Số tài khoản đã tạo',
        data: [10, 12, 8, 15, 45, 30, 25, 15, 10, 5],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        tension: 0.4, // Làm đường cong mượt mà
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Số tài khoản đã tạo trong 10 ngày gần đây',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Số lượng',
        },
        beginAtZero: true, // Bắt đầu trục Y từ 0
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
