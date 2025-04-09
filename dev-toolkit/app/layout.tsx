import type React from "react"
import { Inter } from "next/font/google"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Developer's Toolkit",
  description: "Explore everything in one place"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  )
}


import './globals.css'