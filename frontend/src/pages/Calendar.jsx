import React, { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../styles/Calendar.css'; // 追加（カスタムスタイル）

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [expense, setExpense] = useState({});
  const [monthlySummary, setMonthlySummary] = useState({ incomeTotal: 0, expenseTotal: 0 });

  // 日付フォーマット関数（YYYY-MM-DD）
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // カレンダーの日付変更時の処理
  const onChange = (newDate) => {
    setDate(new Date(newDate));
  };

  // 日ごとの支出データ取得
  const fetchDailyExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/db/daily-summary'); // 日ごとのデータ取得
      const dailyData = response.data;
      const expenseData = {};

      dailyData.forEach((data) => {
        const transactionDate = data.day; // YYYY-MM-DD
        if (!expenseData[transactionDate]) expenseData[transactionDate] = 0;
        expenseData[transactionDate] += data.total_expense;
      });

      setExpense(expenseData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // 月ごとの収支データ取得
  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/db/monthly-summary'); // 月ごとのデータ取得
      const monthlyData = response.data;
      const currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const summary = monthlyData.find((m) => m.month === currentMonth);

      if (summary) {
        setMonthlySummary({
          incomeTotal: summary.total_income,
          expenseTotal: summary.total_expense,
        });
      } else {
        setMonthlySummary({ incomeTotal: 0, expenseTotal: 0 });
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  };

  useEffect(() => {
    fetchDailyExpenses();
    fetchMonthlySummary();
  }, [date]);

  // 支出がある日を赤くする
  const highlightExpenseDays = ({ date }) => {
    const eventDate = formatDate(date);
    return expense[eventDate] > 0 ? 'expense-day' : null;
  };

  // 選択した日付の支出を表示
  const renderTransactions = (selectedDate) => {
    const eventDate = formatDate(selectedDate);
    const totalExpense = expense[eventDate] || 0;

    return (
      <div>
        <h3>支出: ¥{totalExpense}</h3>
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <h1>📅 収支カレンダー</h1>
      <div className="calendar-container">
        <ReactCalendar 
          onChange={onChange} 
          value={date} 
          tileClassName={highlightExpenseDays} // 追加（支出がある日を赤くする）
        />

        <div className="event-details">
          <h2>{formatDate(date)} の支出</h2>
          {renderTransactions(date)}
        </div>

        <div className="monthly-summary">
          <h2>{date.getFullYear()}年 {date.getMonth() + 1}月の収支</h2>
          <p>収入合計: ¥{monthlySummary.incomeTotal}</p>
          <p>支出合計: ¥{monthlySummary.expenseTotal}</p>
          <p>差額: ¥{monthlySummary.incomeTotal - monthlySummary.expenseTotal}</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
