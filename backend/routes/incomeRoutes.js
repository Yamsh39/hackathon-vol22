const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/add-income', async (req, res) => {
  const { date, amount, source } = req.body;

  try {
    const newIncome = await prisma.income.create({
      data: {
        date: new Date(date),
        amount: parseFloat(amount),
        source,
      },
    });
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ error: '収入データの登録に失敗しました' });
  }
});

router.get('/get-incomes', async (req, res) => {
  try {
    const incomes = await prisma.income.findMany(); // 全ての収入データを取得
    res.status(200).json(incomes); // 成功した場合、収入データをレスポンスとして返す
  } catch (error) {
    res.status(500).json({ error: '収入データの取得に失敗しました' }); // エラーがあれば、エラーレスポンス
  }
});

router.delete('/delete-income/:id', async (req, res) => {
  const { id } = req.params; // 削除する収入IDを取得

  try {
    const deletedIncome = await prisma.income.delete({
      where: { income_id: parseInt(id) },
    });
    res.status(200).json(deletedIncome); // 削除したデータを返す
  } catch (error) {
    res.status(500).json({ error: '収入データの削除に失敗しました' });
  }
});


module.exports = router;
