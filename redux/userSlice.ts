import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Address = {
  id?: number
  type: string
  address: string
  locality: string
  city: string
  state: string
  country: string
  zipcode: string
  is_selected: boolean
  customer: number
}

interface UserState {
  token: string | undefined
  id: number | undefined
  first_name: string | undefined
  last_name: string | undefined
  phone_number: string | undefined
  email: string | undefined
  profile_picture: string | undefined
  addresses: Address[]
  selectedAddress: Address | undefined
}

const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL

const initialState: UserState = {
  token: undefined,
  id: undefined,
  first_name: undefined,
  last_name: undefined,
  phone_number: undefined,
  email: undefined,
  profile_picture: undefined,
  addresses: [],
  selectedAddress: undefined,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        token: string | undefined
        id: number | undefined
        first_name: string | undefined
        last_name: string | undefined
        phone_number: string | undefined
        email: string | undefined
        profile_picture: string | undefined
      }>,
    ) => {
      const payload = { ...action.payload }

      if (payload.profile_picture && payload.profile_picture.startsWith("/") && PUBLIC_URL) {
        payload.profile_picture = `${PUBLIC_URL}${payload.profile_picture}`
      }

      return { ...state, ...payload }
    },
    saveAddresses: (state, action: PayloadAction<{ addresses: Address[] }>) => {
      state.addresses = [...action.payload.addresses]
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      // If the new address is marked as default,
      // update all existing addresses of the same type to be non-default.
      if (action.payload.is_selected) {
        state.addresses = state.addresses.map((addr) => {
          if (addr.type.toLowerCase() === action.payload.type.toLowerCase()) {
            return { ...addr, is_selected: false }
          }
          return addr
        })
      }
      state.addresses.push(action.payload)
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const updatedAddress = action.payload
      state.addresses = state.addresses.map((addr) => {
        if (addr.id === updatedAddress.id) {
          // If the updated address is marked as default,
          // update all other addresses of the same type to be non-default
          if (updatedAddress.is_selected) {
            state.addresses = state.addresses.map((a) => {
              if (a.type.toLowerCase() === updatedAddress.type.toLowerCase() && a.id !== updatedAddress.id) {
                return { ...a, is_selected: false }
              }
              return a
            })
          }
          return updatedAddress
        }
        return addr
      })
    },
    setDefaultAddress: (state, action: PayloadAction<{ addressId: number; type: string }>) => {
      // For each address in the same type, set is_selected accordingly.
      state.addresses = state.addresses.map((addr) => {
        if (addr.type.toLowerCase() === action.payload.type.toLowerCase()) {
          if (addr.id === action.payload.addressId) {
            return { ...addr, is_selected: true }
          } else {
            return { ...addr, is_selected: false }
          }
        }
        return addr
      })
    },
    saveSelectedAddress: (state, action: PayloadAction<{ selectedAddress: Address }>) => {
      state.selectedAddress = action.payload.selectedAddress
    },
    clearUser: (state) => {
      state.token = undefined
      state.id = undefined
      state.first_name = undefined
      state.last_name = undefined
      state.phone_number = undefined
      state.email = undefined
      state.profile_picture = undefined
      state.addresses = []
      state.selectedAddress = undefined
    },
    removeAddress: (state, action: PayloadAction<{ addressId: number }>) => {
      state.addresses = state.addresses.filter((address) => address.id !== action.payload.addressId)
    },
  },
})

export const {
  setUser,
  saveAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  saveSelectedAddress,
  removeAddress,
  clearUser,
} = userSlice.actions

export default userSlice.reducer

