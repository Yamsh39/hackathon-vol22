const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/upload', async (req, res) => {
  const { data } = req.body;  // フロントエンドから送られたCSVデータ

  try {
    // CSVデータを処理する
    // dataは2D配列形式なので、適切な形でデータを処理します
    for (const row of data.slice(1)) {  // 最初の行はヘッダーなので、2行目から始めます
      const [store_name, date, amount, type, category, paypay_id, status] = row;
      const transactionDate = new Date(date);

      // PayPay取引をデータベースに保存
      await prisma.payPayTransaction.create({
        data: {
          store_name,
          date: transactionDate,
          amount: parseFloat(amount),
          type,
          category,
          paypay_id,
          status,
        },
      });
    }

    res.status(200).json({ message: 'CSVデータのアップロードが完了しました' });
  } catch (error) {
    console.error('CSVデータの処理エラー:', error);
    res.status(500).json({ error: 'CSVデータのアップロードに失敗しました' });
  }
});

router.get('/transactions', async (req, res) => {
    try {
        console.log('transactions');
      // 保存されたPayPayの取引履歴を取得
      const transactions = await prisma.payPayTransaction.findMany();
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error('取引履歴の取得エラー:', error);
      res.status(500).json({ error: '取引履歴の取得に失敗しました' });
    }
  });
  

module.exports = router;
