import React, { useState } from 'react';
import axios from 'axios';
import { FaUtensils, FaShoppingCart, FaGamepad, FaLightbulb, FaPiggyBank, FaFileInvoice, FaEllipsisH } from 'react-icons/fa';
import styles from './Button.module.css';

const ReceiptForm = () => {
  const [image, setImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); // その他カテゴリ用

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category !== 'その他') {
      setCustomCategory('');
    }
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
  };

  const fetchFormattedReceipt = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/gemini/formatted_receipt');
      setReceiptData(response.data);
    } catch (error) {
      setError('レシートデータの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('画像を選択してください');
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/ocr/extract-receipt', formData);
      fetchFormattedReceipt();
    } catch (error) {
      setError('OCRの処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!receiptData) {
      setError('レシートデータがありません');
      return;
    }
    setLoading(true);
    setError(null);
  
    try {
      await axios.post('http://localhost:5000/db/save-receipt', {
        store_name: receiptData.store_name,
        date: receiptData.date,
        items: receiptData.items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: selectedCategory === 'その他' ? customCategory : selectedCategory, // カテゴリの追加
        })),
        total_price: receiptData.total_price,
      });
      alert('レシートデータがDBに登録されました');
    } catch (error) {
      setError('DB登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    { name: '食費', icon: <FaUtensils />, style: styles.food },
    { name: '日用品', icon: <FaShoppingCart />, style: styles.household },
    { name: '趣味', icon: <FaGamepad />, style: styles.hobby },
    { name: '水道光熱費', icon: <FaLightbulb />, style: styles.utility },
    { name: '貯金投資', icon: <FaPiggyBank />, style: styles.savings },
    { name: '税金保険', icon: <FaFileInvoice />, style: styles.tax },
    { name: 'その他', icon: <FaEllipsisH />, style: styles.custom }, // カスタム入力専用
  ];

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">🧾 レシート情報抽出</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">📷 画像をアップロード:</label>
          <input type="file" onChange={handleImageChange} className="mt-2 p-2 w-full border rounded-md" />
        </div>

        <hr />

        <div>
          <label className="block text-gray-700 font-medium">支出カテゴリ:</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => handleCategorySelect(category.name)}
                className={`${styles.button} ${selectedCategory === category.name ? styles.selected : ''}`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory === 'その他' && (
          <div className="mt-2">
            <label className="block text-gray-700 font-medium">カスタムカテゴリ名:</label>
            <input
              type="text"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              placeholder="カテゴリ名を入力"
              className="mt-2 p-2 w-full border rounded-md"
            />
          </div>
        )}

        <hr />

        <button type="submit" className="button submit-button">
          送信
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-500">⏳ 読み込み中...</p>}
      {error && <p className="mt-4 text-red-500">❌ {error}</p>}

      {receiptData && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <p><strong>🏪 店舗名:</strong> {receiptData.store_name}</p>
          <p><strong>📅 購入日:</strong> {receiptData.date}</p>
          <h3 className="mt-3 font-semibold">🛍️ 商品一覧:</h3>
          <ul className="list-disc pl-5">
            {receiptData.items.map((item, index) => (
              <li key={index}>{item.name} - ¥{item.price}</li>
            ))}
          </ul>
          <p className="mt-3 text-lg font-bold">💰 合計金額: ¥{receiptData.total_price}</p>
          <button onClick={saveToDatabase} className="button submit-button">
            DBに登録する
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceiptForm;
