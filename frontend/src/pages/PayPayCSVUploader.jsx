import React, { useState } from 'react';
import axios from 'axios';

const PayPayCSVUploader = () => {
  const [csvData, setCsvData] = useState(null);

  // CSVファイルが選ばれたときの処理
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result;
        const rows = text.split('\n'); // 行ごとに分ける
        const data = rows.map((row) => row.split(',')); // カンマで分ける
        setCsvData(data);
      };

      reader.readAsText(file);
    }
  };

  // CSVデータをバックエンドに送信
  const handleUpload = async () => {
    if (!csvData) return;
    
    try {
      // CSVデータをサーバーに送信
      const response = await axios.post('http://localhost:5000/paypay/upload', {
        data: csvData, // CSVデータを送信
      });
      console.log('データが正常に送信されました:', response.data);
    } catch (error) {
      console.error('データ送信エラー:', error);
    }
  };

  return (
    <div>
      <h1>PayPay取引履歴アップロード</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      {csvData && (
        <div>
          <h2>CSVデータ</h2>
          <table>
            <thead>
              <tr>
                {csvData[0].map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(1).map((row, index) => (
                <tr key={index}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpload}>アップロード</button>
        </div>
      )}
    </div>
  );
};

export default PayPayCSVUploader;
