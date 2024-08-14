import React, { useState } from "react";
import Topbar from "../components/dashboard/Topbar";
import Sidebar from "../components/dashboard/SidebarComponent";
import { Routes, Route } from "react-router-dom";
import Main from "./DashboardInsider/Main";
import Customers from "./DashboardInsider/Customers";
import Invoices from "./DashboardInsider/Invoices";
import ProductForm from "./DashboardInsider/ProductForm";
import Bar from "./DashboardInsider/Bar";
import Pie from "./DashboardInsider/Pie";
import Line from "./DashboardInsider/Line";
import Products from "./DashboardInsider/Products";

export default function SellerDashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col transition-all duration-200">
                <Topbar />
                <div className="flex-1 p-4">
                    <Routes>
                        <Route path="main" element={<Main />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="products" element={<Products />} />
                        <Route path="invoices" element={<Invoices />} />
                        <Route path="product-form" element={<ProductForm />} />
                        <Route path="bar" element={<Bar />} />
                        <Route path="pie" element={<Pie />} />
                        <Route path="line" element={<Line />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
