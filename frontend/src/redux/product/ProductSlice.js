import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentProduct: null,
    error: null,
    isLoading: false,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        updateProductStart: (state) => {
            state.isLoading = true;
        },
        updateProductSuccess: (state, action) => {
            state.isLoading = false;
            state.currentProduct = action.payload;
            state.error = null;
        },
        updateProductFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const {
    updateProductStart,
    updateProductSuccess,
    updateProductFailure,
} = productSlice.actions;

export default productSlice.reducer;
