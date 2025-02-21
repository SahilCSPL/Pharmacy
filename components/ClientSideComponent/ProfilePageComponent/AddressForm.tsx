"use client";

import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { APICore } from "@/api/APICore";
import { useDispatch } from "react-redux";
import { addAddress } from "@/redux/userSlice";

interface NewAddressData {
  customer: number;
  type: string; // "Billing address" or "Delivery address"
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  created_by: number;
  is_selected: boolean;
}

interface AddressFormProps {
  // The type will be set by the parent component based on the active tab.
  addressType: "Billing address" | "Delivery address";
  // Customer id and created_by can be passed from Redux, for example.
  customerId: number;
  createdBy: number;
  // Authentication token from Redux (or any context)
  authToken: string;
  // A callback function to trigger a refresh of the address list once a new address is added
  onAddressAdded?: () => void;
  // A callback function to close the form (if using a modal or inline toggle)
  onClose?: () => void;
}

export default function AddressForm({
  addressType,
  customerId,
  createdBy,
  authToken,
  onAddressAdded,
  onClose,
}: AddressFormProps) {
  // Local state for each field
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Common styling for inputs and buttons
  const inputClasses =
    "w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[--mainColor] mb-3";
  const submitButtonClasses =
    "bg-[--mainColor] text-white py-2 px-4 rounded-md hover:bg-[--mainHoverColor] transition";
  const cancelButtonClasses =
    "bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition";

  // Handler for form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Create the payload according to your API schema
    const payload: NewAddressData = {
      customer: customerId,
      type: addressType,
      address,
      locality,
      city,
      state: stateField,
      country,
      zipcode,
      created_by: createdBy,
      is_selected: isSelected,
    };

    try {
      const res = await APICore<NewAddressData>(
        "/user/customer-address/",
        "POST",
        payload,
        authToken
      );
      toast.success("Address added successfully!");
      // Optionally clear the form fields
      dispatch(addAddress(res));
      setAddress("");
      setLocality("");
      setCity("");
      setStateField("");
      setCountry("");
      setZipcode("");
      setIsSelected(false);
      // Trigger a callback to refresh the address list
      if (onAddressAdded) onAddressAdded();
      // Close the form if using a modal or inline toggle
      if (onClose) onClose();
    } catch (error: any) {
      console.error("Error adding address:", error);
      toast.error(error.message || "Error adding address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg shadow"
    >
      <h3 className="text-lg font-semibold mb-2">{addressType}</h3>
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
        <button
          type="submit"
          disabled={loading}
          className={submitButtonClasses}
        >
          {loading ? "Submitting..." : "Add Address"}
        </button>
        <button type="button" onClick={onClose} className={cancelButtonClasses}>
          Cancel
        </button>
      </div>
    </form>
  );
}
