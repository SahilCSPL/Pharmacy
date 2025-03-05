import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Define CartItem with all necessary fields
export interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: string;
  image: string;
  variantId?: number;
}

export interface CartState {
  cartItems: CartItem[];
  totalItems: number;    // number of unique products
  totalQuantity: number; // sum of all product quantities
}

const initialState: CartState = {
  cartItems: [],
  totalItems: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // For guest users and for click-to-add updates
    addToCart: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
        name?: string;
        price?: string;
        image?: string;
        variantId?: number;
      }>
    ) => {
      const { id, quantity, name, price, image } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (existingItem) {
        // Increase quantity by the provided value
        existingItem.quantity += quantity;
        state.totalQuantity += quantity;
      } else {
        state.cartItems.push({
          id,
          quantity,
          name: name || "",
          price: price || "",
          image: image || "",
        });
        state.totalItems += 1;
        state.totalQuantity += quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === productId
      );
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== productId
        );
        state.totalItems -= 1;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalQuantity = 0;
    },
    // Use this to set/replace the entire cart (used after login)
    setCart: (state, action: PayloadAction<CartState>) => {
      return action.payload;
    },
    // New reducer: update an item's quantity directly, then recalc totals
    updateCartItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
      // Recalculate totalQuantity from scratch
      state.totalQuantity = state.cartItems.reduce(
        (sum, current) => sum + current.quantity,
        0
      );
    },
  },
});

const persistConfig = {
  key: "cart",
  storage,
};

export const { addToCart, removeFromCart, clearCart, setCart, updateCartItem } = cartSlice.actions;
export default persistReducer(persistConfig, cartSlice.reducer);
