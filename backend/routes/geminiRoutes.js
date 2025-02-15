const express = require('express');
const { formatReceiptData } = require('../services/geminiService');
const { getLastOcrResult } = require('../services/ocrService');

const router = express.Router();

router.get('/formatted_receipt', async (req, res) => {
  const lastOcrResult = getLastOcrResult(); // OCR結果を取得
  if (!lastOcrResult) return res.status(404).json({ message: 'OCR結果がありません' });

  try {
    const ocrText = lastOcrResult.regions
      .map(region => region.lines.map(line => line.words.map(w => w.text).join(" ")).join("\n"))
      .join("\n\n");

    const formattedData = await formatReceiptData(ocrText);
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
