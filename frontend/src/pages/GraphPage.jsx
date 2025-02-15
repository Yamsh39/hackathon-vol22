// frontend/src/GraphPage.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphPage = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  // 月ごとの支出を取得する
  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/receipts/monthly-summary');
        const data = await response.json();
        setMonthlyData(data);
      } catch (error) {
        console.error('Error fetching monthly summary:', error);
      }
    };
    fetchMonthlySummary();
  }, []);

  // グラフデータの準備
  const chartData = {
    labels: monthlyData.map(item => item.month), // 月
    datasets: [
      {
        label: 'Total Expense',
        data: monthlyData.map(item => item.total_expense), // 支出合計
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2>Monthly Expense Overview</h2>
      <Line data={chartData} />
    </div>
  );
};

export default GraphPage;
