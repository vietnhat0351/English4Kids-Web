import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({genderData}) => {
  // Dữ liệu cho biểu đồ
  const data = {
    labels: ['male', 'female', 'unknown'], // Các nhãn
    datasets: [
      {
        label: 'Numbers', // Nhãn của dữ liệu
        data: [genderData?.female, genderData?.male, genderData?.unknown], // Dữ liệu (số lượng hoặc tỷ lệ)
        backgroundColor: [
          'rgb(255, 99, 132)', // Màu sắc cho Nam
          'rgb(54, 162, 235)', // Màu sắc cho Nữ
          'rgb(255, 205, 86)', // Màu sắc cho unknown
        ],
        // borderColor: [
        //   'rgba(54, 162, 235, 1)',
        //   'rgba(255, 99, 132, 1)',
        //   'rgba(255, 206, 86, 1)',
        // ],
        // borderWidth: 1, // Độ dày viền
      },
    ],
  };

  // Cấu hình tùy chọn cho biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Vị trí chú thích (top, bottom, left, right)
      },
      title: {
        display: true,
        text: 'Thống kê giới tính người dùng', // Tiêu đề biểu đồ
        position: 'top', // Vị trí tiêu đề (top, bottom, left, right)
      },
    },
  };

  return <Pie data={data} options={options} width={500} height={500} />;
};

export default PieChart;
