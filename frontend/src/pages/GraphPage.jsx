// frontend/src/GraphPage.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../styles/GraphPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphPage = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]); // 年ごとのデータ用のステートを追加

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

  // 年ごとの支出を取得する
  useEffect(() => {
    const fetchYearlySummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/receipts/yearly-summary');
        
        // データを日付順（昇順）にソート
        const sortedData = response.data.sort((a, b) => new Date(a.year) - new Date(b.year));
        
        setYearlyData(sortedData);
      } catch (error) {
        console.error('Error fetching yearly summary:', error);
      }
    };
    fetchYearlySummary();
  }, []);

  // グラフデータの準備
  const chartData = {
    labels: monthlyData.map(item => item.month), // 月
    datasets: [
      {
        label: '支出',
        data: monthlyData.map(item => item.total_expense), // 支出合計
        borderColor: 'rgb(209, 27, 24)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: '収入',
        data: monthlyData.map(item => item.total_income), // 収入合計
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        
        fill: true,
      },
      {
        label: '合計支出',
        data: monthlyData.map(item => item.balance), // 収支差額
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const yearlyChartData = {
    labels: yearlyData.map(item => item.year), // 年
    datasets: [
      {
        label: '支出',
        data: yearlyData.map(item => item.total_expense), // 支出合計
        borderColor: 'rgb(209, 27, 24)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: '収入',
        data: yearlyData.map(item => item.total_income), // 収入合計
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: '合計支出',
        data: yearlyData.map(item => item.balance), // 収支差額
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // これを false にしないとサイズ調整できない
  };

  return (
    <div className="graph-container">
      <h2>月ごとの収支</h2>
      <Line data={chartData}/>
      <h2>年ごとの収支</h2>
      <Line data={yearlyChartData}/>
    </div>
  );
};

export default GraphPage;
