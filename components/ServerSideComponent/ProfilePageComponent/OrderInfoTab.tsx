"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getAllOrderDetails,
  OrderDetail,
  OrderDetailsResponse,
} from "@/api/orderApi"; // Import types if necessary

export default function OrderInfoTab() {
  const user = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
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
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600">
                Order ID
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600">
                Status
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600">
                Items
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600">
                Final Total
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600">
                Date
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600">
                Payment Type
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b border-gray-200">{order.id}</td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {order.order_info.order_status}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {order.purchased_item_count}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(order.order_info.final_total)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {order.order_info.created_at_formatted}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {order.payment_info.payment_type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
