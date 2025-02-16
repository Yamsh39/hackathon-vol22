import React, { useState } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaRegCreditCard, FaCoins, FaBriefcase } from 'react-icons/fa';
import styles from '../styles/Button.module.css';

const IncomeForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState('');
  const [income, setIncome] = useState('');
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedCategory || !income) {
      setError('収入元と金額を入力してください');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/income/add-income', {
        source: selectedCategory,
        amount: income,
        date: date,
      });
      setIncomeData(response.data);
    } catch (error) {
      setError('収入データの登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">💰 収入入力</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">日付:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>

        <hr />

        <div>
          <label className="block text-gray-700 font-medium">金額:</label>
          <input 
            type="number" 
            value={income} 
            onChange={(e) => setIncome(e.target.value)} 
            className="border p-2 w-full rounded-md"
          />
          円
        </div>

        <hr />

        <div>
          <label className="block text-gray-700 font-medium">カテゴリー:</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleCategorySelect('給料')}
              className={`${styles.button} ${selectedCategory === '給料' ? styles.selected : ''}`}
            >
              <FaMoneyBillWave className={`${styles.icon} ${styles.salary}`} />給料
            </button>
            <button
              type="button"
              onClick={() => handleCategorySelect('おこづかい')}
              className={`${styles.button} ${selectedCategory === 'おこづかい' ? styles.selected : ''}`}
            >
              <FaCoins className={`${styles.icon} ${styles.gift}`} />おこづかい
            </button>
            <button
              type="button"
              onClick={() => handleCategorySelect('投資')}
              className={`${styles.button} ${selectedCategory === '投資' ? styles.selected : ''}`}
            >
              <FaRegCreditCard className={`${styles.icon} ${styles.otherIncome}`} />投資
            </button>
            <button
              type="button"
              onClick={() => handleCategorySelect('副業')}
              className={`${styles.button} ${selectedCategory === '副業' ? styles.selected : ''}`}
            >
              <FaBriefcase className={`${styles.icon} ${styles.default}`} />副業
            </button>
          </div>
        </div>

        <hr />
        <br />

        <button
          type="submit"
          className="button submit-button"
        >
          送信
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-500">⏳ 読み込み中...</p>}
      {error && <p className="mt-4 text-red-500">❌ {error}</p>}

      {incomeData && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold">収入情報</h3>
          <p><strong>金額:</strong> ¥{incomeData.amount}</p>
          <p><strong>日付:</strong> {incomeData.date}</p>
          <p><strong>カテゴリー:</strong> {incomeData.source}</p>
        </div>
      )}
    </div>
  );
};

export default IncomeForm;
