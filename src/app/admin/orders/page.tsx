"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type OrderItem = {
    id: string
    name: string
    price: number
    quantity: number
    image?: string | null
}

type Order = {
    id: string
    userId?: string
    total: string
    status: string
    createdAt: string
    items: OrderItem[]
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch("/api/admin/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .finally(() => setLoading(false))
    }, [])

    if (loading)
        return (
            <div className="p-10 text-sunglow text-center">
                Loading orders...
            </div>
        )

    if (orders.length === 0)
        return (
            <div className="p-10 text-sunglow text-center">No orders found</div>
        )

    return (
        <div className="min-h-screen p-6 bg-(--color-background) text-sunglow">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Orders Dashboard
            </h1>

            <div className="max-w-4xl mx-auto space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-dark-purple p-4 rounded-xl shadow-md cursor-pointer hover:bg-english-violet transition-colors"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg">
                                    Order ID: {order.id}
                                </p>
                                <p>User ID: {order.userId || "Guest"}</p>
                                <p>Total: €{order ? Number(order.total).toFixed(2) : ""}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full font-semibold ${
                                    order.status === "PENDING"
                                        ? "bg-yellow-500 text-black"
                                        : order.status === "CONFIRMED"
                                        ? "bg-blue-500"
                                        : order.status === "PAYMENT_PENDING"
                                        ? "bg-orange-500"
                                        : order.status === "PAYMENT_RECEIVED"
                                        ? "bg-green-500"
                                        : order.status === "DELIVERED"
                                        ? "bg-teal-500"
                                        : order.status === "CANCELED"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                }`}
                            >
                                {order.status.replace("_", " ")}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-sunglow/70">
                            {order.items.length} items
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
