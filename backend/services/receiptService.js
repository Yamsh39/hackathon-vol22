const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReceipt = async (data) => {
  return await prisma.receipt.create({ data });
};

const getReceipts = async () => {
  return await prisma.receipt.findMany();
};

// 月ごとの支出合計を取得
const getMonthlySummary = async () => {
  return await prisma.$queryRaw`
    SELECT 
      TO_CHAR("date", 'YYYY-MM') AS month,
      SUM("outcome") AS total_expense
    FROM "Receipt"
    GROUP BY month
    ORDER BY month;
  `;
};

module.exports = { createReceipt, getReceipts, getMonthlySummary };
