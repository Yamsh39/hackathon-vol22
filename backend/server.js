const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 環境変数の読み込み
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ルートの設定
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// サーバーの起動
// バインド先を '0.0.0.0' に変更
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
