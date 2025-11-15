// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
	try {
		const products = await prisma.product.findMany({
			orderBy: { createdAt: "desc" }, // newest first
		});

		return NextResponse.json({ products }, { status: 200 });
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
