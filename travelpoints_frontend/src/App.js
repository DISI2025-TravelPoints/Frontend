import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./utils/RequireAuth";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import HomeAdmin from "./pages/HomeAdmin";
import AttractionDetails from "./pages/AttractionDetails";
import WishlistPage   from './pages/WishlistPage';
import SearchResultsPage from './pages/SearchResultsPage';
import Chat from "./components/user/Chat";
import { WebSocketProvider } from "./utils/WebSocketContext";
function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          {/* pagina principala MOMENTAN*/}
          <Route path="/" element={<LandingPage />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/reset-pass" element={<ResetPassword />} />
          <Route path="/forgot-pass" element={<ForgotPassword />} />
          <Route path="/attractions/:id" element={<AttractionDetails />} />
          <Route path="/chats" element={<Chat />} />
          <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/search-results" element={<SearchResultsPage />} />

          <Route
            path="/home-admin"
            element={
              <RequireAuth allowedRoles={["Admin"]}>
                <HomeAdmin />
              </RequireAuth>
            }
          />

          {/*<Route path="/wishlist" element={*/}
          {/*    <RequireAuth allowedRoles={['Tourist']}>*/}
          {/*        <Wishlist />*/}
          {/*    </RequireAuth>*/}
          {/*} />               */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;
