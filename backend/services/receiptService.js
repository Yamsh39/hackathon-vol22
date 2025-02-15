const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReceipt = async (data) => {
  return await prisma.receipt.create({ data });
};

const getReceipts = async () => {
  return await prisma.receipt.findMany();
};

module.exports = { createReceipt, getReceipts };
