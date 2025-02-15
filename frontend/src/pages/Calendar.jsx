import React, { useState } from 'react';
import ReactCalendar from 'react-calendar'; // カレンダーコンポーネント
import 'react-calendar/dist/Calendar.css'; // カレンダーのスタイル

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});  // 日付ごとの収支イベント
  const [income, setIncome] = useState({});  // 日付ごとの収入
  const [expense, setExpense] = useState({});  // 日付ごとの支出

  // 日付が変更されたとき
  const onChange = (newDate) => {
    setDate(newDate);
  };

  // 収支データを追加する
  const addTransaction = (date, type, amount) => {
    const eventDate = date.toLocaleDateString(); // 日付を文字列化
    const transaction = { type, amount };

    if (type === 'income') {
      setIncome({
        ...income,
        [eventDate]: [...(income[eventDate] || []), transaction],
      });
    } else if (type === 'expense') {
      setExpense({
        ...expense,
        [eventDate]: [...(expense[eventDate] || []), transaction],
      });
    }
  };

  // 特定の日付の収支を表示
  const renderTransactions = (date) => {
    const eventDate = date.toLocaleDateString();
    const dailyIncome = income[eventDate] || [];
    const dailyExpense = expense[eventDate] || [];

    const totalIncome = dailyIncome.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = dailyExpense.reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div>
        <h3>収入: ¥{totalIncome}</h3>
        <ul>
          {dailyIncome.map((e, index) => (
            <li key={index}>収入: ¥{e.amount}</li>
          ))}
        </ul>
        <h3>支出: ¥{totalExpense}</h3>
        <ul>
          {dailyExpense.map((e, index) => (
            <li key={index}>支出: ¥{e.amount}</li>
          ))}
        </ul>
      </div>
    );
  };

  // 月ごとの収支を集計
  const calculateMonthlySummary = () => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const incomeTotal = Object.keys(income).reduce((acc, currDate) => {
      const curr = new Date(currDate);
      if (curr >= startDate && curr <= endDate) {
        const dailyIncome = income[currDate].reduce((acc, curr) => acc + curr.amount, 0);
        return acc + dailyIncome;
      }
      return acc;
    }, 0);

    const expenseTotal = Object.keys(expense).reduce((acc, currDate) => {
      const curr = new Date(currDate);
      if (curr >= startDate && curr <= endDate) {
        const dailyExpense = expense[currDate].reduce((acc, curr) => acc + curr.amount, 0);
        return acc + dailyExpense;
      }
      return acc;
    }, 0);

    return { incomeTotal, expenseTotal };
  };

  const { incomeTotal, expenseTotal } = calculateMonthlySummary();

  return (
    <div className="calendar-page">
      <h1>📅 収支カレンダー</h1>
      <div className="calendar-container">
        {/* react-calendar を表示 */}
        <ReactCalendar onChange={onChange} value={date} />

        {/* 選択した日付の収支 */}
        <div className="event-details">
          <h2>{date.toLocaleDateString()} の収支</h2>
          {renderTransactions(date)}
        </div>

        {/* 月ごとの収支サマリー */}
        <div className="monthly-summary">
          <h2>{date.getFullYear()}年 {date.getMonth() + 1}月の収支</h2>
          <p>収入合計: ¥{incomeTotal}</p>
          <p>支出合計: ¥{expenseTotal}</p>
          <p>差額: ¥{incomeTotal - expenseTotal}</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
