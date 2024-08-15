import React, { useEffect, useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useSelector } from "react-redux";
import Header from "../../components/dashboard/Header";
import * as productApi from "../../api/ProductApi";

const Products = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [products, setProducts] = useState([]);
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
    console.log("Products fetched", products);
    const handleDelete = async (productId) => {};
    const handleEdit = (productId) => {};
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
                        src={params.value}
                        alt="product-thumbnail"
                        style={{
                            width: 50,
                            height: 50,
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
            renderCell: (params) => params.row.inventory.quantity,
        },
        {
            field: "reserved",
            headerName: "Reserved",
            type: "number",
            flex: 1,
            renderCell: (params) => params.row.inventory.reserved,
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
                    <IconButton onClick={() => handleEdit(params.row._id)}>
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
                    autoPageSize={true}
                    rowHeight={70}
                    checkboxSelection
                />
            </Box>
        </Box>
    );
};

export default Products;
