"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import placeholderImage from "../../../../../assets/images/noImage.jpg"

type OrderItem = {
    id: string
    name: string
    price: string
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

export default function OrderDetailsPage() {
    const params = useParams()
    const { id } = params
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
	const [status, setStatus] = useState(order?.status || "")
    const [updating, setUpdating] = useState(false)

	const handleStatusChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newStatus = e.target.value
        setStatus(newStatus)
        setUpdating(true)
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
            if (!res.ok) {
                alert("Failed to update status")
            }
        } finally {
            setUpdating(false)
        }
    }

    useEffect(() => {
        fetch(`/api/admin/orders/${id}`)
            .then((res) => res.json())
            .then((data) => setOrder(data))
            .finally(() => setLoading(false))
    }, [id])

    if (loading)
        return <div className="p-10 text-center text-sunglow">Loading...</div>
    if (!order)
        return (
            <div className="p-10 text-center text-sunglow">Order not found</div>
        )

    return (
        <div className="min-h-screen p-6 bg-(--color-background) text-sunglow">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Order Details
            </h1>

            <label className="block mb-4">
                <span className="text-sunglow font-semibold">Order Status</span>
                <select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={updating}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow bg-dark-purple focus:outline-none focus:ring-2 focus:ring-english-violet"
                >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PAYMENT_PENDING">Payment Pending</option>
                    <option value="PAYMENT_RECEIVED">Payment Received</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELED">Canceled</option>
                </select>
            </label>

            <div className="max-w-4xl mx-auto space-y-4">
                <p>
                    <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                    <strong>User:</strong> {order.userId || "Guest"}
                </p>
                <p>
                    <strong>Status:</strong> {order.status.replace("_", " ")}
                </p>
                <p>
                    <strong>Total:</strong> €{Number(order.total).toFixed(2)}
                </p>
                <p>
                    <strong>Items:</strong>
                </p>

                <div className="space-y-2 mt-2">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center bg-dark-purple p-3 rounded-xl shadow-md gap-4"
                        >
                            <Image
                                src={item.image || placeholderImage}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                            />
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p>
                                    €{Number(item.price).toFixed(2)} x {item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
