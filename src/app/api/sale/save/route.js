import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { customerName, customerPhone, customerAddress, payDate, payTime, carts } = await request.json();

        const rowBillSale = await prisma.billSale.create({
            data: {
                customerName,
                customerPhone,
                customerAddress,
                payDate: new Date(payDate),
                payTime
            }
        });

        for (let i = 0; i < carts.length; i++) {
            const rowProduct = await prisma.product.findFirst({
                where: {
                    id: carts[i].id
                }
            });

            await prisma.billSaleDetail.create({
                data: {
                    billSaleId: rowBillSale.id,
                    productId: rowProduct.id,
                    cost: rowProduct.cost,
                    price: rowProduct.price
                }
            });
        }
        return NextResponse.json({ message: 'success' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
