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
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header          from './components/Header';
import LiveOffersToast from './components/LiveOffersToast';
import LandingPage       from './pages/LandingPage';
import Login             from './pages/Login';
import Register          from './pages/Register';
import AttractionDetails from './pages/AttractionDetails';
import WishlistPage      from './pages/WishlistPage';
import SearchResultsPage from './pages/SearchResultsPage';
import Chat from "./components/user/Chat";
import { WebSocketProvider } from "./utils/WebSocketContext";
import MyOffers          from './pages/MyOffers';
import HomeAdmin         from './pages/HomeAdmin';
import Unauthorized      from './pages/Unauthorized';
import RequireAuth       from './utils/RequireAuth';
import { getUserIdFromToken } from './utils/Auth';


function App() {
    const userId     = getUserIdFromToken();
    const isLoggedIn = !!userId;

    const isAdminPage = window.location.pathname.startsWith('/home-admin');

    return (
        <BrowserRouter>
            {/* toast-uri & header doar dacă ești pe front-end client și userul e logat */}
            {!isAdminPage && isLoggedIn && (
                <>
                    <ToastContainer
                        position="top-right"
                        autoClose={8000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        pauseOnHover
                        draggable={false}
                        toastClassName="custom-toast"
                    />

                    <LiveOffersToast />

                    <Header />
                </>
            )}

            <Routes>
                <Route path="/"                element={<LandingPage />} />
                <Route path="/login"           element={<Login />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/attractions/:id" element={<AttractionDetails />} />
                <Route path="/wishlist"        element={<WishlistPage />} />
                <Route path="/search-results"  element={<SearchResultsPage />} />
                <Route path="/offers"          element={<MyOffers />} />
                <Route path="/home"            element={<LandingPage />} />

                <Route
                    path="/home-admin/*"
                    element={
                        <RequireAuth allowedRoles={['Admin']}>
                            <HomeAdmin />
                        </RequireAuth>
                    }
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </BrowserRouter>
    );
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


