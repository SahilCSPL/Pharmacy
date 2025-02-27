"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getAllOrderDetails,
  OrderDetail,
  OrderDetailsResponse,
} from "@/api/orderApi";

export default function OrderInfoTab() {
  const user = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track expanded orders by their string IDs
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

  useEffect(() => {
    if (user.token && user.id) {
      getAllOrderDetails(1, 20, user.id, user.token)
        .then((data: OrderDetailsResponse) => {
          setOrders(data.results);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setError("Error fetching orders.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user.token, user.id]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading orders...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">{error}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Order Information
      </h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-[--mainColor]">
              <th className="py-3 px-4 border-b border-gray-200 text-left text-white">
                Order ID
              </th>
              <th className="hidden md:table-cell py-3 px-4 border-b border-gray-200 text-left text-white">
                Status
              </th>
              <th className="hidden md:table-cell py-3 px-4 border-b border-gray-200 text-left text-white">
                Final Total
              </th>
              <th className="hidden md:table-cell py-3 px-4 border-b border-gray-200 text-left text-white">
                Payment Type
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200">{order.id}</td>
                  <td className="hidden md:table-cell py-3 px-4 border-b border-gray-200">
                    {order.order_info.order_status}
                  </td>
                  <td className="hidden md:table-cell py-3 px-4 border-b border-gray-200">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(order.order_info.final_total)}
                  </td>
                  <td className="hidden md:table-cell py-3 px-4 border-b border-gray-200">
                    {order.payment_info.payment_type}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    <button
                      className="text-[--mainColor] hover:underline"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrderIds.includes(order.id)
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </td>
                </tr>
                {expandedOrderIds.includes(order.id) && (
                  <tr>
                    <td className="p-4 bg-gray-50" colSpan={5}>
                      <div className="space-y-4 p-4 bg-white rounded-md shadow-md border transition-all duration-300 ease-in-out">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-2/3">
                            <p className="pb-3">
                              <strong>Billing Address:<br/></strong>{" "}
                              {order.customer_info?.billing_address || "N/A"}
                            </p>
                            <p className="pb-3">
                              <strong>Delivery Address:<br/></strong>{" "}
                              {order.customer_info?.delivery_address || "N/A"}
                            </p>
                          </div>
                          <div className="w-full md:w-1/3">
                            <p className="pb-3">
                              <strong>Payment Method:<br/></strong>{" "}
                              {order.payment_info?.payment_type || "N/A"}
                            </p>
                          </div>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Items Purchased
                            </h3>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border border-gray-200">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="py-2 px-3 border-b">
                                      Product
                                    </th>
                                    <th className="py-2 px-3 border-b">
                                      Unit Price
                                    </th>
                                    <th className="py-2 px-3 border-b">
                                      Quantity
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item: any) => (
                                    <tr key={item.id} className="border-b">
                                      <td className="py-2 px-3">{item.name}</td>
                                      <td className="py-2 px-3 text-center">
                                        {new Intl.NumberFormat("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                        }).format(item.unit_price)}
                                      </td>
                                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
