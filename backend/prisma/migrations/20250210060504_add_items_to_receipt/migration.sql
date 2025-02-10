-- CreateTable
CREATE TABLE "Item" (
    "item_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "receipt_id" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("item_id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "Receipt"("receipt_id") ON DELETE RESTRICT ON UPDATE CASCADE;
