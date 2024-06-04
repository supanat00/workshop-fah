import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        status: "use",
      },
    });

    return NextResponse.json({ results: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
