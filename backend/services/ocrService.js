const axios = require('axios');
const fs = require('fs');
const API_KEY = process.env.AZURE_API_KEY;
const ENDPOINT = process.env.AZURE_ENDPOINT;

let lastOcrResult = null;

const setLastOcrResult = (ocrData) => {
  lastOcrResult = ocrData;
};

const getLastOcrResult = () => {
  return lastOcrResult;
};

const performOCR = async (imagePath) => {
  try {
    const url = `${ENDPOINT}vision/v3.2/ocr?language=unk&detectOrientation=true`;
    const imageData = fs.readFileSync(imagePath);

    const response = await axios.post(url, imageData, {
      headers: {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });

    fs.unlinkSync(imagePath); // 画像を削除
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('画像のOCR処理に失敗しました');
  }
};

module.exports = { performOCR, setLastOcrResult, getLastOcrResult };
