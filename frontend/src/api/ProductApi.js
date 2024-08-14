import { productApi } from ".";

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
