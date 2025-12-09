-- CreateTable
CREATE TABLE "SalesRecord" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "customerRegion" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "tags" TEXT[],
    "quantity" INTEGER NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesRecord_transactionId_key" ON "SalesRecord"("transactionId");

-- CreateIndex
CREATE INDEX "SalesRecord_customerName_idx" ON "SalesRecord"("customerName");

-- CreateIndex
CREATE INDEX "SalesRecord_date_idx" ON "SalesRecord"("date");

-- CreateIndex
CREATE INDEX "SalesRecord_customerRegion_idx" ON "SalesRecord"("customerRegion");

-- CreateIndex
CREATE INDEX "SalesRecord_productCategory_idx" ON "SalesRecord"("productCategory");

-- CreateIndex
CREATE INDEX "SalesRecord_paymentMethod_idx" ON "SalesRecord"("paymentMethod");
