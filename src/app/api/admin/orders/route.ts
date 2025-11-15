// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

type Product = {
	productId: string
	name: string
	price: number
	image: string
	quantity: number
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { userId, items, total } = body

		if (!items || !Array.isArray(items) || items.length === 0) {
			return NextResponse.json({ message: "No items in order" }, { status: 400 })
		}

		if (!total || typeof total !== "number") {
			return NextResponse.json({ message: "Invalid total" }, { status: 400 })
		}

		// Fetch current stock for all products in the order
		const productIds = items.map((item: Product) => item.productId)
		const products = await prisma.product.findMany({
			where: { id: { in: productIds } },
		})

		// Map productId -> product
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const productMap = Object.fromEntries(products.map((p: any) => [p.id, p]))

		// Validate stock
		for (const item of items) {
			const product = productMap[item.productId]
			if (!product) {
				return NextResponse.json({ message: `Product ${item.productId} not found` }, { status: 404 })
			}
			if (item.quantity > product.stock) {
				return NextResponse.json({
					message: `Not enough stock for product ${product.name}. Available: ${product.stock}`,
				}, { status: 400 })
			}
		}

		// Create the order and decrement stock in a transaction
		const order = await prisma.$transaction(async (tx) => {
			// 1. Decrement stock
			for (const item of items) {
				await tx.product.update({
					where: { id: item.productId },
					data: { stock: { decrement: item.quantity } },
				})
			}

			// 2. Create order
			const createdOrder = await tx.order.create({
				data: {
					userId: userId || undefined,
					total,
					status: "PENDING",
					items: {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						create: items.map((item: any) => ({
							productId: item.productId,
							name: item.name,
							price: item.price,
							quantity: item.quantity,
							image: item.image || null,
						})),
					},
				},
				include: { items: true },
			})

			return createdOrder
		})

		return NextResponse.json(order, { status: 201 })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error("Error creating order:", err)
		return NextResponse.json(
			{ message: err.message || "Failed to create order" },
			{ status: 500 }
		)
	}
}

export async function GET(req: NextRequest) {
	try {
		const orders = await prisma.order.findMany({
			include: {
				items: true, // Include the order items
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		return NextResponse.json(orders, { status: 200 })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error("Error fetching orders:", err)
		return NextResponse.json({ message: err.message || "Failed to fetch orders" }, { status: 500 })
	}
}
