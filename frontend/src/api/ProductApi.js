import { productApi } from ".";

export const getProductsBySeller = async (sellerId) => {
    try {
        const response = await productApi.get(
            `/get-products-by-seller/${sellerId}`
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export const createProduct = async (sellerId, productData) => {
    try {
        const response = await productApi.post(`/create-product`, {
            ...productData,
            sellerId,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
