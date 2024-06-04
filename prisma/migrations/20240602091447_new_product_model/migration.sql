-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
