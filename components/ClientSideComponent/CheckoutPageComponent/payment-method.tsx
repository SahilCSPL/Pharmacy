"use client"

interface PaymentMethodSectionProps {
  paymentMethod: string
  setPaymentMethod: (method: string) => void
}

export default function PaymentMethodSection({ paymentMethod, setPaymentMethod }: PaymentMethodSectionProps) {
  return (
    <div className="border rounded shadow-sm">
      <h2 className="text-2xl font-bold text-white p-4 bg-[--mainColor]">Payment Method</h2>
      <div className="flex gap-4 p-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="Cash on Delivery"
            checked={paymentMethod === "Cash on Delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <span>Cash on Delivery</span>
        </label>
        {/* Uncomment for online payment option
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <span>Online</span>
        </label>
        */}
      </div>
    </div>
  )
}
