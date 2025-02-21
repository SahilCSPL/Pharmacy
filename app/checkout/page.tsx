"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import {
  getCart,
  CartResponse,
  addOrUpdateCart,
  deleteCart,
} from "@/api/cartPageApi";
import {
  getCustomerAddresses,
  CustomerAddressesResponse,
} from "@/api/ProfilePageApi";
import { setDefaultAddress, Address } from "@/redux/userSlice";
import { updateCartItem, removeFromCart } from "@/redux/cartSlice";
import { OrderData, placeOrderAPI } from "@/api/orderApi";
import AddressForm from "@/components/ClientSideComponent/ProfilePageComponent/AddressForm";
import CartProductsSummary from "@/components/ClientSideComponent/CartComponent/CartSummery";

const CheckoutPage = () => {
  // Auth info from Redux
  const token = useSelector((state: RootState) => state.user.token);
  const customer = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();

  // For logged-in users: fetched cart and addresses
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);

  // For guest users: local address forms
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
  const [billingSame, setBillingSame] = useState<boolean>(true);

  // Payment method state (default "cod")
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Local state for selected addresses (for logged in users)
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] =
    useState<Address | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<Address | null>(null);

  // Local state to show AddressForm modal
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [addressFormType, setAddressFormType] = useState<
    "delivery" | "billing" | null
  >(null);

  // For guest users, we assume cart details come from the Redux cart slice
  const localCart = useSelector((state: RootState) => state.cart);

  // Fetch cart and addresses if logged in
  useEffect(() => {
    if (token && customer) {
      const fetchCart = async () => {
        try {
          const data = await getCart(customer, token);
          setCartData(data);
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast.error("Error fetching cart data.");
        }
      };
      const fetchAddresses = async () => {
        try {
          const response: CustomerAddressesResponse =
            await getCustomerAddresses(customer, token);
          setAddresses(response.addresses);
          // Pre-select default addresses if available:
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
      fetchCart();
      fetchAddresses();
    }
  }, [token, customer]);

  // Calculate cart subtotal
  const subtotal =
    token && cartData
      ? cartData.products.reduce(
          (sum, item) => sum + parseFloat(item.price) * item.quantity,
          0
        )
      : localCart.cartItems.reduce(
          (sum, item) => sum + parseFloat(item.price) * item.quantity,
          0
        );

  // --- Order Placement Handler ---
  const handlePlaceOrder = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const cartItems =
      token && cartData ? cartData.products : localCart.cartItems;
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
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

    // Build order payload according to your API requirements.
    const orderPayload: OrderData = {
      sub_total: subtotal,
      tax: 10,
      delivery_charge: 10,
      discount: 0,
      final_total: subtotal,
      is_payment_done: paymentMethod === "online" ? true : false,
      payment_transaction_id: paymentMethod === "online" ? "TXN123" : "",
      payment_type: paymentMethod === "Cash on Delivery" ? "Cash on Delivery" : "Online",
      payment_datetime: new Date().toISOString(),
      billing_address: token
        ? `${selectedBillingAddress?.address}, ${selectedBillingAddress?.city}, ${selectedBillingAddress?.state} ${selectedBillingAddress?.zipcode}, ${selectedBillingAddress?.country}`
        : billingSame
        ? `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipcode}, ${shippingAddress.country}`
        : `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zipcode}, ${billingAddress.country}`,
      delivery_address: token
        ? `${selectedDeliveryAddress?.address}, ${selectedDeliveryAddress?.city}, ${selectedDeliveryAddress?.state} ${selectedDeliveryAddress?.zipcode}, ${selectedDeliveryAddress?.country}`
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

    console.log("Placing order with payload:", orderPayload);
    try {
      if (token) {
        const orderResponse = await placeOrderAPI(orderPayload, token);
        toast.success(orderResponse.message);
      } else {
        toast.success("Order placed successfully! (Demo)");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section: Address Details */}
        <div className="w-full md:w-2/3 border p-4 rounded space-y-6">
          <h2 className="text-2xl font-bold">Delivery & Billing Details</h2>
          {token && addresses ? (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-2">Delivery Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Add Address Option */}
                  <div
                    onClick={() => {
                      setAddressFormType("delivery");
                      setShowAddressForm(true);
                    }}
                    className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <span className="text-2xl font-bold mb-2">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>Add Address</span>
                  </div>
                  {addresses
                    .filter((addr) =>
                      addr.type.toLowerCase().includes("delivery")
                    )
                    .map((addr) => (
                      <div
                        key={addr.id}
                        className="border p-4 rounded relative cursor-pointer hover:shadow-lg transition"
                      >
                        {selectedDeliveryAddress &&
                          selectedDeliveryAddress.id === addr.id && (
                            <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">
                              Selected
                            </span>
                          )}
                        <p className="font-bold pt-3">{addr.address}</p>
                        <p className="font-bold">{addr.locality}</p>
                        <p>
                          {addr.city}, {addr.state} {addr.zipcode}
                        </p>
                        <p className="pb-3">{addr.country}</p>

                        <div className="flex gap-1">
                          <button className="text-blue-600 text-xs">
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDeliveryAddress(addr);
                              dispatch(
                                setDefaultAddress({
                                  addressId: addr.id as number,
                                  type: addr.type,
                                })
                              );
                              toast.info("Delivery address selected");
                            }}
                            className="text-green-600 hover:underline text-xs"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Billing Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Add Address Option */}
                  <div
                    onClick={() => {
                      setAddressFormType("billing");
                      setShowAddressForm(true);
                    }}
                    className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <span className="text-2xl font-bold mb-2">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>Add Address</span>
                  </div>
                  {addresses
                    .filter((addr) =>
                      addr.type.toLowerCase().includes("billing")
                    )
                    .map((addr) => (
                      <div
                        key={addr.id}
                        className="border p-4 rounded relative cursor-pointer hover:shadow-lg transition"
                      >
                        {selectedBillingAddress &&
                          selectedBillingAddress.id === addr.id && (
                            <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded absolute top-2 left-2">
                              Selected
                            </span>
                          )}
                        <p className="font-bold">{addr.address}</p>
                        <p className="font-bold">{addr.locality}</p>
                        <p>
                          {addr.city}, {addr.state} {addr.zipcode}
                        </p>
                        <p>{addr.country}</p>
                        <div className="flex gap-1 absolute top-2 right-2">
                          <button className="text-blue-600 text-xs">
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBillingAddress(addr);
                              dispatch(
                                setDefaultAddress({
                                  addressId: addr.id as number,
                                  type: addr.type,
                                })
                              );
                              toast.info("Billing address selected");
                            }}
                            className="text-green-600 hover:underline text-xs"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* For guest users, show address forms */}
              <div className="border p-4 rounded">
                <h3 className="text-xl font-semibold mb-2">
                  Enter Delivery Address
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 border rounded"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      className="w-1/2 p-2 border rounded"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="w-1/2 p-2 border rounded"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Zipcode"
                      className="w-1/2 p-2 border rounded"
                      value={shippingAddress.zipcode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          zipcode: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      className="w-1/2 p-2 border rounded"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          country: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-2 border rounded"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="border p-4 rounded">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={billingSame}
                    onChange={(e) => setBillingSame(e.target.checked)}
                  />
                  <span className="ml-2">Billing address same as delivery</span>
                </label>
                {!billingSame && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold mb-2">
                      Enter Billing Address
                    </h3>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-2 border rounded"
                      value={billingAddress.fullName}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      className="w-full p-2 border rounded"
                      value={billingAddress.address}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          address: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-1/2 p-2 border rounded"
                        value={billingAddress.city}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        className="w-1/2 p-2 border rounded"
                        value={billingAddress.state}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            state: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Zipcode"
                        className="w-1/2 p-2 border rounded"
                        value={billingAddress.zipcode}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            zipcode: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        className="w-1/2 p-2 border rounded"
                        value={billingAddress.country}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            country: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Section: Cart & Payment Summary */}
        <div className="w-full md:w-1/3 border p-4 rounded space-y-6">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <div className="border p-4 rounded">
            {token && cartData ? (
              <CartProductsSummary
                cartItems={localCart.cartItems}
                token={token}
                customerId={customer}
              />
            ) : (
              <CartProductsSummary cartItems={localCart.cartItems} />
            )}
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Payment Method</h3>
            <div className="flex gap-4">
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
          <div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
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
              addressType={
                addressFormType === "delivery"
                  ? "Delivery address"
                  : "Billing address"
              }
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
  );
};

export default CheckoutPage;
