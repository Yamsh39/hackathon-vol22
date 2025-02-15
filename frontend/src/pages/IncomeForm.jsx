import React, { useState } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaRegCreditCard, FaCoins, FaBriefcase } from 'react-icons/fa';
import styles from './Button.module.css';

const IncomeForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState('');
  const [income, setIncome] = useState('');
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // カテゴリを選択するボタンのクリック処理
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 入力チェック
    if (!selectedCategory || !income) {
      setError('収入元と金額を入力してください');
      setLoading(false);
      return;
    }

    try {
      // 収入データをサーバーに送信
      const response = await axios.post('http://localhost:5000/income/add-income', {
        source: selectedCategory,
        amount: income,
        date: date,
      });

      // 成功した場合、取得した収入データを表示
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
        {/* 日付の入力 */}
        <div>
          <label className="block text-gray-700 font-medium">日付 </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <hr />

        {/* 金額の入力 */}
        <div>
          <label className="block text-gray-700 font-medium">金額 </label>
          <input 
            type="number" 
            placeholder="金額" 
            value={income} 
            onChange={(e) => setIncome(e.target.value)} 
            className="border p-2 w-full rounded-md"
          />
          円
        </div>
        <hr />

        {/* 収入元の選択ボタン */}
        <div>
          <label className="block text-gray-700 font-medium">カテゴリー </label>
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
        {/* 送信ボタン */}
        <button 
          type="submit" 
          className="px-6 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition duration-200 transform hover:scale-105"
        >
          収入を入力する
        </button>
      </form>

      {/* ローディング中 */}
      {loading && <p>⏳ 送信中...</p>}

      {/* エラーメッセージ */}
      {error && <p className="text-red-500">❌ {error}</p>}

      {/* 登録成功後のデータ表示 */}
      {incomeData && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <p><strong>📂 収入元:</strong> {incomeData.source}</p>
          <p className="mt-3 text-lg font-bold">💰 金額: ¥{incomeData.amount}</p>
        </div>
      )}
    </div>
  );
};

export default IncomeForm;
