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
    // 月ごとの支出 (Receipt)
    const expenses = await prisma.receipt.groupBy({
      by: ['date'],
      _sum: {
        outcome: true,
      },
    });

    // 月ごとの収入 (Income)
    const incomes = await prisma.income.groupBy({
      by: ['date'],
      _sum: {
        amount: true,
      },
    });

    // 月ごとの収支をまとめる
    const monthlySummary = expenses.map(expense => {
      const month = expense.date.toISOString().split('T')[0].slice(0, 7); // YYYY-MM
      const incomeForMonth = incomes.find(income => income.date.toISOString().split('T')[0].slice(0, 7) === month);

      const totalIncome = incomeForMonth ? incomeForMonth._sum.amount : 0;
      const totalExpense = expense._sum.outcome;
      const balance = totalIncome - totalExpense;

      return {
        month,
        total_expense: totalExpense,
        total_income: totalIncome,
        balance: balance,
      };
    });

    res.json(monthlySummary);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({ error: 'Failed to fetch monthly summary' });
  }
});
// 日ごとの収支合計を取得
router.get('/daily-summary', async (req, res) => {
  try {
    // 日ごとの支出 (Receipt)
    const expenses = await prisma.receipt.groupBy({
      by: ['date'],
      _sum: {
        outcome: true,
      },
    });

    // 日ごとの収入 (Income)
    const incomes = await prisma.income.groupBy({
      by: ['date'],
      _sum: {
        amount: true,
      },
    });

    // 日ごとの収支をまとめる
    const dailySummary = expenses.map(expense => {
      // 日付を 'YYYY-MM-DD' 形式に変換
      const day = expense.date.toISOString().split('T')[0]; // YYYY-MM-DD
      // 収入を日付で取得
      const incomeForDay = incomes.find(income => {
        const incomeDate = new Date(income.date); // 日付型に変換
        return incomeDate.toISOString().split('T')[0] === day; // 比較
      });

      const totalIncome = incomeForDay ? incomeForDay._sum.amount : 0;
      const totalExpense = expense._sum.outcome;
      const balance = totalIncome - totalExpense;

      return {
        day,
        total_expense: totalExpense,
        total_income: totalIncome,
        balance: balance,
      };
    });

    res.json(dailySummary);
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
})
router.delete('/registrations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // まず関連する Item を削除
    await prisma.item.deleteMany({
      where: { receipt_id: Number(id) }
    });

    // 次に Receipt を削除
    const deletedRecord = await prisma.receipt.delete({
      where: { receipt_id: Number(id) }
    });

    res.json({ message: 'Deleted successfully', deletedRecord });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Error deleting record' });
  }
});

router.get('/total-assets', async (req, res) => {
  try {
    const totalIncome = await prisma.income.aggregate({
      _sum: { amount: true },
    });

    const totalOutcome = await prisma.receipt.aggregate({
      _sum: { outcome: true },
    });

    const totalAssets = (totalIncome._sum.amount || 0) - (totalOutcome._sum.outcome || 0);

    res.json({ totalAssets });
  } catch (error) {
    console.error('Error fetching total assets:', error);
    res.status(500).json({ error: 'Failed to fetch total assets' });
  }
});

router.get('/category-summary', async (req, res) => {
  try {
    const categorySummary = await prisma.item.groupBy({
      by: ['category'],
      _sum: {
        price: true,
      },
    });

    res.json(categorySummary);
  } catch (error) {
    console.error('Error fetching category summary:', error);
    res.status(500).json({ error: 'Failed to fetch category summary' });
  }
});

router.get('/recent-items/:category', async (req, res) => {
  const category = decodeURIComponent(req.params.category);
  console.log('category', category);
  try {
    const recentItems = await prisma.item.findMany({
      where: { category },
      orderBy: { receipt: { date: 'desc' } }, // receiptのdateでソート
      take: 3,
      include: {
        receipt: {
          select: { date: true } // dateを選択
        }
      }
    });
    res.json(recentItems);
  } catch (error) {
    console.error('Error fetching recent items:', error);
    res.status(500).json({ error: 'Failed to fetch recent items' });
  }
});

module.exports = router;
