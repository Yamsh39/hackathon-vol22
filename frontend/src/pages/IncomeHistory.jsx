import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/IncomeHistory.module.css'; // CSSモジュールをインポート

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]); // 収入データを保持するステート
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラーメッセージ
  const [selectedIncomes, setSelectedIncomes] = useState([]); // 選択した収入データのIDを保持

  // コンポーネントがマウントされた時に収入データを取得
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/income/get-incomes'); // バックエンドのエンドポイント
        setIncomes(response.data); // 取得したデータをステートに保存
      } catch (error) {
        setError('収入データの取得に失敗しました');
      } finally {
        setLoading(false); // ローディング完了
      }
    };

    fetchIncomes(); // 関数を呼び出して収入データを取得
  }, []);

  // 選択した収入データのIDを更新する関数
  const handleSelectIncome = (id) => {
    setSelectedIncomes((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((incomeId) => incomeId !== id); // すでに選択されていれば解除
      } else {
        return [...prevSelected, id]; // 新たに選択
      }
    });
  };

  // 全選択/選択解除
  const toggleSelectAll = () => {
    if (selectedIncomes.length === incomes.length) {
      setSelectedIncomes([]); // すべて選択されていれば解除
    } else {
      setSelectedIncomes(incomes.map((income) => income.income_id)); // すべて選択
    }
  };

  // 選択した収入データを削除する関数
  const deleteSelectedIncomes = async () => {
    try {
      await Promise.all(
        selectedIncomes.map((id) => axios.delete(`http://localhost:5000/income/delete-income/${id}`))
      );
      setIncomes(incomes.filter((income) => !selectedIncomes.includes(income.income_id)));
      setSelectedIncomes([]); // 削除後は選択を解除
    } catch (error) {
      setError('選択した収入データの削除に失敗しました');
    }
  };

  // ローディング中の表示
  if (loading) {
    return <p className={styles.loading}>読み込み中...</p>;
  }

  // エラーメッセージの表示
  if (error) {
    return <p className={styles.error}>{error.message || error}</p>; // より詳細なエラーメッセージを表示
  }

  return (
    <div className={styles['income-list']}>
      <h2>収入一覧</h2>

      <div className={styles.actions}>
        {/* 全選択ボタン */}
        <button className={styles['select-all']} onClick={toggleSelectAll}>
          {selectedIncomes.length === incomes.length ? '全選択解除' : '全選択'}
        </button>

        {/* 選択したものを削除するボタン */}
        <button className={styles['delete-selected']} onClick={deleteSelectedIncomes} disabled={selectedIncomes.length === 0}>
          選択した収入を削除
        </button>
      </div>

      <table className={styles['income-table']}>
        <thead>
          <tr>
            <th>選択</th>
            <th>日付</th>
            <th>金額</th>
            <th>収入源</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.income_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIncomes.includes(income.income_id)}
                  onChange={() => handleSelectIncome(income.income_id)}
                />
              </td>
              <td>{new Date(income.date).toLocaleDateString()}</td>
              <td>{income.amount} 円</td>
              <td>{income.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeList;
