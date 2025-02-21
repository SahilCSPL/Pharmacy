import { Product } from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      // Only add if the product is not already in the wishlist
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    // Assuming Product.id is a number for type consistency
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

const persistConfig = {
  key: "wishlist",
  storage,
};

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default persistReducer(persistConfig, wishlistSlice.reducer);
