import React from 'react';
import '../styles/DetailPopup.css';

const DetailPopup = ({ category, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>{category.category}の詳細</h2>
        <p>合計金額: {category._sum.price}円</p>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default DetailPopup;
