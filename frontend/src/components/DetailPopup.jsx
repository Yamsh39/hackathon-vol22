import React from 'react';
import styles from '../styles/DetailPopup.module.css';

const DetailPopup = ({ category, onClose }) => {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2>{category.category}の詳細</h2>
        <p>合計金額: {category._sum.price}円</p>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default DetailPopup;
