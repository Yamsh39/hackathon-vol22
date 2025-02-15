const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/save-receipt', async (req, res) => {
  const { store_name, date, items, total_price } = req.body;

  try {
    const validDate = new Date(date.replace(/年|月/g, '-').replace(/日/g, ''));
    if (isNaN(validDate.getTime())) {
      throw new Error('Invalid Date');
    }

    const receipt = await prisma.receipt.create({
      data: {
        detail: store_name,
        date: validDate,
        outcome: total_price,
        items: {
          create: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
            category: item.category || 'その他',
          })),
        },
      },
    });
    res.status(201).json(receipt);
  } catch (error) {
    console.error('DB保存エラー:', error);
    res.status(500).json({ error: 'DB保存に失敗しました' });
  }
});

router.get('/registrations', async (req, res) => {
  try {
    const registrations = await prisma.receipt.findMany({
      include: {
        items: true,
      },
    });
    console.log('registrations', registrations);
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// 月ごとの収支合計を取得
router.get('/monthly-summary', async (req, res) => {
  try {
    // 月ごとの合計支出を取得する
    const receipts = await prisma.receipt.findMany({
      select: {
        date: true,
        outcome: true,
      },
    });

    // 月ごとの収支合計を計算
    const monthlySummary = receipts.reduce((acc, receipt) => {
      const month = receipt.date.toISOString().slice(0, 7); // 'YYYY-MM'形式に変換
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += receipt.outcome;
      return acc;
    }, {});

    // 結果を配列に変換して返す
    const result = Object.keys(monthlySummary).map((month) => ({
      month,
      total_expense: monthlySummary[month],
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({ error: '月ごとの収支を取得する際にエラーが発生しました' });
  }
});

module.exports = router;
