const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Multerの設定（画像ファイルの保存先）
const upload = multer({ dest: 'uploads/' });

// Azure APIキーとエンドポイント
const API_KEY = process.env.AZURE_API_KEY;
const ENDPOINT = process.env.AZURE_ENDPOINT;

let lastOcrResult = null;  // OCR結果を保存する変数

// 画像を受け取り、OCRを実行するエンドポイント
// 画像を受け取り、OCRを実行するエンドポイント
app.post('/extract-receipt', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // 画像が送信されていない場合
    if (!imagePath) {
      return res.status(400).json({ error: '画像ファイルが必要です' });
    }

    // Azure OCR APIリクエストURL
    const url = `${ENDPOINT}vision/v3.2/ocr?language=unk&detectOrientation=true`;

    const imageData = fs.readFileSync(imagePath);

    // Azure OCR APIにリクエスト
    const response = await axios.post(url, imageData, {
      headers: {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });

    // OCRの結果をログに出力して確認
    console.log('OCR Result:', JSON.stringify(response.data, null, 2));

    lastOcrResult = response.data;

    // OCR結果そのまま返す
    res.json(response.data);

    // 使用後にファイルを削除
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '画像のOCR処理に失敗しました' });
  }
});

// OCR結果を簡易的に表示するエンドポイント
app.get('/receipt_result', (req, res) => {
  if (!lastOcrResult) {
    return res.status(404).json({ message: 'OCR結果がありません' });
  }

  // OCR結果を整形する
  const formattedResult = formatOcrData(lastOcrResult);

  res.json(formattedResult);
});

// OCR結果を整形して、読みやすい形にする関数
// OCR結果を簡易的に表示するエンドポイント
app.get('/receipt_result', (req, res) => {
  if (!lastOcrResult) {
    return res.status(404).json({ message: 'OCR結果がありません' });
  }

  // OCR結果を整形する
  const formattedResult = formatOcrData(lastOcrResult);

  res.json(formattedResult);
});

// OCR結果を整形して、読みやすい形にする関数
const formatOcrData = (ocrData) => {
  // OCRの全テキストを抽出して行ごとに結合
  const formattedText = ocrData.regions
    .map(region => {
      return region.lines
        .map(line => {
          // 行ごとに単語を結合
          return line.words.map(word => word.text).join(' '); 
        })
        .join('\n');  // 行ごとに改行を挿入
    })
    .join('\n\n');  // 領域ごとに改行を挿入

  // 整形した結果
  return {
    formattedText: formattedText,  // 行ごとに文字列を結合した結果
    rawOcrData: ocrData,  // 元のOCRデータ
    regions: ocrData.regions.map((region, idx) => ({
      regionNumber: idx + 1,
      lines: region.lines.map((line, lineIdx) => ({
        lineNumber: lineIdx + 1,
        words: line.words.map((word, wordIdx) => ({
          wordNumber: wordIdx + 1,
          text: word.text,
        })),
      })),
    })),
  };
};



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
