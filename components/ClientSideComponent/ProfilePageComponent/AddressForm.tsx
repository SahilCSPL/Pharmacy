"use client"

import { useState, type FormEvent, useEffect } from "react"
import { toast } from "react-toastify"
import { APICore } from "@/api/APICore"
import { useDispatch } from "react-redux"
import { addAddress, updateAddress } from "@/redux/userSlice"

interface AddressData {
  id?: number
  customer: number
  type: string
  address: string
  locality: string
  city: string
  state: string
  country: string
  zipcode: string
  is_selected: boolean
}

interface AddressFormProps {
  addressType: "Billing address" | "Delivery address"
  customerId: number
  createdBy: number
  authToken: string
  onAddressAdded?: () => void
  onClose?: () => void
  editingAddress?: AddressData | null
}

export default function AddressForm({
  addressType,
  customerId,
  createdBy,
  authToken,
  onAddressAdded,
  onClose,
  editingAddress,
}: AddressFormProps) {
  const [address, setAddress] = useState("")
  const [locality, setLocality] = useState("")
  const [city, setCity] = useState("")
  const [stateField, setStateField] = useState("")
  const [country, setCountry] = useState("")
  const [zipcode, setZipcode] = useState("")
  const [isSelected, setIsSelected] = useState(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (editingAddress) {
      setAddress(editingAddress.address)
      setLocality(editingAddress.locality)
      setCity(editingAddress.city)
      setStateField(editingAddress.state)
      setCountry(editingAddress.country)
      setZipcode(editingAddress.zipcode)
      setIsSelected(editingAddress.is_selected)
    }
  }, [editingAddress])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload: AddressData = {
      customer: customerId,
      type: addressType,
      address,
      locality,
      city,
      state: stateField,
      country,
      zipcode,
      is_selected: isSelected,
    }

    try {
      let res
      if (editingAddress) {
        res = await APICore<AddressData>(
          `/user/customer-address/${editingAddress.id}/?customer=${customerId}`,
          "PATCH",
          payload,
          authToken,
        )
        dispatch(updateAddress(res))
        toast.success("Address updated successfully!")
      } else {
        res = await APICore<AddressData>("/user/customer-address/", "POST", payload, authToken)
        dispatch(addAddress(res))
        toast.success("Address added successfully!")
      }

      if (onAddressAdded) onAddressAdded()
      if (onClose) onClose()
    } catch (error: any) {
      console.error("Error saving address:", error)
      toast.error(error.message || "Error saving address.")
    } finally {
      setLoading(false)
    }
  }

  // Common styling for inputs and buttons
  const inputClasses = "w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[--mainColor] mb-3"
  const submitButtonClasses = "bg-[--mainColor] text-white py-2 px-4 rounded-md hover:bg-[--mainHoverColor] transition"
  const cancelButtonClasses = "bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"

  // ... (keep existing JSX code, update button text)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{editingAddress ? "Edit Address" : addressType}</h3>
      <div>
        <label className="block text-sm mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClasses}
          placeholder="Enter address"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Locality</label>
        <input
          type="text"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className={inputClasses}
          placeholder="Enter locality"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={inputClasses}
          placeholder="Enter city"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">State</label>
        <input
          type="text"
          value={stateField}
          onChange={(e) => setStateField(e.target.value)}
          className={inputClasses}
          placeholder="Enter state"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={inputClasses}
          placeholder="Enter country"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Zipcode</label>
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          className={inputClasses}
          placeholder="Enter zipcode"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => setIsSelected(e.target.checked)}
          id="setDefault"
          className="form-checkbox"
        />
        <label htmlFor="setDefault" className="text-sm">
          Set as default
        </label>
      </div>
      <div className="flex space-x-4">
        <button type="submit" disabled={loading} className={submitButtonClasses}>
          {loading ? "Submitting..." : editingAddress ? "Update Address" : "Add Address"}
        </button>
        <button type="button" onClick={onClose} className={cancelButtonClasses}>
          Cancel
        </button>
      </div>
    </form>
  )
}

