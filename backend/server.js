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

// ルートを適用
app.use('/ocr', ocrRoutes);
app.use('/receipts', receiptRoutes);
app.use('/gemini', geminiRoutes);
app.use('/db', dbRoutes);
app.use('/income', incomeRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
