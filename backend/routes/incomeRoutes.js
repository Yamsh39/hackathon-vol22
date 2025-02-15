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

module.exports = router;
