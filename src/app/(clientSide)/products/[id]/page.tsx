"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import placeholderImage from "../../../../../assets/images/noImage.jpg"

type Product = {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    image?: string
}

export default function ProductPage() {
    const { data: session } = useSession()
    const { id } = useParams()

    const [product, setProduct] = useState<Product>({
		name: "",
		id: "",
		price: 0,
		stock: 0,
	})
    const [loading, setLoading] = useState(true)
    const [qty, setQty] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`/api/products/${id}`)
            const data = await res.json()

            setProduct(data.product)
            setLoading(false)
        }

        if (id) fetchProduct()
    }, [id])

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")

        const existing = cart.find((item: Product) => item.id === product.id)

        if (existing) {
            existing.quantity = Math.min(existing.quantity + qty, product.stock)
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: qty,
                stock: product.stock,
            })
        }

        localStorage.setItem("cart", JSON.stringify(cart))
    }

    const decreaseQty = () => {
        setQty((q) => Math.max(1, q - 1))
    }

    const increaseQty = () => {
        setQty((q) => Math.min(product?.stock || 1, q + 1))
    }

    if (loading) return <div className="text-center p-10">Loading...</div>
    if (!product)
        return <div className="text-center p-10">Product not found</div>

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-(--color-background)">
            <div className="max-w-3xl w-full bg-dark-purple p-8 rounded-xl shadow-lg flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                    <Image
                        src={product.image || placeholderImage}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="rounded-xl object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 text-sunglow">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="mb-4">{product.description}</p>
                    <p className="text-xl font-semibold mb-4">
                        €{product.price ? product.price.toFixed(2) : ""}
                    </p>

                    <p className="mb-4">In stock: {product.stock}</p>

                    {/* Quantity selector */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={decreaseQty}
                            className="px-3 py-2 text-xl bg-english-violet text-sunglow rounded-md disabled:opacity-40"
                            disabled={qty <= 1}
                        >
                            –
                        </button>

                        <span className="text-2xl font-bold w-8 text-center">
                            {qty}
                        </span>

                        <button
                            onClick={increaseQty}
                            className="px-3 py-2 text-xl bg-english-violet text-sunglow rounded-md disabled:opacity-40"
                            disabled={qty >= product.stock}
                        >
                            +
                        </button>
                    </div>

                    {session ? (
                        <button
                            onClick={addToCart}
                            className="w-full bg-english-violet text-sunglow py-3 rounded-md font-semibold hover:bg-dark-purple transition-colors"
                            disabled={product.stock === 0}
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className="text-red-400">
                            Sign in to add items to your cart.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
