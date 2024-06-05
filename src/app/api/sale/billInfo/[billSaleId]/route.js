import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { billSaleId } = params;
    const results = await prisma.billSaleDetail.findMany({
      include: {
        Product: true,
      },
      orderBy: {
        id: "desc",
      },
      where: {
        billSaleId: parseInt(billSaleId),
      },
    });
    return NextResponse.json({ results: results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
