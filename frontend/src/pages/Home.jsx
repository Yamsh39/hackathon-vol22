import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [totalAssets, setTotalAssets] = useState(null);

  useEffect(() => {
    const fetchTotalAssets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/db/total-assets');
        setTotalAssets(response.data.totalAssets);
      } catch (error) {
        console.error('Error fetching total assets:', error);
      }
    };

    fetchTotalAssets();
  }, []);

  return (
    <div>
      <h2>総資産額: {totalAssets !== null ? `${totalAssets} 円` : 'データ取得中...'}</h2>
    </div>
  );
};

export default Home;
