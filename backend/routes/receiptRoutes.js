const express = require('express');
const { createReceipt, getReceipts } = require('../services/receiptService');

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

module.exports = router;
