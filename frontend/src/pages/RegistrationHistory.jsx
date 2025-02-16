import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegistrationHistory = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortOrder, setSortOrder] = useState('asc'); // 昇順/降順の状態

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/db/registrations');
        const data = Array.isArray(response.data) ? response.data : [];
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching registration history:', error);
      }
    };

    fetchRegistrations();
  }, []);

  // アイテムのクリックで選択・解除
  const handleItemClick = (receiptId) => {
    setSelectedIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(receiptId)) {
        newSelected.delete(receiptId);
      } else {
        newSelected.add(receiptId);
      }
      return newSelected;
    });
  };

  // すべて選択・解除
  const handleSelectAll = () => {
    if (selectedIds.size === registrations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(registrations.map((r) => r.receipt_id)));
    }
  };

  // 選択されたレコードを削除
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        [...selectedIds].map((id) =>
          axios.delete(`http://localhost:5000/db/registrations/${id}`)
        )
      );
      // フロントエンド側でも即時反映
      setRegistrations((prev) => prev.filter((r) => !selectedIds.has(r.receipt_id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  };

  // 日付で並べ替え
  const sortRegistrations = (order) => {
    const sortedRegistrations = [...registrations].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setRegistrations(sortedRegistrations);
  };

  // 並べ替えボタンのクリック処理
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    sortRegistrations(newSortOrder);
  };

  return (
    <div className="container">
      <h1>登録履歴</h1>
      <button
        onClick={handleSelectAll}
        style={{
          backgroundColor: '#4CAF50', // ボタンの背景色
          color: 'white', // ボタンの文字色
          padding: '5px 10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px', // ボタン間の間隔
        }}
      >
        {selectedIds.size === registrations.length ? '全選択解除' : '全選択'}
      </button>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedIds.size === 0}
        style={{
          backgroundColor: selectedIds.size === 0 ? '#ccc' : '#f44336', // 無効な場合は灰色、削除時は赤色
          color: 'white',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '5px',
          cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
          marginRight: '10px',
        }}
      >
        削除
      </button>
      <button
        onClick={toggleSortOrder}
        style={{
          backgroundColor: '#4CAF50', // ボタンの背景色
          color: 'white',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {sortOrder === 'asc' ? '新しい順に並べ替え' : '古い順に並べ替え'}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {registrations.map((registration) => (
          <div
            key={registration.receipt_id}
            onClick={() => handleItemClick(registration.receipt_id)}
            style={{
              border: '1px solid #ccc',
              padding: '5px',
              borderRadius: '8px',
              backgroundColor: selectedIds.has(registration.receipt_id) ? '#c0f0ef' : '#f9f9f9', // 選択された項目の背景色
              cursor: 'pointer', // クリック可能にする
            }}
          >
            <p style={{ marginBottom: '10px' }}>{registration.detail}</p>
            <p style={{ fontWeight: 'bold' }}>
              日付: {new Date(registration.date).toLocaleDateString()}
            </p>
            <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
              {registration.items.map((item) => (
                <li
                  key={item.item_id}
                  style={{
                    border: '1px solid #ddd',
                    marginBottom: '5px',
                    padding: '5px',
                    borderRadius: '5px',
                    backgroundColor: '#f3f3f3',
                  }}
                >
                  {item.name} ・ {item.price}円 ・ {item.quantity}個
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationHistory;
