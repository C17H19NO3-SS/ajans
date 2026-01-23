import { Route, Routes, Navigate } from "react-router";
import { AdminLogin } from "./Login";
import { AdminDashboard } from "./Dashboard";
import { useEffect } from "react";
import { AdminLayout } from "./Layout";
import { AdminUsers } from "./Users";
import { AdminProducts } from "./Products";
import { AdminProductEdit } from "./ProductEdit";
import { AdminCategories } from "./Categories";
import { AdminProductNew } from "./ProductNew";

export const AdminRoutes = () => {
  useEffect(() => {
    document.body.classList.add("!pt-0");
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductNew />} />
        <Route path="products/:id" element={<AdminProductEdit />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};
