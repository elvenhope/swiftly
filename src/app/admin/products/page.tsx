"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Product = {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    image?: string
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const router = useRouter()

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch("/api/products")
            const data = await res.json()
            setProducts(data.products)
        }
        fetchProducts()
    }, [])

    // Filter products by search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen p-6 bg-(--color-background)">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-sunglow mb-6 text-center">
                    Manage Products
                </h1>

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-6 px-4 py-2 rounded-md bg-dark-purple text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                />

                <div className="grid md:grid-cols-2 gap-4">
                    {filteredProducts.length === 0 && (
                        <p className="text-sunglow col-span-2">
                            No products found
                        </p>
                    )}

                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-dark-purple p-4 rounded-xl shadow-md flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-sunglow text-xl font-semibold mb-2">
                                    {product.name}
                                </h2>
                                {product.description && (
                                    <p className="text-sunglow mb-2">
                                        {product.description}
                                    </p>
                                )}
                                <p className="text-sunglow">
                                    Price: ${product.price.toFixed(2)}
                                </p>
                                <p className="text-sunglow">
                                    Stock: {product.stock}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    router.push(`/admin/products/${product.id}`)
                                }
                                className="mt-4 bg-english-violet text-sunglow py-2 rounded-md font-semibold hover:bg-dark-purple transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
