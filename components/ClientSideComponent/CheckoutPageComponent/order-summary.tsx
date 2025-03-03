"use client"

interface OrderSummarySectionProps {
  subtotal: number
  tax: number
  deliveryCharges: number
  finalTotal: number
}

export default function OrderSummarySection({ subtotal, tax, deliveryCharges, finalTotal }: OrderSummarySectionProps) {
  return (
    <div className="border rounded shadow-sm">
      <h2 className="text-2xl font-bold text-white p-4 bg-[--mainColor]">Order Summary</h2>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="p-3 text-gray-600">Subtotal</td>
            <td className="p-3 text-right font-medium text-gray-800">₹ {subtotal.toFixed(2)}</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 text-gray-600">Tax (10 %)</td>
            <td className="p-3 text-right font-medium text-gray-800">₹ {tax.toFixed(2)}</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 text-gray-600">Delivery Charges</td>
            <td className="p-3 text-right font-medium text-gray-800">₹ {deliveryCharges}</td>
          </tr>
          <tr className="border-t font-semibold text-gray-900">
            <td className="py-4 px-3 text-[--mainColor]">Total</td>
            <td className="py-4 px-3 text-right text-lg">₹ {finalTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

