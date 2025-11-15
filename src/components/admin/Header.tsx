"use client"

import React, { useState } from "react"
import Image from "next/image"
import { IoPersonCircleOutline } from "react-icons/io5"
import logo from "@/../assets/images/logo.svg"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

function Header() {
	const { data } = useSession()
	const router = useRouter()
	const [menuOpen, setMenuOpen] = useState(false)
	const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout>();

	const handleMouseEnter = () => {
		clearTimeout(closeTimeout)
		if (data?.user) {
			setMenuOpen(true) // toggle dropdown
		}
	}

	const handleMouseLeave = () => {
		setCloseTimeout(setTimeout(() => {
			setMenuOpen(false)
		}, 400));
	}

	const handleLogout = async () => {
		await signOut()
		router.push("/signin")
	}

	return (
        <div className="min-h-[130px] flex justify-between items-center p-5 bg-dark-purple relative">
            <div
                className="max-w-1/4 relative h-full w-[150px] flex"
                onClick={() => {
                    router.push("/")
                }}
            >
                <Image src={logo} alt="Swiftly Logo" fill />
            </div>
            <div
                className="relative inline-block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <IoPersonCircleOutline
                    size={50}
                    className="cursor-pointer text-sunglow"
                    onClick={() => router.push("/dashboard")}
                />

                {menuOpen && data?.user && (
                    <div className="absolute right-0 mt-1 w-48 bg-dark-purple border border-gray-700 rounded-md shadow-lg z-50">
                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-english-violet"
                            onClick={() => router.push("/dashboard")}
                        >
                            Dashboard
                        </button>

                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-english-violet"
                            onClick={() => router.push("/admin/products")}
                        >
                            Products
                        </button>

                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-english-violet"
                            onClick={() => router.push("/admin/add-product")}
                        >
                            Add Products
                        </button>

                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-english-violet"
                            onClick={() => router.push("/admin/orders")}
                        >
                            Orders
                        </button>

                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-english-violet"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header
