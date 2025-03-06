"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import {
  getOrderDetails,
  getGuestOrderDetails,
  OrderDetailsResponse,
} from "@/api/orderApi";
import orderPlaced from "@/public/animation/Animation - 1740397607990.json";
import Lottie from "lottie-react";
import Image from "next/image";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Get authentication info from Redux
  const token = useSelector((state: RootState) => state.user.token);
  const customer = useSelector((state: RootState) => state.user.id);

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // console.log("Order Id : ", orderId);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error("Order ID not provided.");
        setLoading(false);
        return;
      }
      try {
        let data: OrderDetailsResponse;
        // Check if token and customer exist for logged in user
        if (customer && token) {
          data = await getOrderDetails(1, 20, customer, token, orderId);
        } else {
          // Call guest order API if not logged in
          data = await getGuestOrderDetails(1, 20, orderId);
          // console.log("Order Details : ", data);
        }
        if (data.results && data.results.length > 0) {
          setOrderDetails(data.results[0]);
        } else {
          toast.error("No order details found.");
        }
      } catch (error) {
        toast.error("Error fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, customer, token]);

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }
  if (!orderDetails) {
    return (
      <div className="container mx-auto p-8">No order details available.</div>
    );
  }

  return (
    <div className="container mx-auto p-5 max-w-6xl space-y-6">
      <div className="animation-container flex justify-center">
        <Lottie
          animationData={orderPlaced}
          loop={false}
          autoplay={true}
          style={{ height: 200, width: 300 }}
        />
      </div>
      <h1 className="text-3xl font-bold text-center mb-4">
        Thank You for Your Order, {orderDetails.customer_info.first_name}
      </h1>
      <p className="mb-6 text-center">
        A confirmation mail will be sent to you at{" "}
        <strong>{orderDetails.customer_info.email}</strong> with your complete
        order details.
      </p>

      {/* Order Details Section */}
      <div className="border px-4 py-3 space-y-4">
        {/* Order Info Header */}
        <div className="border-b p-3 md:p-4 rounded flex flex-col md:flex-row justify-between">
          <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-0">
            Order Number: {orderDetails.id}
          </h3>
          <span className="hidden md:block text-base md:text-xl font-semibold">
            <strong>Total:</strong> ₹
            {orderDetails.order_info.final_total.toFixed(2)}
          </span>
        </div>

        {/* Addresses & Payment Details */}
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="order-details">
            <div className="mb-4">
              <div className="billing-address mb-2">
                <p>
                  <strong>Billing Address:</strong>
                </p>
                <p>{orderDetails.customer_info.billing_address}</p>
              </div>
              <div className="delivery-address">
                <p>
                  <strong>Delivery Address:</strong>
                </p>
                <p>{orderDetails.customer_info.delivery_address}</p>
              </div>
            </div>
            <div className="payment">
              <p>
                <strong>Payment Method:</strong>{" "}
                {orderDetails.payment_info.payment_type}
              </p>
            </div>
          </div>
          <div className="price-details md:items-end">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <tbody>
                  <tr className="border-b">
                    <td className="border px-2 py-1 font-semibold">
                      Subtotal:
                    </td>
                    <td className="border px-2 py-1 text-end">
                      ₹{orderDetails.order_info.sub_total.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border px-2 py-2 font-semibold">Tax:</td>
                    <td className="border px-2 py-2 text-end">
                      {orderDetails.order_info.tax.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border px-2 py-2 font-semibold">
                      Delivery Charge:
                    </td>
                    <td className="border px-2 py-2 text-end">
                      ₹{orderDetails.order_info.delivery_charge}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border px-2 py-2 font-semibold">
                      Discount:
                    </td>
                    <td className="border px-2 py-2 text-end">
                      {orderDetails.order_info.discount}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border px-2 py-2 font-semibold">Total:</td>
                    <td className="border px-2 py-2 text-end">
                      ₹{orderDetails.order_info.final_total.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border px-2 py-2 font-semibold">Status:</td>
                    <td className="border px-2 py-2 text-end">
                      {orderDetails.order_info.order_status}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-2 font-semibold">
                      Order Date:
                    </td>
                    <td className="border px-2 py-2 text-end">
                      {orderDetails.order_info.created_at_formatted}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Items Purchased */}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">
            Items Purchased
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Unit Price</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item: any) => (
                  <tr key={item.id} className="border-b">
                    <td className="border px-4 py-2">
                      <div className="flex items-center">
                        <div className="w-[100px]">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                            alt={item.name}
                            width={80}
                            height={80}
                          />
                        </div>
                        <p className="ml-2">{item.name}</p>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-end">
                      ₹{item.unit_price}
                    </td>
                    <td className="border px-4 py-2 text-end">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
