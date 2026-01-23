// src/Layout.tsx  (GÜNCEL)
// Not: Sadece App bileşenindeki yerleşim değişti.
import type { ReactElement } from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { Index } from "./Pages";
import { Header } from "./Components/Layout/Header/Header";
import { Footer } from "./Components/Layout/Footer/Footer";
import { _404 } from "./Pages/404";
import "@/Config/i18n";
import Services from "@/Pages/Services";
import About from "@/Pages/About";
import Products from "@/Pages/Products";
import ProductDetail from "@/Pages/ProductDetail";
import Contact from "@/Pages/Contact";
import References from "@/Pages/References";
import Privacy from "@/Pages/Privacy";
import Terms from "@/Pages/Terms";
import KVKK from "@/Pages/KVKK";
import { AnimatePresence, PageTransition } from "@/Components/Common/Motion";
import { AdminAuthProvider } from "@/Context/AdminAuthContext";
import { AdminRoutes } from "./Pages/Admin";
import "./Styles/style.css";

function AnimatedRoutes() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const withPageTransition = (element: ReactElement) => (
    <PageTransition>{element}</PageTransition>
  );

  useEffect(() => {
    if (!isAdminRoute) document.body.classList.add("!pt-20");
  }, [isAdminRoute]);

  return (
    <>
      {!isAdminRoute && <Header />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={withPageTransition(<Index />)} />
          <Route
            path="/hizmetlerimiz/*"
            element={withPageTransition(<Services />)}
          />
          <Route path="/hakkimizda" element={withPageTransition(<About />)} />
          <Route path="/urunler" element={withPageTransition(<Products />)} />
          <Route
            path="/urunler/:productId"
            element={withPageTransition(<ProductDetail />)}
          />
          <Route path="/iletisim" element={withPageTransition(<Contact />)} />
          <Route
            path="/referanslar"
            element={withPageTransition(<References />)}
          />
          <Route path="/gizlilik" element={withPageTransition(<Privacy />)} />
          <Route path="/kosullar" element={withPageTransition(<Terms />)} />
          <Route path="/kvkk" element={withPageTransition(<KVKK />)} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={withPageTransition(<_404 />)} />
        </Routes>
      </AnimatePresence>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AnimatedRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
