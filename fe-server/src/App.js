import React, { Suspense, lazy } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useDarkMode } from "./context/DarkModeContext";
import { ProtectedRoute } from "./auth";
import {darkTheme, lightTheme} from './theme';
// Import Components
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

// Lazy Load Pages for Optimization
const HomePage = lazy(() => import("./pages/home/HomePage.jsx"));
const User = lazy(() => import("./pages/User"));
const UdateProfile = lazy(() => import("./pages/updateProfile/UpdateProfile"));
const Script = lazy(() => import("./pages/Script"));
const Model = lazy(() => import("./pages/model/modelInfo/Model.js"));
const NewScript = lazy(() => import("./pages/script/newScript/NewScript.js"));
const NewModel = lazy(() => import("./pages/model/newModel/NewModel.js"));
const Login = lazy(() => import("./pages/login/Login"));
const NewScriptModel = lazy(() => import("./pages/model/modelInfo/NewScriptModel.js"));
const NotFound = lazy(() => import("./pages/notFound/NotFound.jsx")); // 404 Page

function App() {
    const { darkMode } = useDarkMode();

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className="full-page">
                <Navbar />
                <Suspense fallback={
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={true}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/:userId/*" element={<ProtectedRoute element={<User />} />} />
                        <Route path="/edit-profile" element={<ProtectedRoute element={<UdateProfile />} />} />
                        <Route path="/:userId/scripts/:scriptId/*" element={<ProtectedRoute element={<Script />} />} />
                        <Route path="/:userId/models/:modelId/*" element={<ProtectedRoute element={<Script />} />} />
                        <Route path="/:userId/models/:modelId/code/:scriptId/*" element={<ProtectedRoute element={<Script />} />} />
                        <Route path="/:userId/models/:modelId/new-script" element={<NewScriptModel />} />
                        <Route path="/new-script" element={<ProtectedRoute element={<NewScript />} />} />
                        <Route path="/:userId/models/new-model" element={<NewModel />} />
                        <Route path="*" element={<NotFound />} /> 
                    </Routes>
                </Suspense>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;
