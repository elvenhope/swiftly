// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Params {
	id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
	const { id } = await params;

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

		const updatedProduct = await prisma.product.update({
			where: { id },
			data: {
				name,
				description,
				price: Number(price),
				stock: Number(stock),
				image,
			},
		});

		return NextResponse.json({ message: "Product updated", product: updatedProduct }, { status: 200 });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error("Error updating product:", error);

		if (error.code === "P2025") {
			// Prisma record not found
			return NextResponse.json({ message: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
