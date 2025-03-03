"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/cartSlice";

import AddressSection from "./address-section";
import CartSummarySection from "./cart-summary";
import OrderSummarySection from "./order-summary";
import PaymentMethodSection from "./payment-method";
import CheckoutLoadingOverlay from "./checkout-loading-overlay";

import { getCart, CartResponse } from "@/api/cartPageApi";
import {
  getCustomerAddresses,
  CustomerAddressesResponse,
} from "@/api/ProfilePageApi";
import { placeOrderAPI, OrderData } from "@/api/orderApi";
import { setDefaultAddress, type Address } from "@/redux/userSlice";
import { AppDispatch } from "@/redux/store";

export default function CheckoutPageClient() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Auth info from Redux
  const token = useSelector((state: RootState) => state.user.token);
  const customer = useSelector((state: RootState) => state.user.id);
  const localCart = useSelector((state: RootState) => state.cart);

  // State
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Address state
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] =
    useState<Address | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormType, setAddressFormType] = useState<
    "delivery" | "billing" | null
  >(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Guest checkout state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const [billingSame, setBillingSame] = useState(true);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Pricing calculations
  const subtotal = localCart.cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const deliveryCharges = 110;
  const taxPercentage = 10;
  const tax = subtotal / taxPercentage;
  const finalTotal = subtotal + tax + deliveryCharges;

  // Fetch cart and addresses if logged in
  useEffect(() => {
    if (token && customer) {
      fetchCartData();
      fetchAddresses();
    }
  }, [token, customer]);

  // Redirect if cart is empty
  useEffect(() => {
    if (token && !orderPlaced) {
      if (!cartData) return;
      if (localCart.cartItems.length === 0) {
        router.push("/shop");
      }
    }
  }, [token, cartData, localCart.cartItems, orderPlaced, router]);

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

  useEffect(() => {
    if (token && customer) {
      const updateCart = async () => {
        try {
          const data = await getCart(customer, token);
          setCartData(data);
        } catch (error) {
          console.error("Error updating cart:", error);
          toast.error("Error updating cart data.");
        }
      };
      updateCart();
    }
  }, [localCart.cartItems, token, customer]);

  const handlePlaceOrder = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate cart
    const cartItems =
      token && cartData ? cartData.products : localCart.cartItems;
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Validate addresses
    if (token) {
      if (!addresses || addresses.length === 0) {
        toast.error("No addresses found. Please add an address.");
        return;
      }
      if (!selectedDeliveryAddress || !selectedBillingAddress) {
        toast.error("Please select both delivery and billing addresses.");
        return;
      }
    } else {
      // Validate guest shipping address
      if (
        !shippingAddress.fullName ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.zipcode ||
        !shippingAddress.country ||
        !shippingAddress.phone
      ) {
        toast.error("Please fill in your shipping address.");
        return;
      }

      // Validate guest billing address if different
      if (!billingSame) {
        if (
          !billingAddress.fullName ||
          !billingAddress.address ||
          !billingAddress.city ||
          !billingAddress.state ||
          !billingAddress.zipcode ||
          !billingAddress.country
        ) {
          toast.error("Please fill in your billing address.");
          return;
        }
      }
    }

    // Build order payload
    const orderPayload: OrderData = {
      sub_total: subtotal,
      tax: tax,
      delivery_charge: deliveryCharges,
      discount: 0,
      final_total: finalTotal,
      is_payment_done: paymentMethod === "online" ? true : false,
      payment_transaction_id: paymentMethod === "online" ? "TXN123" : "",
      payment_type: paymentMethod,
      payment_datetime: new Date().toISOString(),
      billing_address:
        token && selectedBillingAddress
          ? `${selectedBillingAddress.address}, ${selectedBillingAddress.locality},${selectedBillingAddress.city}, ${selectedBillingAddress.state} ${selectedBillingAddress.zipcode}, ${selectedBillingAddress.country}`
          : billingSame
          ? `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipcode}, ${shippingAddress.country}`
          : `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zipcode}, ${billingAddress.country}`,
      delivery_address:
        token && selectedDeliveryAddress
          ? `${selectedDeliveryAddress.address}, ${selectedDeliveryAddress.locality}, ${selectedDeliveryAddress.city}, ${selectedDeliveryAddress.state} ${selectedDeliveryAddress.zipcode}, ${selectedDeliveryAddress.country}`
          : `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipcode}, ${shippingAddress.country} - ${shippingAddress.phone}`,
      products: (token && cartData
        ? cartData.products
        : localCart.cartItems
      ).map((item) => ({
        product_id: Number(item.id),
        unit_price: parseFloat(item.price),
        quantity: item.quantity,
      })),
    };

    // Place order
    try {
      const orderResponse = await placeOrderAPI(orderPayload, token || "");
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
        <div className="w-full md:w-2/3">
          <AddressSection
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
        <div className="w-full md:w-1/3 space-y-6">
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
