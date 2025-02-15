// frontend/src/GraphPage.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../styles/GraphPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphPage = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  // 月ごとの支出を取得する
  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/db/monthly-summary');
        
        // データを日付順（昇順）にソート
        const sortedData = response.data.sort((a, b) => new Date(a.month) - new Date(b.month));
        
        setMonthlyData(sortedData);
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

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ これを false にしないとサイズ調整できない
  };

  return (
    <div className="graph-container">
      <h2>月ごとの収支</h2>
      <Line data={chartData} />
    </div>
  );
};

export default GraphPage;
