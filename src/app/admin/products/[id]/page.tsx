"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Product = {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    image?: string
}

export default function EditProductPage() {
    const { id } = useParams()
    const router = useRouter()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    // Form state
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState<number>(0)
    const [stock, setStock] = useState<number>(0)
    const [image, setImage] = useState("")

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${id}`)
                if (!res.ok) throw new Error("Failed to fetch product")
                const data = await res.json()
                setProduct(data.product)
                setName(data.product.name)
                setDescription(data.product.description || "")
                setPrice(data.product.price)
                setStock(data.product.stock)
                setImage(data.product.image || "")
            } catch (err) {
                console.error(err)
                alert("Failed to load product")
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    stock,
                    image,
                }),
            })

            if (!res.ok) throw new Error("Failed to update product")
            alert("Product updated!")
            router.push("/admin/products")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            alert(err.message)
        }
    }

    if (loading)
        return <p className="text-sunglow text-center mt-10">Loading...</p>
    if (!product)
        return (
            <p className="text-red-crayola text-center mt-10">
                Product not found
            </p>
        )

    return (
        <div className="h-screen flex items-center justify-center bg-(--color-background) pt-3 pb-3">
            <form
                onSubmit={handleSubmit}
                className="bg-dark-purple p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-sunglow text-2xl font-bold mb-6 text-center">
                    Edit Product
                </h1>

                <label className="block mb-4">
                    <span className="text-sunglow">Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-sunglow">Description</span>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-sunglow">Price</span>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        step="0.01"
                        min={0}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-sunglow">Stock</span>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        min={0}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                        required
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-sunglow">Image URL</span>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-english-violet text-sunglow py-2 rounded-md font-semibold hover:bg-dark-purple transition-colors"
                >
                    Update Product
                </button>
            </form>
        </div>
    )
}
