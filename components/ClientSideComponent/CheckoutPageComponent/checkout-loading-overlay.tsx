"use client"
import { Loader2 } from "lucide-react"

export default function CheckoutLoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-[--mainColor] animate-spin mb-4" />
        <h3 className="text-xl font-semibold">Processing Your Order</h3>
        <p className="text-gray-600 mt-2">Please wait while we place your order...</p>
      </div>
    </div>
  )
}

