import type React from "react"

interface PaymentMethodProps {
  paymentMethod: string
  setPaymentMethod: (method: string) => void
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="border rounded">
      <h2 className="text-2xl font-bold text-white p-4 bg-[--mainColor]">Payment Method</h2>
      <div className="flex gap-4 p-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="payment"
            value="Cash on Delivery"
            checked={paymentMethod === "Cash on Delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="ml-2">Cash on Delivery</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="ml-2">Online </span>
        </label>
      </div>
    </div>
  )
}

export default PaymentMethod

