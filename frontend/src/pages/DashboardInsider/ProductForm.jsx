import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notification, Upload, Button } from "antd";
import { NumericFormat } from "react-number-format";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    getStorage,
} from "firebase/storage";
import { PlusOutlined } from "@ant-design/icons";
import * as productApi from "../../api/ProductApi";

const ProductForm = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [imageFileList, setImageFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleOnChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = ({ fileList }) => {
        setImageFileList(fileList);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            notification.error({
                placement: "top",
                message: "Error",
                description: "You can only upload image files",
            });
        }
        return isImage || Upload.LIST_IGNORE;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imageFileList.length === 0) {
            notification.error({
                placement: "top",
                message: "Error",
                description: "Please upload an image",
            });
            return;
        }

        setUploading(true);

        try {
            const storage = getStorage();
            const uploadedImages = await Promise.all(
                imageFileList.map((file) => {
                    const storageRef = ref(storage, `products/${file.name}`);
                    const uploadTask = uploadBytesResumable(
                        storageRef,
                        file.originFileObj
                    );
                    return uploadTask
                        .then(() => getDownloadURL(uploadTask.snapshot.ref))
                        .catch((error) => {
                            throw error;
                        });
                })
            );

            const productData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                discount: formData.discount,
                category: formData.category,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                images: uploadedImages,
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
        } finally {
            setUploading(false);
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
                            thousandSeparator={true}
                            suffix="%"
                            name="discount"
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
                    <div className="col-span-1">
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
                    <div className="col-span-1">
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
                            Images
                        </label>
                        <Upload
                            listType="picture-card"
                            fileList={imageFileList}
                            onChange={handleImageChange}
                            beforeUpload={beforeUpload}>
                            {imageFileList.length < 5 && (
                                <div>
                                    <PlusOutlined />
                                </div>
                            )}
                        </Upload>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                        disabled={uploading}>
                        Create New Product
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
