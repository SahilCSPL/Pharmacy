"use client"
import { toast } from "react-toastify"
import AddressForm from "@/components/ClientSideComponent/ProfilePageComponent/AddressForm"
import type { Address } from "@/redux/userSlice"
import type { AppDispatch } from "@/redux/store"

interface AddressSectionProps {
  token: string | undefined
  addresses: Address[] | null
  selectedDeliveryAddress: Address | null
  selectedBillingAddress: Address | null
  setSelectedDeliveryAddress: (address: Address) => void
  setSelectedBillingAddress: (address: Address) => void
  showAddressForm: boolean
  setShowAddressForm: (show: boolean) => void
  addressFormType: "delivery" | "billing" | null
  setAddressFormType: (type: "delivery" | "billing" | null) => void
  editingAddress: Address | null
  setEditingAddress: (address: Address | null) => void
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    zipcode: string
    country: string
    phone: string
  }
  setShippingAddress: (address: any) => void
  billingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    zipcode: string
    country: string
  }
  setBillingAddress: (address: any) => void
  billingSame: boolean
  setBillingSame: (same: boolean) => void
  customer: number | undefined
  fetchAddresses: () => void
  dispatch: AppDispatch
  setDefaultAddress: any
}

export default function AddressSection({
  token,
  addresses,
  selectedDeliveryAddress,
  selectedBillingAddress,
  setSelectedDeliveryAddress,
  setSelectedBillingAddress,
  showAddressForm,
  setShowAddressForm,
  addressFormType,
  setAddressFormType,
  editingAddress,
  setEditingAddress,
  shippingAddress,
  setShippingAddress,
  billingAddress,
  setBillingAddress,
  billingSame,
  setBillingSame,
  customer,
  fetchAddresses,
  dispatch,
  setDefaultAddress,
}: AddressSectionProps) {
  return (
    <div className="border rounded space-y-3">
      <h2 className="text-2xl font-bold bg-[--mainColor] text-white p-4">Delivery & Billing Details</h2>

      {token && addresses ? (
        <div className="p-4">
          {/* Delivery Address Section */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">Delivery Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add Address Button */}
              <div
                onClick={() => {
                  setAddressFormType("delivery")
                  setEditingAddress(null)
                  setShowAddressForm(true)
                }}
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
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
                    <path d="M8 1V15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                    <path d="M1 8H15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Add Address</span>
              </div>

              {/* Delivery Addresses */}
              {addresses
                .filter((addr) => addr.type.toLowerCase().includes("delivery"))
                .map((addr) => (
                  <div
                    key={addr.id}
                    className={`border p-4 rounded relative cursor-pointer hover:shadow-lg transition ${
                      selectedDeliveryAddress && selectedDeliveryAddress.id === addr.id
                        ? "border-blue-500 shadow-md"
                        : ""
                    }`}
                  >
                    {selectedDeliveryAddress && selectedDeliveryAddress.id === addr.id && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                        Selected
                      </span>
                    )}
                    <p className="font-bold pt-3">{addr.address}</p>
                    <p className="font-bold">{addr.locality}</p>
                    <p>
                      {addr.city}, {addr.state} {addr.zipcode}
                    </p>
                    <p className="pb-3">{addr.country}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setAddressFormType("delivery")
                          setEditingAddress(addr)
                          setShowAddressForm(true)
                        }}
                        className="text-blue-600 text-xs border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDeliveryAddress(addr)
                          dispatch(
                            setDefaultAddress({
                              addressId: addr.id as number,
                              type: addr.type,
                            }),
                          )
                          toast.info("Delivery address selected")
                        }}
                        className="text-green-600 text-xs border border-green-600 px-2 py-1 rounded hover:bg-green-50"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add Address Button */}
              <div
                onClick={() => {
                  setAddressFormType("billing")
                  setEditingAddress(null)
                  setShowAddressForm(true)
                }}
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
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
                    <path d="M8 1V15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                    <path d="M1 8H15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Add Address</span>
              </div>

              {/* Billing Addresses */}
              {addresses
                .filter((addr) => addr.type.toLowerCase().includes("billing"))
                .map((addr) => (
                  <div
                    key={addr.id}
                    className={`border p-4 rounded relative cursor-pointer hover:shadow-lg transition ${
                      selectedBillingAddress && selectedBillingAddress.id === addr.id ? "border-blue-500 shadow-md" : ""
                    }`}
                  >
                    {selectedBillingAddress && selectedBillingAddress.id === addr.id && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                        Selected
                      </span>
                    )}
                    <p className="font-bold">{addr.address}</p>
                    <p className="font-bold">{addr.locality}</p>
                    <p>
                      {addr.city}, {addr.state} {addr.zipcode}
                    </p>
                    <p className="pb-3">{addr.country}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setAddressFormType("billing")
                          setEditingAddress(addr)
                          setShowAddressForm(true)
                        }}
                        className="text-blue-600 text-xs border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBillingAddress(addr)
                          dispatch(
                            setDefaultAddress({
                              addressId: addr.id as number,
                              type: addr.type,
                            }),
                          )
                          toast.info("Billing address selected")
                        }}
                        className="text-green-600 text-xs border border-green-600 px-2 py-1 rounded hover:bg-green-50"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        // Guest User Address Forms
        <div className="p-4 space-y-4">
          {/* Guest Shipping Address */}
          <div className="border p-4 rounded">
            <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">Enter Delivery Address</h3>
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

          {/* Guest Billing Address */}
          <div className="border p-4 rounded">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={billingSame}
                onChange={(e) => setBillingSame(e.target.checked)}
                className="mr-2"
              />
              <span>Billing address same as delivery</span>
            </label>

            {!billingSame && (
              <div className="space-y-2 mt-4">
                <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">Enter Billing Address</h3>
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
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressForm && addressFormType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-4 overflow-y-auto max-h-full lg:max-h-[90%]">
            <AddressForm
              addressType={addressFormType === "delivery" ? "Delivery address" : "Billing address"}
              customerId={customer || 0}
              createdBy={customer || 0}
              authToken={token || ""}
              onAddressAdded={() => {
                setShowAddressForm(false)
                setEditingAddress(null)
                fetchAddresses()
              }}
              onClose={() => {
                setShowAddressForm(false)
                setEditingAddress(null)
              }}
              editingAddress={editingAddress}
            />
          </div>
        </div>
      )}
    </div>
  )
}

