"use client"
import { toast } from "react-toastify"
import AddressForm from "@/components/ClientSideComponent/ProfilePageComponent/AddressForm"
import type { Address } from "@/redux/userSlice"
import type { AppDispatch } from "@/redux/store"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { useForm, Controller } from "react-hook-form"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"

interface MyCountryData {
  dialCode?: string
}

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

// Update the AddressSectionRef interface to accept Promise<boolean> return types
export interface AddressSectionRef {
  validateShippingForm: () => Promise<boolean>
  validateBillingForm: () => Promise<boolean>
}

const AddressSection = forwardRef<AddressSectionRef, AddressSectionProps>(
  (
    {
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
    },
    ref,
  ) => {
    // State for phone country code
    const [selectedDialCode, setSelectedDialCode] = useState("+91")

    // Form validation for shipping address
    const {
      register: registerShipping,
      formState: { errors: shippingErrors },
      setValue: setShippingValue,
      watch: watchShipping,
      control: shippingControl,
      trigger: triggerShipping,
    } = useForm({
      defaultValues: {
        fullName: shippingAddress.fullName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country || "India",
        zipcode: shippingAddress.zipcode,
        phone: shippingAddress.phone,
        country_code_for_phone_number: "+91",
      },
      mode: "onChange",
    })

    // Form validation for billing address
    const {
      register: registerBilling,
      formState: { errors: billingErrors },
      setValue: setBillingValue,
      watch: watchBilling,
      control: billingControl,
      trigger: triggerBilling,
    } = useForm({
      defaultValues: {
        fullName: billingAddress.fullName,
        address: billingAddress.address,
        city: billingAddress.city,
        state: billingAddress.state,
        country: billingAddress.country || "India",
        zipcode: billingAddress.zipcode,
      },
      mode: "onChange",
    })

    // Expose validation functions to parent component
    useImperativeHandle(ref, () => ({
      validateShippingForm: async () => {
        const result = await triggerShipping()
        return result
      },
      validateBillingForm: async () => {
        if (billingSame) return true
        const result = await triggerBilling()
        return result
      },
    }))

    // Watch country fields for state dropdowns
    const selectedShippingCountry = watchShipping("country", "India")
    const selectedBillingCountry = watchBilling("country", "India")

    // Update parent component state when form values change
    useEffect(() => {
      const subscription = watchShipping((value, { name }) => {
        if (name) {
          setShippingAddress({
            ...shippingAddress,
            [name]: value[name],
          })
        }
      })
      return () => subscription.unsubscribe()
    }, [watchShipping, setShippingAddress, shippingAddress])

    useEffect(() => {
      const subscription = watchBilling((value, { name }) => {
        if (name) {
          setBillingAddress({
            ...billingAddress,
            [name]: value[name],
          })
        }
      })
      return () => subscription.unsubscribe()
    }, [watchBilling, setBillingAddress, billingAddress])

    return (
      <div className="border rounded space-y-3">
        <h2 className="text-xl lg:text-2xl font-semibold bg-[--mainColor] text-white p-4">Delivery & Billing Details</h2>

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
                        selectedBillingAddress && selectedBillingAddress.id === addr.id
                          ? "border-blue-500 shadow-md"
                          : ""
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
              <div className="space-y-4 guest-delivery-address">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...registerShipping("fullName", { required: "Full Name is required" })}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                      shippingErrors.fullName ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      setShippingValue("fullName", e.target.value)
                      setShippingAddress({
                        ...shippingAddress,
                        fullName: e.target.value,
                      })
                    }}
                  />
                  {shippingErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{shippingErrors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Street"
                    {...registerShipping("address", { required: "Street address is required" })}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                      shippingErrors.address ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      setShippingValue("address", e.target.value)
                      setShippingAddress({
                        ...shippingAddress,
                        address: e.target.value,
                      })
                    }}
                  />
                  {shippingErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{shippingErrors.address.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="City"
                    {...registerShipping("city", { required: "City is required" })}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                      shippingErrors.city ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      setShippingValue("city", e.target.value)
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }}
                  />
                  {shippingErrors.city && <p className="text-red-500 text-sm mt-1">{shippingErrors.city.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Country Dropdown */}
                  <div className="select-address">
                    <Controller
                      control={shippingControl}
                      name="country"
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <CountryDropdown
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val)
                            setShippingAddress({
                              ...shippingAddress,
                              country: val,
                            })
                          }}
                          className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                            shippingErrors.country ? "border-red-500" : ""
                          }`}
                          defaultOptionLabel="Select Country"
                        />
                      )}
                    />
                    {shippingErrors.country && (
                      <p className="text-red-500 text-sm mt-1">{shippingErrors.country.message}</p>
                    )}
                  </div>

                  {/* State Dropdown */}
                  <div className="select-address">
                    <Controller
                      control={shippingControl}
                      name="state"
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <RegionDropdown
                          country={selectedShippingCountry}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val)
                            setShippingAddress({
                              ...shippingAddress,
                              state: val,
                            })
                          }}
                          className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                            shippingErrors.state ? "border-red-500" : ""
                          }`}
                          defaultOptionLabel="Select State"
                        />
                      )}
                    />
                    {shippingErrors.state && (
                      <p className="text-red-500 text-sm mt-1">{shippingErrors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Zipcode"
                      {...registerShipping("zipcode", {
                        required: "Zipcode is required",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Zip code must contain only numbers",
                        },
                        validate: (value) => /^\d{6}$/.test(value) || "Zip code must contian exactly 6 digits",
                      })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                        shippingErrors.zipcode ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        const value = e.target.value
                        // Only update if the value contains only numbers or is empty
                        if (/^[0-9]*$/.test(value)) {
                          setShippingValue("zipcode", value)
                          setShippingAddress({
                            ...shippingAddress,
                            zipcode: value,
                          })
                        }
                      }}
                    />
                    {shippingErrors.zipcode && (
                      <p className="text-red-500 text-sm mt-1">{shippingErrors.zipcode.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone Number with Country Code */}
                <div className="flex gap-2 items-start">
                  <div className="w-4/12 md:w-2/12 country-code">
                    <PhoneInput
                      country={"in"}
                      value={selectedDialCode}
                      onChange={(value, country) => {
                        const dial = (country as MyCountryData).dialCode || ""
                        const dialWithPlus = dial ? `+${dial}` : ""
                        setSelectedDialCode(dialWithPlus)
                        setShippingValue("country_code_for_phone_number", dialWithPlus)
                      }}
                      inputProps={{ readOnly: true }}
                      containerStyle={{ width: "100%" }}
                      inputStyle={{ width: "100%" }}
                      buttonStyle={{ border: "none" }}
                    />
                  </div>
                  <div className="w-8/12 md:w-10/12">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      {...registerShipping("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Mobile number must be numeric and exactly 10 digits",
                        },
                        validate: (value) =>
                          /^\d{10}$/.test(value) || "Mobile number must be numeric and exactly 10 digits",
                      })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                        shippingErrors.phone ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        const value = e.target.value
                        // Only update if the value contains only numbers or is empty
                        if (/^[0-9]*$/.test(value)) {
                          setShippingValue("phone", value)
                          setShippingAddress({
                            ...shippingAddress,
                            phone: value,
                          })
                        }
                      }}
                      maxLength={10}
                    />
                    {shippingErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{shippingErrors.phone.message}</p>
                    )}
                  </div>
                </div>
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
                <div className="space-y-4 mt-4 guest-billing-address">
                  <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">Enter Billing Address</h3>
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...registerBilling("fullName", { required: "Full Name is required" })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                        billingErrors.fullName ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setBillingValue("fullName", e.target.value)
                        setBillingAddress({
                          ...billingAddress,
                          fullName: e.target.value,
                        })
                      }}
                    />
                    {billingErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{billingErrors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Street"
                      {...registerBilling("address", { required: "Street address is required" })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                        billingErrors.address ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setBillingValue("address", e.target.value)
                        setBillingAddress({
                          ...billingAddress,
                          address: e.target.value,
                        })
                      }}
                    />
                    {billingErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{billingErrors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      {...registerBilling("city", { required: "City is required" })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                        billingErrors.city ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setBillingValue("city", e.target.value)
                        setBillingAddress({
                          ...billingAddress,
                          city: e.target.value,
                        })
                      }}
                    />
                    {billingErrors.city && <p className="text-red-500 text-sm mt-1">{billingErrors.city.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Country Dropdown */}
                    <div className="select-address">
                      <Controller
                        control={billingControl}
                        name="country"
                        rules={{ required: "Country is required" }}
                        render={({ field }) => (
                          <CountryDropdown
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val)
                              setBillingAddress({
                                ...billingAddress,
                                country: val,
                              })
                            }}
                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                              billingErrors.country ? "border-red-500" : ""
                            }`}
                            defaultOptionLabel="Select Country"
                          />
                        )}
                      />
                      {billingErrors.country && (
                        <p className="text-red-500 text-sm mt-1">{billingErrors.country.message}</p>
                      )}
                    </div>

                    {/* State Dropdown */}
                    <div className="select-address">
                      <Controller
                        control={billingControl}
                        name="state"
                        rules={{ required: "State is required" }}
                        render={({ field }) => (
                          <RegionDropdown
                            country={selectedBillingCountry}
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val)
                              setBillingAddress({
                                ...billingAddress,
                                state: val,
                              })
                            }}
                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                              billingErrors.state ? "border-red-500" : ""
                            }`}
                            defaultOptionLabel="Select State"
                          />
                        )}
                      />
                      {billingErrors.state && (
                        <p className="text-red-500 text-sm mt-1">{billingErrors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Zipcode"
                        {...registerBilling("zipcode", {
                          required: "Zipcode is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Zip code must contain only numbers",
                          },
                          validate: (value) => /^\d{6}$/.test(value) || "Zip code must contain exactly 6 digits",
                        })}
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 text-black ${
                          billingErrors.zipcode ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          const value = e.target.value
                          // Only update if the value contains only numbers or is empty
                          if (/^[0-9]*$/.test(value)) {
                            setBillingValue("zipcode", value)
                            setBillingAddress({
                              ...billingAddress,
                              zipcode: value,
                            })
                          }
                        }}
                      />
                      {billingErrors.zipcode && (
                        <p className="text-red-500 text-sm mt-1">{billingErrors.zipcode.message}</p>
                      )}
                    </div>
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
  },
)

// Add display name for the forwardRef component
AddressSection.displayName = "AddressSection"

export default AddressSection

