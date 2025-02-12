const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Multerの設定（画像ファイルの保存先）
const upload = multer({ dest: 'uploads/' });

// Azure APIキーとエンドポイント
const API_KEY = process.env.AZURE_API_KEY;
const ENDPOINT = process.env.AZURE_ENDPOINT;

// 環境変数からGemini APIキーを取得
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

let lastOcrResult = null;  // OCR結果を保存する変数

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
  };
};

// レシートを登録するAPI
app.post('/receipts', async (req, res) => {
  try {
    const { date, outcome, detail } = req.body;
    const receipt = await prisma.receipt.create({
      data: { date: new Date(date), outcome, detail },
    });
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// レシート一覧を取得するAPI
app.get('/receipts', async (req, res) => {
  try {
    const receipts = await prisma.receipt.findMany();
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 画像を受け取り、OCRを実行するエンドポイント
app.post('/extract-receipt', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // 画像が送信されていない場合
    if (!imagePath) return res.status(400).json({ error: '画像ファイルが必要です' });

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
    // console.log('OCR Result:', JSON.stringify(response.data, null, 2));
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


app.get('/formatted_receipt', async (req, res) => {
  if (!lastOcrResult) return res.status(404).json({ message: 'OCR結果がありません' });

  try {
    // OCR結果をフラットなテキストに変換
    const ocrText = lastOcrResult.regions
      .map(region => region.lines.map(line => line.words.map(w => w.text).join(" ")).join("\n"))
      .join("\n\n");

    // Gemini APIに送信するプロンプト作成
    const prompt = `以下のレシートデータを JSON 形式で整理してください。余計な説明や注記は省いてください。商品名が不明な場合は「不明」、金額が不明な場合は「****」として表示してください。最終的な出力は次の形式にしてください:
\`\`\`
{
  "store_name": "店舗名",
  "date": "購入日",
  "items": [{"name": "商品名", "price": 100}],
  "total_price": 1000
}
\`\`\`
レシート内容:
\`\`\`
${ocrText}
\`\`\`
`;

    // Gemini API リクエストを送る
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Gemini APIのレスポンスから text を取得
    const geminiResponse = response.data.candidates[0].content.parts[0].text;

    // バックティックで囲まれた部分を削除してからJSONとしてパース
    const cleanedResponse = geminiResponse
      .replace(/```json|```/g, '')  // JSON部分のバックティックを削除
      .trim(); // 余分な空白も取り除く

    // 文字列がJSON形式であるか確認
    try {
      const formattedData = JSON.parse(cleanedResponse);

      // 不明な商品や価格がある場合には適切な処理を追加
      formattedData.items = formattedData.items.map(item => {
        if (!item.name || item.name.trim().toLowerCase() === '不明') {
          item.name = '不明';
        }
        if (isNaN(item.price) || item.price == null) {
          item.price = '****';
        }
        return item;
      });

      // 合計金額も確認して不明なら '****'
      if (isNaN(formattedData.total_price) || formattedData.total_price == null) {
        formattedData.total_price = '****';
      }

      // 整形されたデータを返す
      res.json(formattedData);

    } catch (parseError) {
      console.error('JSONパースエラー:', parseError);
      res.status(500).json({ error: 'Gemini APIの出力が正しいJSON形式ではありません' });
    }

  } catch (error) {
    console.error('Gemini APIエラー:', error);
    res.status(500).json({ error: 'レシートの整形に失敗しました' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
