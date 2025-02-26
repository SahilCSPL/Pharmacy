import type React from "react"
import type { Address } from "@/redux/userSlice"
import { toast } from "react-toastify"

interface AddressSectionProps {
  addresses: Address[] | null
  selectedAddress: Address | null
  setSelectedAddress: (address: Address) => void
  setDefaultAddress: (payload: { addressId: number; type: string }) => void
  addressType: "delivery" | "billing"
  setShowAddressForm: (show: boolean) => void
  setAddressFormType: (type: "delivery" | "billing") => void
}

const AddressSection: React.FC<AddressSectionProps> = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  setDefaultAddress,
  addressType,
  setShowAddressForm,
  setAddressFormType,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2 text-[--mainColor]">
        {addressType === "delivery" ? "Delivery Address" : "Billing Address"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => {
            setAddressFormType(addressType)
            setShowAddressForm(true)
          }}
          className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
        >
          <span className="text-2xl font-bold mb-2">
            <i className="fas fa-plus"></i>
          </span>
          <span>Add Address</span>
        </div>
        {addresses
          ?.filter((addr) => addr.type.toLowerCase().includes(addressType))
          .map((addr) => (
            <div key={addr.id} className="border p-4 rounded relative cursor-pointer hover:shadow-lg transition">
              {selectedAddress && selectedAddress.id === addr.id && (
                <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">Selected</span>
              )}
              <p className="font-bold pt-3">{addr.address}</p>
              <p className="font-bold">{addr.locality}</p>
              <p>
                {addr.city}, {addr.state} {addr.zipcode}
              </p>
              <p className="pb-3">{addr.country}</p>

              <div className="flex gap-1">
                <button className="text-blue-600 text-xs">Edit</button>
                <button
                  onClick={() => {
                    setSelectedAddress(addr)
                    setDefaultAddress({
                      addressId: addr.id as number,
                      type: addr.type,
                    })
                    toast.info(`${addressType} address selected`)
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
  )
}

export default AddressSection

