import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import DetailPopup from '../components/DetailPopup'; // 新しいコンポーネントをインポート

const Home = () => {
  const [totalAssets, setTotalAssets] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // 新しい状態を追加
  const [isAnimating, setIsAnimating] = useState(false); // アニメーション状態を追加

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

  const getFontSize = (price) => {
    const minFontSize = 10;
    const maxFontSize = 30;
    const maxPrice = Math.max(...categorySummary.map(category => category._sum.price));
    return minFontSize + (maxFontSize - minFontSize) * (price / maxPrice);
  };

  const getBaloonColor = (category) => {
    const colors = {
      食費: '#FF6347', // Tomato
      日用品: '#FFD700', // Gold
      趣味: '#32CD32', // LimeGreen
      水道光熱費: '#FF4500', // OrangeRed
      貯金投資: '#4682B4', // SteelBlue
      税金保険: '#1E90FF', // DodgerBlue
      その他: '#D3D3D3', // LightGray
    };
    return colors[category] || '#F0F0F0';
  };

  const handleBaloonClick = (category) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedCategory(category);
      setIsAnimating(false);
    }, 500); // アニメーションの時間に合わせて遅延
  };

  const handleClosePopup = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="container">
        <h2>総資産額: {totalAssets !== null ? `${totalAssets} 円` : 'データ取得中...'}</h2>
        <h3 style={{ padding: '30px 0' }}>今月の支出</h3>
        <div className='baloonSet'>
          {categorySummary.map((category, index) => (
            <div 
              className={`baloon ${isAnimating ? 'animate' : ''}`} 
              key={category.category} 
              style={{ 
                width: getBaloonSize(category._sum.price), 
                height: getBaloonSize(category._sum.price),
                padding: '20px',
                backgroundColor: getBaloonColor(category.category),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '--i': index, /* 追加 */
              }}
              onClick={() => handleBaloonClick(category)} // クリックイベントを追加
            >
              <div 
                className='baloonText' 
                style={{ 
                  fontSize: getFontSize(category._sum.price),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {category.category}
              </div>
              <div 
                className='baloonValue' 
                style={{ 
                  fontSize: getFontSize(category._sum.price),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {category._sum.price}円
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedCategory && (
        <DetailPopup category={selectedCategory} onClose={handleClosePopup} />
      )}
    </>
  );
};

export default Home;
