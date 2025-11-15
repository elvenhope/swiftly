"use client"

import { useState } from "react"

export default function AddProductPage() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState<number>(0)
    const [stock, setStock] = useState<number>(0)
    const [image, setImage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, price, stock, image }),
        })

        if (res.ok) {
            alert("Product added!")
            setName("")
            setDescription("")
            setPrice(0)
            setStock(0)
            setImage("")
        } else {
            alert("Failed to add product")
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-(--color-background) pt-3 pb-3">
            <form
                onSubmit={handleSubmit}
                className="bg-dark-purple p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-sunglow text-2xl font-bold mb-6 text-center">
                    Add Product
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
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                        step="0.01"
                        required
						min={0}
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-sunglow">Stock</span>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                        required
						min={0}
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
                    Add Product
                </button>
            </form>
        </div>
    )
}
