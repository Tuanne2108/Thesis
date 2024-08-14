import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as productApi from "../../api/ProductApi";
import { NumericFormat } from "react-number-format";
import { notification } from "antd";

const ProductForm = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                discount: formData.discount,
                category: formData.category,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                images: formData.images.split(",").map((image) => image.trim()),
                inventory: {
                    quantity: formData.inventoryQuantity,
                    reserved: formData.inventoryReserved || 0,
                },
            };

            await productApi.createProduct(currentUser._id, productData);
            notification.success({
                placement: "top",
                message: "Success",
                description: "Product created successfully",
            });
            navigate("/seller-dashboard/products");
        } catch (error) {
            notification.error({
                placement: "top",
                message: "Error",
                description: error.message,
            });
        }
    };

    return (
        <div className="m-5">
            <h1 className="text-2xl font-bold mb-4">CREATE PRODUCT</h1>
            <p className="mb-6">Create a New Product</p>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <NumericFormat
                            thousandSeparator={true}
                            prefix={"$"}
                            name="price"
                            value={formData.price || ""}
                            onValueChange={(values) => {
                                const { value } = values;
                                setFormData({
                                    ...formData,
                                    price: value,
                                });
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Discount
                        </label>
                        <NumericFormat
                            name="discount"
                            suffix="%"
                            value={formData.discount || ""}
                            onValueChange={(values) => {
                                const { value } = values;
                                setFormData({
                                    ...formData,
                                    discount: value,
                                });
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Images (comma separated URLs)
                        </label>
                        <input
                            type="text"
                            name="images"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Inventory Quantity
                        </label>
                        <input
                            type="number"
                            name="inventoryQuantity"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Reserved Quantity
                        </label>
                        <input
                            type="number"
                            name="inventoryReserved"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
                        Create New Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
