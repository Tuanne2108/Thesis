import { sellerApi } from ".";

export const getSellerInfo = async (userId) => {
    try {
        const response = await sellerApi.get(`/seller-info/${userId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};