import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegistrationHistory = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

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

  return (
    <div>
      <h1>Registration History</h1>
      <button onClick={handleSelectAll}>
        {selectedIds.size === registrations.length ? '全選択解除' : '全選択'}
      </button>
      <button onClick={handleDeleteSelected} disabled={selectedIds.size === 0}>
        選択したレコードを削除
      </button>
      <ul>
        {registrations.map((registration) => (
          <li key={registration.receipt_id}>
            <input
              type="checkbox"
              checked={selectedIds.has(registration.receipt_id)}
              onChange={() => handleCheckboxChange(registration.receipt_id)}
            />
            <p>{registration.detail}</p>
            <ul>
              {registration.items.map((item) => (
                <li key={item.item_id}>
                  {item.name} - {item.price}円 - {item.quantity}個
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationHistory;
