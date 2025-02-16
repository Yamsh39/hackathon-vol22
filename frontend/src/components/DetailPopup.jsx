import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/DetailPopup.module.css';

const DetailPopup = ({ category, onClose }) => {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const encodedCategory = encodeURIComponent(category.category);
        const response = await axios.get(`http://localhost:5000/db/recent-items/${encodedCategory}`);
        setRecentItems(response.data);
      } catch (error) {
        console.error('Error fetching recent items:', error);
      }
    };

    fetchRecentItems();
  }, [category]);

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2>{category.category}の詳細</h2>
        <p>合計金額: {category._sum.price}円</p>
        <h3>直近3件のアイテム</h3>
        <ul>
          {recentItems.map((item, index) => (
            <li key={index}>
              {item.name}: {item.price}円
            </li>
          ))}
        </ul>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default DetailPopup;
