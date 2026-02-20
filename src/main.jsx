import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import { SnackbarProvider } from "notistack";
import Home from "./Screens/Home.jsx";
import Products from "./Screens/Products.jsx";
import Cart from "./Screens/Cart.jsx";
import { AuthProvider } from "./config/authContext.jsx";
import { CartProvider } from "./config/CartContext.jsx";
import Profile from "./Screens/profile/ProfilePage.jsx";
import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="products" element={<Products />} />
      <Route path="cart" element={<Cart />} />
      <Route path="profile" element={<Profile />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <RouterProvider router={router} />
    </SnackbarProvider>
    </CartProvider>
  </AuthProvider>,
);
