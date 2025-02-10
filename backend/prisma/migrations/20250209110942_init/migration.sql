-- CreateTable
CREATE TABLE "Receipt" (
    "receipt_id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "outcome" DOUBLE PRECISION NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("receipt_id")
);
