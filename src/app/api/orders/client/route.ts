// app/api/orders/client/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
	try {
		// Get the user session
		const session = await auth.api.getSession({ headers: req.headers })
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
		}

		// Fetch orders for this user
		const orders = await prisma.order.findMany({
			where: { userId: session.user.id },
			include: { items: true },
			orderBy: { createdAt: "desc" },
		})

		return NextResponse.json(orders)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error("Error fetching user orders:", err)
		return NextResponse.json(
			{ message: err.message || "Failed to fetch orders" },
			{ status: 500 }
		)
	}
}
