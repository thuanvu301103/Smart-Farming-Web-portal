import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./language/i18n"; // Import i18n configuration
import { DarkModeProvider } from "./context/DarkModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <DarkModeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </DarkModeProvider>
    </React.StrictMode>
);
