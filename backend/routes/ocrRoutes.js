const express = require('express');
const multer = require('multer');
const { performOCR, setLastOcrResult } = require('../services/ocrService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

let lastOcrResult = null;

router.post('/extract-receipt', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '画像ファイルが必要です' });

    const ocrData = await performOCR(req.file.path);
    setLastOcrResult(ocrData); // OCR結果を設定
    res.json(ocrData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/receipt_result', (req, res) => {
  if (!lastOcrResult) return res.status(404).json({ message: 'OCR結果がありません' });
  res.json(lastOcrResult);
});

module.exports = router;
