const axios = require('axios');

const formatReceiptData = async (ocrText) => {
  try {
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
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const geminiResponse = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(geminiResponse.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Gemini APIエラー:', error);
    throw new Error('Gemini APIの処理に失敗しました');
  }
};

module.exports = { formatReceiptData };
