const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// ルートをインポート
const ocrRoutes = require('./routes/ocrRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const geminiRoutes = require('./routes/geminiRoutes');
const dbRoutes = require('./routes/dbRoutes');
const incomeRoutes = require('./routes/incomeRoutes');

// 月ごとの支出を取得するエンドポイントを追加
app.get('/api/receipts/monthly-summary', async (req, res) => {
  try {
    const summary = await prisma.$queryRaw`
      SELECT 
        TO_CHAR("date", 'YYYY-MM') AS month,
        SUM("outcome") AS total_expense
      FROM "Receipt"
      GROUP BY month
      ORDER BY month;
    `;
    res.json(summary);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 年ごとの支出を取得するエンドポイントを追加
app.get('/api/receipts/yearly-summary', async (req, res) => {
  try {
    const summary = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(r."date", 'YYYY') AS year,
        SUM(r."outcome") AS total_expense,
        COALESCE(SUM(i."amount"), 0) AS total_income,
        COALESCE(SUM(i."amount"), 0) - SUM(r."outcome") AS balance
      FROM "Receipt" r
      LEFT JOIN "Income" i ON TO_CHAR(r."date", 'YYYY') = TO_CHAR(i."date", 'YYYY')
      GROUP BY year
      ORDER BY year;
    `;
    res.json(summary);
  } catch (error) {
    console.error('Error fetching yearly summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ルートを適用
app.use('/ocr', ocrRoutes);
app.use('/receipts', receiptRoutes);
app.use('/gemini', geminiRoutes);
app.use('/db', dbRoutes);
app.use('/income', incomeRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
