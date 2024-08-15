import React, { useEffect, useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { notification, Form, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { NumericFormat } from "react-number-format";
import Header from "../../components/dashboard/Header";
import CustomDrawer from "../../components/CustomDrawer";
import * as productApi from "../../api/ProductApi";
import {
    updateProductFailure,
    updateProductStart,
    updateProductSuccess,
} from "../../redux/product/ProductSlice";

const Products = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({});
    const [imageFileList, setImageFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productApi.getProductsBySeller(
                    currentUser._id
                );
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        if (currentUser && currentUser._id) {
            fetchProducts();
        }
    }, [currentUser]);

    const handleDelete = async (productId) => {
        try {
            await productApi.deleteProduct(productId);
            notification.success({
                placement: "top",
                message: "Success",
                description: "Product deleted successfully",
            });
            setProducts(
                products.filter((product) => product._id !== productId)
            );
        } catch (error) {
            console.error("Error deleting product:", error);
            notification.error({
                placement: "top",
                message: "Error",
                description: "Failed to delete product",
            });
        }
    };

    const handleEdit = (product) => {
        setFormData({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            discount: product.discount || "",
            category: product.category,
            inventoryQuantity: product.inventory?.quantity || 0,
            tags: product.tags?.join(", ") || "",
        });

        form.setFieldsValue({
            name: product.name,
            description: product.description,
            price: product.price,
            discount: product.discount || "",
            category: product.category,
            inventoryQuantity: product.inventory?.quantity || 0,
            tags: product.tags?.join(", ") || "",
        });

        setOpen(true);
    };

    const handleOnChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        setUploading(true);
        dispatch(updateProductStart());

        try {
            const updatedProduct = {
                ...formData,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
            };

            const res = await productApi.updateProduct(
                formData._id,
                updatedProduct
            );
            if (res.status === "success") {
                dispatch(updateProductSuccess(res.data));
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === formData._id ? res.data : product
                    )
                );
                notification.success({
                    placement: "top",
                    message: "Success",
                    description: "Product updated successfully",
                });
                setOpen(false);
            } else {
                dispatch(updateProductFailure(res.message));
                notification.error({
                    placement: "top",
                    message: "Error",
                    description: res.message,
                });
            }
        } catch (error) {
            dispatch(updateProductFailure(error.message));
            notification.error({
                placement: "top",
                message: "Error",
                description: error.message,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setFormData({});
        setImageFileList([]);
        setOpen(false);
    };

    const columns = [
        {
            field: "images",
            headerName: "Thumbnail",
            flex: 1,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%">
                    <img
                        src={params.value[0]}
                        alt="product-thumbnail"
                        style={{
                            width: 55,
                            height: 55,
                            objectFit: "cover",
                            borderRadius: "5px",
                        }}
                    />
                </Box>
            ),
        },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        { field: "price", headerName: "Price", type: "number", flex: 1 },
        {
            field: "quantity",
            headerName: "Quantity",
            type: "number",
            flex: 1,
            renderCell: (params) => params.row.inventory?.quantity,
        },
        {
            field: "reserved",
            headerName: "Reserved",
            type: "number",
            flex: 1,
            renderCell: (params) => params.row.inventory?.reserved,
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%">
                    <IconButton onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="warning"
                        onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <>
            <Box m="20px">
                <Header title="PRODUCTS" subtitle="Managing Products" />
                <Box
                    m="40px 0 0 0"
                    height="75vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .name-column--cell": {
                            color: colors.accent.tan,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: colors.primary[600],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                            backgroundColor: colors.primary[600],
                        },
                        "& .MuiCheckbox-root": {
                            color: `${colors.accent.gold} !important`,
                        },
                    }}>
                    <DataGrid
                        rows={products}
                        columns={columns}
                        getRowId={(row) => row._id}
                        rowHeight={70}
                        pagination={true}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>
            <CustomDrawer
                open={open}
                onClose={handleClose}
                onSubmit={() => form.submit()}
                title="Edit Product">
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Form.Item
                                name="name"
                                label="Product Name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter the product name",
                                    },
                                ]}>
                                <Input
                                    name="name"
                                    onChange={handleOnChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-span-2">
                            <Form.Item name="description" label="Description">
                                <Input.TextArea
                                    name="description"
                                    onChange={handleOnChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the price",
                                    },
                                ]}>
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
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name="discount" label="Discount">
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
                            </Form.Item>
                        </div>
                        <div className="col-span-2">
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the category",
                                    },
                                ]}>
                                <Input
                                    name="category"
                                    onChange={handleOnChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-span-1">
                            <Form.Item
                                name="inventoryQuantity"
                                label="Inventory Quantity"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter the inventory quantity",
                                    },
                                ]}>
                                <Input
                                    type="number"
                                    name="inventoryQuantity"
                                    onChange={handleOnChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-span-1">
                            <Form.Item
                                name="tags"
                                label="Tags (comma separated)">
                                <Input
                                    name="tags"
                                    onChange={handleOnChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-600 focus:border-yellow-600"
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </CustomDrawer>
        </>
    );
};

export default Products;
