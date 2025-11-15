// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
	id: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: { params: any }) {
	const { id } = await params;

	try {
		const product = await prisma.product.findUnique({
			where: { id },
		});

		if (!product) {
			return NextResponse.json({ message: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({ product }, { status: 200 });
	} catch (error) {
		console.error("Error fetching product:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
