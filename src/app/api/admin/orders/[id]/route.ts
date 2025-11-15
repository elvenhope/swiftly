// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface Params {
	params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
	const { id } = await params

	try {
		const order = await prisma.order.findUnique({
			where: { id },
			include: { items: true },
		})

		if (!order) {
			return NextResponse.json({ message: "Order not found" }, { status: 404 })
		}

		return NextResponse.json(order, { status: 200 })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error("Error fetching order:", err)
		return NextResponse.json({ message: err.message || "Failed to fetch order" }, { status: 500 })
	}
}


// PUT handler for updating order status
export async function PUT(req: NextRequest, { params }: Params) {
	const { id } = await params
	try {
		const body = await req.json()
		const { status } = body

		const validStatuses = ["PENDING", "CONFIRMED", "PAYMENT_PENDING", "PAYMENT_RECEIVED", "DELIVERED", "CANCELED"]
		if (!status || !validStatuses.includes(status)) {
			return NextResponse.json({ message: "Invalid status" }, { status: 400 })
		}

		const updated = await prisma.order.update({
			where: { id },
			data: { status },
			include: { items: true },
		})

		return NextResponse.json(updated, { status: 200 })
	} catch (err: any) {
		console.error(err)
		return NextResponse.json({ message: err.message || "Failed to update order" }, { status: 500 })
	}
}