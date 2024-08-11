const Seller = require("../models/Seller");

const getSellerInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        const seller = await Seller.findOne({ userId });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        return res.status(200).json({
            status: "success",
            data: seller,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getSellerInfo };
