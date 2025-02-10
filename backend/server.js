const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
