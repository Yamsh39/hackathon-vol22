import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RegistrationHistory.module.css';

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

  // チェックボックスの変更処理
  const handleCheckboxChange = (receiptId) => {
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
      <button onClick={handleSelectAll}>
        {selectedIds.size === registrations.length ? '全選択解除' : '全選択'}
      </button>
      <button onClick={handleDeleteSelected} disabled={selectedIds.size === 0}>
        選択したレコードを削除
      </button>
      <button onClick={toggleSortOrder}>
        {sortOrder === 'asc' ? '新しい順に並べ替え' : '古い順に並べ替え'}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {registrations.map((registration) => (
          <div
            key={registration.receipt_id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: selectedIds.has(registration.receipt_id) ? '#c0f0ef' : '#f9f9f9', // チェックされたアイテムの背景色
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={selectedIds.has(registration.receipt_id)}
                onChange={() => handleCheckboxChange(registration.receipt_id)}
              />
              <p style={{ display: 'inline', marginLeft: '10px' }}>{registration.detail}</p>
            </div>
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
                  {item.name} {item.price}円 {item.quantity}個
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
