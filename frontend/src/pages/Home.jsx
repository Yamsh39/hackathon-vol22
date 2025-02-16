import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
  const [totalAssets, setTotalAssets] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);

  useEffect(() => {
    const fetchTotalAssets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/db/total-assets');
        setTotalAssets(response.data.totalAssets);
      } catch (error) {
        console.error('Error fetching total assets:', error);
      }
    };

    const fetchCategorySummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/db/category-summary');
        setCategorySummary(response.data);
      } catch (error) {
        console.error('Error fetching category summary:', error);
      }
    };

    fetchTotalAssets();
    fetchCategorySummary();
  }, []);

  const getBaloonSize = (price) => {
    const minSize = 50;
    const maxSize = 200;
    const maxPrice = Math.max(...categorySummary.map(category => category._sum.price));
    return minSize + (maxSize - minSize) * (price / maxPrice);
  };

  const getBaloonColor = (category) => {
    const colors = {
      食費: '#FFB6C1',
      交通費: '#ADD8E6',
      娯楽費: '#90EE90',
      その他: '#D3D3D3',
    };
    return colors[category] || '#F0F0F0';
  };

  return (
    <>
      <div className="container">
        <h2>総資産額: {totalAssets !== null ? `${totalAssets} 円` : 'データ取得中...'}</h2>
        <h3>今月の支出</h3>
        <div className='baloonSet'>
          {categorySummary.map((category, index) => (
            <div 
              className='baloon' 
              key={category.category} 
              style={{ 
                width: getBaloonSize(category._sum.price), 
                height: getBaloonSize(category._sum.price),
                backgroundColor: getBaloonColor(category.category),
                '--i': index, /* 追加 */
              }}
            >
              <div className='baloonText'>{category.category}</div>
              <div className='baloonValue'>{category._sum.price}円</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
