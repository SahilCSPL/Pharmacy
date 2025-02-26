import type React from "react"

interface AddressFormProps {
  address: {
    fullName: string
    address: string
    city: string
    state: string
    zipcode: string
    country: string
    phone?: string
  }
  setAddress: React.Dispatch<
    React.SetStateAction<{
      fullName: string
      address: string
      city: string
      state: string
      zipcode: string
      country: string
      phone?: string
    }>
  >
  type: "shipping" | "billing"
}

const GuestAddressForm: React.FC<AddressFormProps> = ({ address, setAddress, type }) => {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-2 border rounded"
        value={address.fullName}
        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Address"
        className="w-full p-2 border rounded"
        value={address.address}
        onChange={(e) => setAddress({ ...address, address: e.target.value })}
        required
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="City"
          className="w-1/2 p-2 border rounded"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="State"
          className="w-1/2 p-2 border rounded"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Zipcode"
          className="w-1/2 p-2 border rounded"
          value={address.zipcode}
          onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Country"
          className="w-1/2 p-2 border rounded"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          required
        />
      </div>
      {type === "shipping" && (
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          required
        />
      )}
    </div>
  )
}

export default GuestAddressForm

