import type React from "react"
import AddressForm from "@/components/ClientSideComponent/ProfilePageComponent/AddressForm"

interface AddressFormModalProps {
  showAddressForm: boolean
  addressFormType: "delivery" | "billing" | null
  customer?: number
  token?: string
  onClose: () => void
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  showAddressForm,
  addressFormType,
  customer,
  token,
  onClose,
}) => {
  if (!showAddressForm || !addressFormType) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <AddressForm
          addressType={addressFormType === "delivery" ? "Delivery address" : "Billing address"}
          customerId={customer || 0}
          createdBy={customer || 0}
          authToken={token || ""}
          onAddressAdded={onClose}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

export default AddressFormModal

