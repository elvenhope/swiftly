import React from "react"
import Header from "@/components/admin/Header"
import Footer from "@/components/clientSide/Footer"

function layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-full">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default layout
