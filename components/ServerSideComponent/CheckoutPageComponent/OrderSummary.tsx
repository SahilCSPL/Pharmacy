import type React from "react"

interface OrderSummaryProps {
  subtotal: number
  taxPercentage: number
  deliveryCharges: number
  finalTotal: number
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, taxPercentage, deliveryCharges, finalTotal }) => {
  return (
    <div className="border rounded">
      <h2 className="text-2xl font-bold text-white p-4 bg-[--mainColor]">Order Summary</h2>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="p-2 text-gray-600">Subtotal</td>
            <td className="p-2 text-right font-medium text-gray-800">₹{subtotal}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 text-gray-600">Tax</td>
            <td className="p-2 text-right font-medium text-gray-800">{taxPercentage} %</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 text-gray-600">Delivery Charges</td>
            <td className="p-2 text-right font-medium text-gray-800">₹{deliveryCharges}</td>
          </tr>
          <tr className="border-t font-semibold text-gray-900">
            <td className="py-3 px-2 text-[--mainColor]">Total</td>
            <td className="py-3 px-2 text-right text-lg">₹{finalTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default OrderSummary

