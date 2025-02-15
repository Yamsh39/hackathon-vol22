import React, { useState } from 'react';
import axios from 'axios';

const ReceiptForm = () => {
  const [image, setImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 画像を選択したときの処理
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // レシートデータを取得する関数
  const fetchFormattedReceipt = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/gemini/formatted_receipt');
      setReceiptData(response.data);
    } catch (error) {
      setError('レシートデータの取得に失敗しました');
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // 画像を送信する処理
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
      await axios.post('http://localhost:5000/ocr/extract-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 画像アップロード後にフォーマット済みデータを取得
      fetchFormattedReceipt();
    } catch (error) {
      setError('OCRの処理に失敗しました');
      console.error('Error extracting receipt data:', error);
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
      await axios.post('http://localhost:5000/db/save-receipt', receiptData, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('レシートデータがDBに登録されました');
    } catch (error) {
      setError('DB登録に失敗しました');
      console.error('DB登録エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">🧾 レシート情報抽出</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">📷 画像をアップロード:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-2 p-2 w-full border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
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
          <button
            onClick={saveToDatabase}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            DBに登録する
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceiptForm;
