"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSession } from "@/lib/auth-client" // or your auth hook
import placeholderImage from "../../../assets/images/noImage.jpg"
import { useRouter } from "next/navigation"

type Product = {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    image?: string
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const { data: session } = useSession()
    const userSignedIn = !!session?.user
	const router = useRouter()

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch("/api/products")
            const data = await res.json()
            setProducts(data.products)
        }

        fetchProducts()
    }, [])

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )

	const addToCart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")

        const existing = cart.find((item: Product) => item.id === product.id)

        if (existing) {
            existing.quantity = Math.min(
                (existing.quantity || 1) + 1,
                product.stock
            )
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                stock: product.stock,
            })
        }

        localStorage.setItem("cart", JSON.stringify(cart))
    }


    return (
        <div className="min-h-screen p-6 bg-(--color-background)">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl text-sunglow font-bold mb-6 text-center">
                    Products
                </h1>

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-6 px-4 py-2 rounded-md bg-dark-purple text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                />

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProducts.length === 0 && (
                        <p className="text-sunglow col-span-full text-center">
                            No products found
                        </p>
                    )}

                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-dark-purple p-4 rounded-xl shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() =>
                                router.push(`/products/${product.id}`)
                            }
                        >
                            <div className="w-full h-48 relative mb-4">
                                <Image
                                    src={product.image || placeholderImage}
                                    alt={product.name}
                                    fill
                                    className="object-contain rounded-md"
                                />
                            </div>

                            <h2 className="text-sunglow text-xl font-semibold mb-1">
                                {product.name}
                            </h2>
                            {product.description && (
                                <p className="text-sunglow text-sm mb-1">
                                    {product.description}
                                </p>
                            )}
                            <p className="text-sunglow font-bold mb-2">
                                ${product.price.toFixed(2)}
                            </p>

                            {userSignedIn && product.stock > 0 && (
                                <button
                                    className="bg-english-violet text-sunglow px-4 py-2 rounded-md font-semibold hover:bg-dark-purple transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation() // prevents triggering the product page navigation
                                        addToCart(product)
                                    }}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
