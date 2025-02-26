"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import { toast } from "react-toastify"
import { getCart, type CartResponse } from "@/api/cartPageApi"
import { getCustomerAddresses, type CustomerAddressesResponse } from "@/api/ProfilePageApi"
import { setDefaultAddress, type Address } from "@/redux/userSlice"
import { type OrderData, placeOrderAPI } from "@/api/orderApi"
import AddressForm from "@/components/ClientSideComponent/ProfilePageComponent/AddressForm"
import CartProductsSummary from "@/components/ClientSideComponent/CartComponent/CartSummery"
import { clearCart } from "@/redux/cartSlice"
import { useRouter } from "next/navigation"
import Lottie from "lottie-react"
import emptyCart from "@/public/animation/Animation - 1740402945831.json"
import AddressSection from "@/components/ServerSideComponent/CheckoutPageComponent/AddressSection"
import GuestAddressForm from "@/components/ServerSideComponent/CheckoutPageComponent/GuestAddressForm"
import OrderSummary from "@/components/ServerSideComponent/CheckoutPageComponent/OrderSummary"
import PaymentMethod from "@/components/ServerSideComponent/CheckoutPageComponent/PaymentMethod"

const CheckoutPage = () => {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.user.token)
  const customer = useSelector((state: RootState) => state.user.id)
  const dispatch = useDispatch()

  const [cartData, setCartData] = useState<CartResponse | null>(null)
  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  })
  const [billingSame, setBillingSame] = useState<boolean>(true)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<Address | null>(null)
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<Address | null>(null)
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false)
  const [addressFormType, setAddressFormType] = useState<"delivery" | "billing" | null>(null)

  const localCart = useSelector((state: RootState) => state.cart)

  useEffect(() => {
    if (token && customer) {
      const fetchCart = async () => {
        try {
          const data = await getCart(customer, token)
          setCartData(data)
        } catch (error) {
          console.error("Error fetching cart:", error)
          toast.error("Error fetching cart data.")
        }
      }
      const fetchAddresses = async () => {
        try {
          const response: CustomerAddressesResponse = await getCustomerAddresses(customer, token)
          setAddresses(response.addresses)
          const defaultDelivery = response.addresses.find(
            (addr) => addr.type.toLowerCase().includes("delivery") && addr.is_selected,
          )
          const defaultBilling = response.addresses.find(
            (addr) => addr.type.toLowerCase().includes("billing") && addr.is_selected,
          )
          if (defaultDelivery) setSelectedDeliveryAddress(defaultDelivery)
          if (defaultBilling) setSelectedBillingAddress(defaultBilling)
        } catch (error) {
          console.error("Error fetching addresses:", error)
          toast.error("Error fetching addresses.")
        }
      }
      fetchCart()
      fetchAddresses()
    }
  }, [token, customer])

  const subtotal =
    token && cartData
      ? cartData.products.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)
      : localCart.cartItems.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

  const deliveryCharges = 110
  const taxPercentage = 10
  const finalTotal = subtotal + subtotal / taxPercentage + deliveryCharges

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const cartItems = token && cartData ? cartData.products : localCart.cartItems
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!")
      return
    }
    if (token) {
      if (!addresses || addresses.length === 0) {
        toast.error("No addresses found. Please add an address.")
        return
      }
      if (!selectedDeliveryAddress || !selectedBillingAddress) {
        toast.error("Please select both delivery and billing addresses.")
        return
      }
    } else {
      if (
        !shippingAddress.fullName ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.zipcode ||
        !shippingAddress.country ||
        !shippingAddress.phone
      ) {
        toast.error("Please fill in your shipping address.")
        return
      }
      if (!billingSame) {
        if (
          !billingAddress.fullName ||
          !billingAddress.address ||
          !billingAddress.city ||
          !billingAddress.state ||
          !billingAddress.zipcode ||
          !billingAddress.country
        ) {
          toast.error("Please fill in your billing address.")
          return
        }
      }
    }

    const orderPayload: OrderData = {
      sub_total: subtotal,
      tax: taxPercentage,
      delivery_charge: deliveryCharges,
      discount: 0,
      final_total: finalTotal,
      is_payment_done: paymentMethod === "online" ? true : false,
      payment_transaction_id: paymentMethod === "online" ? "TXN123" : "",
      payment_type: paymentMethod === "Cash on Delivery" ? "Cash on Delivery" : "Online",
      payment_datetime: new Date().toISOString(),
      billing_address: token
        ? `${selectedBillingAddress?.address}, ${selectedBillingAddress?.locality},${selectedBillingAddress?.city}, ${selectedBillingAddress?.state} ${selectedBillingAddress?.zipcode}, ${selectedBillingAddress?.country}`
        : billingSame
          ? `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipcode}, ${shippingAddress.country}`
          : `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zipcode}, ${billingAddress.country}`,
      delivery_address: token
        ? `${selectedDeliveryAddress?.address}, ${selectedDeliveryAddress?.locality}, ${selectedDeliveryAddress?.city}, ${selectedDeliveryAddress?.state} ${selectedDeliveryAddress?.zipcode}, ${selectedDeliveryAddress?.country}`
        : `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipcode}, ${shippingAddress.country} - ${shippingAddress.phone}`,
      products: (token && cartData ? cartData.products : localCart.cartItems).map((item) => ({
        product_id: Number(item.id),
        unit_price: Number.parseFloat(item.price),
        quantity: item.quantity,
      })),
    }

    try {
      if (token) {
        const orderResponse = await placeOrderAPI(orderPayload, token)
        toast.success(orderResponse.message)
        if (orderResponse.message === "Order placed successfully") {
          dispatch(clearCart())
          router.push(`/thankyou?orderId=${orderResponse.order_id}`)
        }
      } else {
        toast.success("Order placed successfully! (Demo)")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Error placing order. Please try again.")
    }
  }

  const handleShop = async () => {
    router.push("/shop")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section: Address Details */}
        <div className="w-full md:w-2/3 border rounded space-y-3">
          <h2 className="text-2xl font-bold bg-[--mainColor] text-white p-4">Delivery & Billing Details</h2>
          {token && addresses ? (
            <div className="p-4">
              <AddressSection
                addresses={addresses}
                selectedAddress={selectedDeliveryAddress}
                setSelectedAddress={setSelectedDeliveryAddress}
                setDefaultAddress={(payload) => dispatch(setDefaultAddress(payload))}
                addressType="delivery"
                setShowAddressForm={setShowAddressForm}
                setAddressFormType={setAddressFormType}
              />
              <AddressSection
                addresses={addresses}
                selectedAddress={selectedBillingAddress}
                setSelectedAddress={setSelectedBillingAddress}
                setDefaultAddress={(payload) => dispatch(setDefaultAddress(payload))}
                addressType="billing"
                setShowAddressForm={setShowAddressForm}
                setAddressFormType={setAddressFormType}
              />
            </div>
          ) : (
            <>
              <div className="border p-4 rounded">
                <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">Enter Delivery Address</h3>
                <GuestAddressForm address={shippingAddress} setAddress={setShippingAddress} type="shipping" />
              </div>
              <div className="border p-4 rounded">
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} />
                  <span className="ml-2">Billing address same as delivery</span>
                </label>
                {!billingSame && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold mb-2">Enter Billing Address</h3>
                    <GuestAddressForm address={billingAddress} setAddress={setBillingAddress} type="billing" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Section: Cart & Payment Summary */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="border rounded">
            <h2 className="text-2xl font-bold text-white p-4 bg-[--mainColor]">Your Cart</h2>
            <div className="cart p-4 max-h-[400px] overflow-y-auto">
              {token && cartData ? (
                <CartProductsSummary cartItems={localCart.cartItems} token={token} customerId={customer} />
              ) : (
                <CartProductsSummary cartItems={localCart.cartItems} />
              )}
              <div className="empty-cart">
                {localCart.cartItems.length < 1 ? (
                  <div className="flex items-center justify-center h-full flex-col">
                    <div className="animation-container mx-auto">
                      <Lottie
                        animationData={emptyCart}
                        loop={true}
                        autoplay={true}
                        style={{ height: 200, width: 300 }}
                      />
                    </div>
                    <p className="py-3">Oops, your cart is empty.</p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <button
                onClick={handleShop}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
              >
                Go Back Shopping
              </button>
            </div>
          </div>
          <OrderSummary
            subtotal={subtotal}
            taxPercentage={taxPercentage}
            deliveryCharges={deliveryCharges}
            finalTotal={finalTotal}
          />
          <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
          <div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[--mainColor] text-white p-4 rounded hover:bg-blue-600 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
      {/* AddressForm Modal */}
      {showAddressForm && addressFormType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <AddressForm
              addressType={addressFormType === "delivery" ? "Delivery address" : "Billing address"}
              customerId={customer || 0}
              createdBy={customer || 0}
              authToken={token || ""}
              onAddressAdded={() => setShowAddressForm(false)}
              onClose={() => setShowAddressForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage

