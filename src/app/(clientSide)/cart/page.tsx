"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import placeholderImage from "../../../../assets/images/noImage.jpg"
import { useSession } from "@/lib/auth-client"

type CartItem = {
    id: string
    name: string
    price: number
    image: string | null
    quantity: number
    stock: number
}

export default function CartPage() {
    // start with an empty cart and defer loading from localStorage until after mount
	const { data: session } = useSession()
    const [cart, setCart] = useState<CartItem[]>([])
    const [hydrated, setHydrated] = useState(false)
	const [loading, setLoading] = useState(false)

    useEffect(() => {
        try {
            const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null
            setCart(stored ? JSON.parse(stored) : [])
        } catch {
            setCart([])
        } finally {
            setHydrated(true)
        }
    }, [])

    const updateCart = (newCart: CartItem[]) => {
        setCart(newCart)
        try {
            localStorage.setItem("cart", JSON.stringify(newCart))
        } catch {
            // ignore storage errors
        }
    }

    const increaseQty = (id: string) => {
        const updated = cart.map(item =>
            item.id === id
                ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
                : item
        )
        updateCart(updated)
    }

    const decreaseQty = (id: string) => {
        const updated = cart.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
        )
        updateCart(updated)
    }

    const removeItem = (id: string) => {
        const updated = cart.filter(item => item.id !== id)
        updateCart(updated)
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

	const submitOrder = async () => {
        if (!session) {
            alert("You must be signed in to submit an order")
            return
        }
        if (cart.length === 0) {
            alert("Cart is empty")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.id,
                    items: cart.map((item) => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    total,
                }),
            })

            if (res.ok) {
                alert("Order submitted successfully!")
                updateCart([]) // clear cart
            } else {
                const error = await res.json()
                alert("Failed to submit order: " + error.message)
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            alert("Error submitting order: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!hydrated)
        return <div className="p-10 text-center text-sunglow">Loading cart...</div>

    if (cart.length === 0)
        return (
            <div className="p-10 text-center text-sunglow text-2xl">
                Your cart is empty
            </div>
        )

    return (
        <div className="min-h-screen p-6 bg-(--color-background) text-sunglow">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

            <div className="max-w-3xl mx-auto space-y-6">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center bg-dark-purple p-4 rounded-xl shadow-md gap-4"
                    >
                        <Image
                            src={item.image || placeholderImage}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                        />

                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">
                                {item.name}
                            </h2>
                            <p>€{item.price.toFixed(2)}</p>

                            {/* Quantity selector */}
                            <div className="flex items-center gap-3 mt-3">
                                <button
                                    onClick={() => decreaseQty(item.id)}
                                    className="px-3 py-1 bg-english-violet rounded-md text-sunglow disabled:opacity-40"
                                    disabled={item.quantity <= 1}
                                >
                                    –
                                </button>

                                <span className="text-lg font-bold w-8 text-center">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() => increaseQty(item.id)}
                                    className="px-3 py-1 bg-english-violet rounded-md text-sunglow disabled:opacity-40"
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Remove button */}
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 font-bold hover:text-red-500"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {/* Total */}
                <div className="bg-dark-purple p-6 rounded-xl shadow-lg text-center mt-10">
                    <h2 className="text-2xl font-bold">
                        Total: €{total.toFixed(2)}
                    </h2>

                    <button
                        onClick={submitOrder}
                        disabled={loading}
                        className="mt-4 w-full bg-english-violet text-sunglow py-3 rounded-md font-semibold hover:bg-dark-purple transition-colors"
                    >
                        {loading ? "Submitting..." : "Submit Order"}
                    </button>
                </div>
            </div>
        </div>
    )
}
