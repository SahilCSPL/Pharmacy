"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  type Address,
  removeAddress,
  setDefaultAddress,
} from "@/redux/userSlice";
import AddressForm from "./AddressForm";
import { deleteAddress } from "@/api/ProfilePageApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddressInfoTabs() {
  // Get all addresses from Redux store
  const addresses: Address[] = useSelector(
    (state: RootState) => state.user.addresses
  );

  const token = useSelector((state: RootState) => state.user.token);
  const customer = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();

  // Default to "Delivery" tab for priority
  const [activeTab, setActiveTab] = useState<"Delivery" | "Billing">(
    "Delivery"
  );

  // Local state to show/hide the AddressForm
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Filter addresses by type (using case-insensitive check)
  const billingAddresses = addresses.filter((addr) =>
    addr.type.toLowerCase().includes("billing")
  );
  const deliveryAddresses = addresses.filter((addr) =>
    addr.type.toLowerCase().includes("delivery")
  );

  // Based on active tab, pick the corresponding addresses
  const activeAddresses =
    activeTab === "Delivery" ? deliveryAddresses : billingAddresses;

  // Sort activeAddresses so default addresses appear at the top
  const sortedActiveAddresses = [...activeAddresses].sort((a, b) => {
    if (a.is_selected && !b.is_selected) return -1;
    if (!a.is_selected && b.is_selected) return 1;
    return 0;
  });

  // A function to render a single address card.
  // totalCount is the number of addresses for that category.
  const renderAddressCard = (address: Address, totalCount: number) => {
    return (
      <div
        key={address.id}
        className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition relative flex flex-col justify-between h-[250px]"
      >
        {/* "Default" badge */}
        {address.is_selected && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
            Selected
          </span>
        )}
        <div className="mt-4">
          <p className="font-bold">{address.address}</p>
          <p>{address.locality}</p>
          <p>
            {address.city}, {address.state} {address.zipcode}
          </p>
          <p>{address.country}</p>
        </div>
        {/* Action buttons */}
        <div className="mt-2 flex flex-wrap">
          <button
            onClick={() => setEditingAddress(address)}
            className="text-blue-600 hover:underline flex items-center space-x-1 text-sm pe-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Edit</span>
          </button>

          {!address.is_selected && sortedActiveAddresses.length > 1 && (
            <>
              <button
                onClick={async () => {
                  try {
                    const res = await deleteAddress(
                      address.id as number,
                      customer || 0,
                      token || ""
                    );
                    console.log("Delete response:", res);
                    toast.success(
                      res.message || "Address removed successfully!"
                    );
                    // Dispatch removeAddress to update Redux store immediately
                    dispatch(
                      removeAddress({ addressId: address.id as number })
                    );
                  } catch (error: any) {
                    console.error("Error removing address:", error);
                    toast.error(error.message || "Error removing address.");
                  }
                }}
                className="text-red-600 hover:underline flex items-center space-x-1 text-sm pe-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* Dustbin lid (cap) */}
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  {/* Trash can body */}
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  {/* Trash can inner lines */}
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>Remove</span>
              </button>

              <button
                onClick={() =>
                  dispatch(
                    setDefaultAddress({
                      addressId: address.id as number,
                      type: address.type,
                    })
                  )
                }
                className="text-green-600 hover:underline flex items-center space-x-1 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Select</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render the "Add New Address" card.
  const renderAddNewCard = () => {
    return (
      <div
        key="new"
        className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setShowAddressForm(true)}
      >
        <span className="text-2xl font-bold mb-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 1V15"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M1 8H15"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span>Add New Address</span>
      </div>
    );
  };

  return (
    <div className="">
      {/* Mobile Horizontal Tabs (visible on small screens) */}
      <div className="block md:hidden">
        <div className="flex border-b pb-2">
          <div
            onClick={() => setActiveTab("Delivery")}
            className={`flex-1 text-center p-2 cursor-pointer ${
              activeTab === "Delivery" ? "bg-gray-100 font-bold" : ""
            }`}
          >
            Delivery Address
          </div>
          <div
            onClick={() => setActiveTab("Billing")}
            className={`flex-1 text-center p-2 cursor-pointer ${
              activeTab === "Billing" ? "bg-gray-100 font-bold" : ""
            }`}
          >
            Billing Address
          </div>
        </div>
        <div className="p-4">
          {showAddressForm || editingAddress ? (
            <AddressForm
              addressType={
                activeTab === "Delivery"
                  ? "Delivery address"
                  : "Billing address"
              }
              customerId={customer || 0}
              createdBy={customer || 0}
              authToken={token || ""}
              onAddressAdded={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
              onClose={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
              editingAddress={editingAddress}
            />
          ) : sortedActiveAddresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderAddNewCard()}
              {sortedActiveAddresses.map((address) =>
                renderAddressCard(address, sortedActiveAddresses.length)
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {renderAddNewCard()}
              <p>No {activeTab} Addresses found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop/Tablet Vertical Tabs (visible on md and up) */}
      <div className="hidden md:flex">
        {/* Left vertical tabs */}
        <div className="w-1/4 border-r border-gray-200">
          <div
            onClick={() => setActiveTab("Delivery")}
            className={`p-4 cursor-pointer ${
              activeTab === "Delivery" ? "bg-gray-100 font-bold" : ""
            }`}
          >
            Delivery Address
          </div>
          <div
            onClick={() => setActiveTab("Billing")}
            className={`p-4 cursor-pointer ${
              activeTab === "Billing" ? "bg-gray-100 font-bold" : ""
            }`}
          >
            Billing Address
          </div>
        </div>
        {/* Right content area */}
        <div className="w-3/4 pb-4 pl-4">
          {showAddressForm || editingAddress ? (
            <AddressForm
              addressType={
                activeTab === "Delivery"
                  ? "Delivery address"
                  : "Billing address"
              }
              customerId={customer || 0}
              createdBy={customer || 0}
              authToken={token || ""}
              onAddressAdded={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
              onClose={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
              editingAddress={editingAddress}
            />
          ) : sortedActiveAddresses.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {renderAddNewCard()}
              {sortedActiveAddresses.map((address) =>
                renderAddressCard(address, sortedActiveAddresses.length)
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {renderAddNewCard()}
              <p className="col-span-2">No {activeTab} Addresses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
