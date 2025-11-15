// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		// Get user session
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Only admins allowed
		if (session.user.role !== "admin") {
			return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
		}

		const body = await request.json();
		const { name, description, price, stock, image } = body;

		if (!name || price == null || stock == null) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		const product = await prisma.product.create({
			data: {
				name,
				description,
				price: Number(price),
				stock: Number(stock),
				image,
			},
		});

		return NextResponse.json({ message: "Product added", product }, { status: 201 });
	} catch (error) {
		console.error("Error adding product:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
