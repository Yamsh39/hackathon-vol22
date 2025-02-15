const express = require('express');
const { createReceipt, getReceipts, getMonthlySummary } = require('../services/receiptService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const receipt = await createReceipt(req.body);
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const receipts = await getReceipts();
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 月ごとの支出合計を取得するエンドポイント
router.get('/monthly-summary', async (req, res) => {
  try {
    const summary = await getMonthlySummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
