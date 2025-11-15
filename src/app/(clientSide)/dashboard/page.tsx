"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"
import placeholderImage from "../../../../assets/images/noImage.jpg"

type OrderItem = {
    id: string
    name: string
    price: string
    quantity: number
    image?: string | null
}

type Order = {
    id: string
    total: string
    status: string
    createdAt: string
    items: OrderItem[]
}

export default function ClientOrdersPage() {
    const { data: session } = useSession()
    const [orders, setOrders] = useState<Order[]>([])
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if (!session?.user) return
        setFetching(true)
        fetch("/api/orders/client")
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .finally(() => setFetching(false))
    }, [session])

    if (fetching) {
        return (
            <div className="p-10 text-center text-sunglow">
                Loading orders...
            </div>
        )
    }

    if (!session?.user) {
        return (
            <div className="p-10 text-center text-sunglow">
                You must be logged in to see your orders.
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="p-10 text-center text-sunglow">
                You have no orders.
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6 bg-(--color-background) text-sunglow">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
            <div className="max-w-4xl mx-auto space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-dark-purple p-4 rounded-xl shadow-md"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg">
                                    Order ID: {order.id}
                                </p>
                                <p>Total: €{Number(order.total).toFixed(2)}</p>
                                <p className="text-sm text-sunglow/70">
                                    {order.items.length} items
                                </p>
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
                        <div className="mt-3 space-y-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 bg-raisin-black p-2 rounded-md"
                                >
                                    <Image
                                        src={item.image || placeholderImage}
                                        alt={item.name}
                                        width={60}
                                        height={60}
                                        className="rounded-md object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {item.name}
                                        </p>
                                        <p>
                                            €{Number(item.price).toFixed(2)} x{" "}
                                            {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
