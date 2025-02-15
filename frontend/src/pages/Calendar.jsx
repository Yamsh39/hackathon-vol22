import React, { useState } from 'react';
import ReactCalendar from 'react-calendar'; // インポート名を変更
import 'react-calendar/dist/Calendar.css'; // カレンダーのスタイル

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState(""); // イベント入力

  // 日付が変更されたとき
  const onChange = (newDate) => {
    setDate(newDate);
  };

  // イベント追加処理
  const addEvent = (date, event) => {
    const eventDate = date.toLocaleDateString(); // 日付を文字列化
    setEvents((prevEvents) => ({
      ...prevEvents,
      [eventDate]: [...(prevEvents[eventDate] || []), event],
    }));
  };

  // イベントの表示処理
  const renderEvents = (date) => {
    const eventDate = date.toLocaleDateString();
    return events[eventDate] ? (
      <ul>
        {events[eventDate].map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    ) : (
      <p>No events</p>
    );
  };

  return (
    <div className="calendar-page">
      <h1>📅 カレンダーページ</h1>
      <div className="calendar-container">
        {/* react-calendar を表示 */}
        <ReactCalendar onChange={onChange} value={date} />

        {/* 選択した日付のイベント */}
        <div className="event-details">
          <h2>{date.toLocaleDateString()} のイベント</h2>
          {renderEvents(date)}

          {/* イベント追加フォーム */}
          <div>
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)} // 入力時に新しいイベントをセット
              placeholder="イベントを追加"
            />
            <button
              onClick={() => {
                if (newEvent.trim()) {
                  addEvent(date, newEvent.trim());
                  setNewEvent(""); // イベントを追加した後、入力欄をリセット
                }
              }}
            >
              イベント追加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
