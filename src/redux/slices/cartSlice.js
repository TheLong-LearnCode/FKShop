import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { viewCart, addToCart, updateCartItem, removeFromCart } from '../../service/cartApi';
import { Notification } from '../../util/Notification';
import { message } from 'antd';

// Async thunk action để fetch cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (accountID, { rejectWithValue }) => {
    try {
      const response = await viewCart(accountID);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProductToCart = createAsyncThunk(
  'cart/addProduct',
  async ({ accountID, productID, quantity }, { rejectWithValue }) => {
    try {
      const response = await addToCart(accountID, productID, quantity);
      message.success('Added product to cart successfully');
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProductInCart = createAsyncThunk(
  'cart/updateProduct',
  async ({ accountID, productID, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateCartItem(accountID, productID, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeProductFromCart = createAsyncThunk(
  'cart/removeProduct',
  async ({ accountID, productID }, { rejectWithValue }) => {
    try {
      const response = await removeFromCart(accountID, productID);
      Notification('Delete status', response.message, 3, 'success');
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const CartSlice = createSlice({
  name: "cartProducts",
  initialState: {
    accountID: null,
    products: [],
    status: 'idle',
    error: null
  },
  reducers: {
    // Giữ lại các reducers đồng bộ hiện có
    increaseQuantity: (state, action) => {
      const cartProductIndex = state.products.findIndex(p => p.id === action.payload.id);
      if (cartProductIndex !== -1) {
        state.products[cartProductIndex].quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const cartProductIndex = state.products.findIndex(p => p.id === action.payload.id);
      if (cartProductIndex !== -1 && state.products[cartProductIndex].quantity > 1) {
        state.products[cartProductIndex].quantity -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accountID = action.payload.accountID;
        state.products = action.payload.products;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.products.push(action.payload);    
      })
      .addCase(updateProductInCart.fulfilled, (state, action) => {
        const index = state.products.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.products = state.products.filter(item => item.id !== action.payload.id);
      });
  }
});

// Export các action creators đồng bộ
export const { increaseQuantity, decreaseQuantity } = CartSlice.actions;

export default CartSlice.reducer;