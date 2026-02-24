import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AlertProvider } from "./context/AlertContext";
import { SupportProvider } from "./context/SupportContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertProvider>
      <SupportProvider>
        <App />
      </SupportProvider>
    </AlertProvider>
  </StrictMode>
);
