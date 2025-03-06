"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/cartSlice";

import AddressSection from "./address-section";
import CartSummarySection from "./cart-summary";
import OrderSummarySection from "./order-summary";
import PaymentMethodSection from "./payment-method";
import CheckoutLoadingOverlay from "./checkout-loading-overlay";
import GuestContact from "./GuestContact";

import { getCart, type CartResponse } from "@/api/cartPageApi";
import {
  getCustomerAddresses,
  type CustomerAddressesResponse,
} from "@/api/ProfilePageApi";
import {
  placeOrderAPI,
  placeGuestOrderAPI,
  type OrderData,
} from "@/api/orderApi";
import { setDefaultAddress, type Address } from "@/redux/userSlice";
import type { AppDispatch } from "@/redux/store";

export default function CheckoutPageClient() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Auth info from Redux
  const token = useSelector((state: RootState) => state.user.token);
  const customer = useSelector((state: RootState) => state.user.id);
  const user = useSelector((state: RootState) => state.user);
  const localCart = useSelector((state: RootState) => state.cart);

  // State
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string>("");

  // Guest checkout state
  const [guestEmail, setGuestEmail] = useState("");
  const [guestEmailError, setGuestEmailError] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "Maharashtra",
    zipcode: "",
    country: "India",
    phone: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "Maharashtra",
    zipcode: "",
    country: "India",
  });
  const [billingSame, setBillingSame] = useState(true);

  // Address state for logged in user
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] =
    useState<Address | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormType, setAddressFormType] = useState<
    "delivery" | "billing" | null
  >(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Pricing calculations
  const subtotal = localCart.cartItems.reduce(
    (sum, item) => sum + Number.parseFloat(item.price) * item.quantity,
    0
  );
  const deliveryCharges = 110;
  const taxPercentage = 10;
  const tax = subtotal / taxPercentage;
  const finalTotal = subtotal + tax + deliveryCharges;

  // Refs
  // (Assuming AddressSection already exposes validateShippingForm and validateBillingForm via forwardRef)
  const addressSectionRef = useRef<{
    validateShippingForm: () => Promise<boolean>;
    validateBillingForm: () => Promise<boolean>;
  }>(null);

  // Added ref for GuestContact to trigger email validation so error appears below email field.
  const guestContactRef = useRef<{ validate: () => boolean }>(null);

  // Fetch cart and addresses if logged in
  useEffect(() => {
    if (token && customer) {
      fetchCartData();
      fetchAddresses();
    }
  }, [token, customer]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!orderPlaced && localCart.cartItems.length === 0) {
      router.push("/shop");
    }
  }, [localCart.cartItems, orderPlaced, router]);
  

  // Update cart when items change
  useEffect(() => {
    if (token && customer) {
      fetchCartData();
    }
  }, [token, customer]);

  const fetchCartData = async () => {
    try {
      if (!customer || !token) return;
      const data = await getCart(customer, token);
      setCartData(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Error fetching cart data.");
    }
  };

  const fetchAddresses = async () => {
    try {
      if (!customer || !token) return;
      const response: CustomerAddressesResponse = await getCustomerAddresses(
        customer,
        token
      );
      setAddresses(response.addresses);

      // Set default addresses if available
      const defaultDelivery = response.addresses.find(
        (addr) =>
          addr.type.toLowerCase().includes("delivery") && addr.is_selected
      );
      const defaultBilling = response.addresses.find(
        (addr) =>
          addr.type.toLowerCase().includes("billing") && addr.is_selected
      );

      if (defaultDelivery) setSelectedDeliveryAddress(defaultDelivery);
      if (defaultBilling) setSelectedBillingAddress(defaultBilling);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Error fetching addresses.");
    }
  };

  const handleRazorpayPayment = () => {
    return new Promise<string>((resolve, reject) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(finalTotal * 100), // Convert to paisa and ensure it's an integer
        currency: "INR",
        name: "Med'Z pharmacy",
        description: "Payment for Order",
        handler: (response: any) => {
          if (response.razorpay_payment_id) {
            resolve(response.razorpay_payment_id);
          } else {
            reject(new Error("Payment failed"));
          }
        },
        prefill: {
          name:
            token && selectedDeliveryAddress
              ? user.first_name
              : shippingAddress.fullName,
          email:
            token && selectedDeliveryAddress
              ? user.email
              : guestEmail || "guestUser@gmail.com",
          contact:
            token && selectedDeliveryAddress
              ? user.phone_number
              : shippingAddress.phone,
        },
        theme: {
          color: "#24A148",
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled"));
          },
        },
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        reject(error);
      }
    });
  };

  const validateGuestAddresses = async () => {
    if (!addressSectionRef.current) return false;
    try {
      const shippingValid =
        await addressSectionRef.current.validateShippingForm();
      const billingValid =
        await addressSectionRef.current.validateBillingForm();
      return shippingValid && billingValid;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  const handlePlaceOrder = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    // For guest users, validate email and address forms before placing order
    if (!token) {
      // Trigger email validation so error message appears below the email field if invalid
      const isEmailValid = guestContactRef.current?.validate();
      const areAddressesValid = await validateGuestAddresses();
      if (!isEmailValid || !areAddressesValid) {
        setIsLoading(false);
        return;
      }
    } else {
      // For logged-in users, ensure both addresses are selected
      if (!selectedDeliveryAddress || !selectedBillingAddress) {
        toast.error("Please select both a delivery and a billing address.");
        setIsLoading(false);
        return;
      }
    }

    // Validate cart
    const cartItems =
      token && cartData ? cartData.products : localCart.cartItems;
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!");
      setIsLoading(false);
      return;
    }

    let paymentId = "";
    if (paymentMethod === "Online") {
      try {
        paymentId = await handleRazorpayPayment();
        setRazorpayPaymentId(paymentId);
      } catch (error) {
        console.error("Payment failed:", error);
        toast.error("Payment failed or was cancelled. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    if (token) {
      const orderPayload: OrderData = {
        sub_total: subtotal,
        tax: tax,
        delivery_charge: deliveryCharges,
        discount: 0,
        final_total: finalTotal,
        is_payment_done: paymentMethod === "Online",
        payment_transaction_id: paymentMethod === "Online" ? paymentId : "",
        payment_type: paymentMethod,
        payment_datetime: new Date().toISOString(),
        billing_address: selectedBillingAddress
          ? `${selectedBillingAddress.address}, ${selectedBillingAddress.locality}, ${selectedBillingAddress.city}, ${selectedBillingAddress.state} ${selectedBillingAddress.zipcode}, ${selectedBillingAddress.country}`
          : "",
        delivery_address: selectedDeliveryAddress
          ? `${selectedDeliveryAddress.address}, ${selectedDeliveryAddress.locality}, ${selectedDeliveryAddress.city}, ${selectedDeliveryAddress.state} ${selectedDeliveryAddress.zipcode}, ${selectedDeliveryAddress.country}`
          : "",
        products: (token && cartData
          ? cartData.products
          : localCart.cartItems
        ).map((item) => ({
          product_id: Number(item.id),
          unit_price: Number.parseFloat(item.price),
          quantity: item.quantity,
        })),
      };

      try {
        const orderResponse = await placeOrderAPI(orderPayload, token);
        toast.success(orderResponse.message);

        if (orderResponse.message === "Order placed successfully") {
          setOrderPlaced(true);
          dispatch(clearCart());
          router.push(`/thankyou?orderId=${orderResponse.order_id}`);
        } else {
          toast.success("Order placed successfully! (Demo)");
        }
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Error placing order. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      const guestOrderPayload = {
        username: "guest",
        first_name: shippingAddress.fullName.split(" ")[0] || "Guest",
        last_name: shippingAddress.fullName.split(" ")[1] || "User",
        email: guestEmail,
        phone: shippingAddress.phone,
        sub_total: subtotal,
        tax: tax,
        discount: 0,
        delivery_charge: deliveryCharges,
        final_total: finalTotal,
        is_payment_done: paymentMethod === "Online",
        payment_transaction_id: paymentMethod === "Online" ? paymentId : "",
        payment_type: paymentMethod,
        payment_datetime: new Date().toISOString(),
        billing_address: billingSame
          ? {
              type: "Billing address",
              address: shippingAddress.address,
              locality: "",
              city: shippingAddress.city,
              state: shippingAddress.state,
              country: shippingAddress.country,
              zipcode: shippingAddress.zipcode,
            }
          : {
              type: "Billing address",
              address: billingAddress.address,
              locality: "",
              city: billingAddress.city,
              state: billingAddress.state,
              country: billingAddress.country,
              zipcode: billingAddress.zipcode,
            },
        delivery_address: {
          type: "Delivery address",
          address: shippingAddress.address,
          locality: "",
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country,
          zipcode: shippingAddress.zipcode,
        },
        products: localCart.cartItems.map((item) => ({
          product_id: Number(item.id),
          unit_price: Number.parseFloat(item.price),
          quantity: item.quantity,
        })),
      };

      try {
        const orderResponse = await placeGuestOrderAPI(guestOrderPayload);
        toast.success(orderResponse.message);

        if (orderResponse.message === "Order placed successfully") {
          setOrderPlaced(true);
          dispatch(clearCart());
          router.push(`/thankyou?orderId=${orderResponse.order_id}`);
        } else {
          toast.success("Order placed successfully! (Demo)");
        }
      } catch (error) {
        console.error("Error placing guest order:", error);
        toast.error("Error placing order. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleShop = () => {
    router.push("/shop");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {isLoading && <CheckoutLoadingOverlay />}
      <h1 className="text-3xl font-bold mb-6">You're almost there...!</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section: Address Details */}
        <div className="w-full md:w-7/12 space-y-6">
          {/* For guest users, render the GuestContact component */}
          {!token && (
            <GuestContact
              ref={guestContactRef}
              guestEmail={guestEmail}
              setGuestEmail={setGuestEmail}
              error={guestEmailError}
              setError={setGuestEmailError}
            />
          )}
          <AddressSection
            ref={addressSectionRef}
            token={token}
            addresses={addresses}
            selectedDeliveryAddress={selectedDeliveryAddress}
            selectedBillingAddress={selectedBillingAddress}
            setSelectedDeliveryAddress={setSelectedDeliveryAddress}
            setSelectedBillingAddress={setSelectedBillingAddress}
            showAddressForm={showAddressForm}
            setShowAddressForm={setShowAddressForm}
            addressFormType={addressFormType}
            setAddressFormType={setAddressFormType}
            editingAddress={editingAddress}
            setEditingAddress={setEditingAddress}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            billingSame={billingSame}
            setBillingSame={setBillingSame}
            customer={customer}
            fetchAddresses={fetchAddresses}
            dispatch={dispatch}
            setDefaultAddress={setDefaultAddress}
          />
        </div>

        {/* Right Section: Cart & Payment Summary */}
        <div className="w-full md:w-5/12 space-y-6">
          <CartSummarySection
            token={token}
            cartData={cartData}
            localCart={localCart}
            customer={customer}
            handleShop={handleShop}
          />

          <OrderSummarySection
            subtotal={subtotal}
            tax={tax}
            deliveryCharges={deliveryCharges}
            finalTotal={finalTotal}
          />

          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            finalTotal={finalTotal}
          />

          <div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[--mainColor] border border-[--mainColor] text-white p-4 rounded hover:bg-white hover:text-[--mainColor] transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
