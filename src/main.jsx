import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AlertProvider } from "./context/AlertContext";
import { SupportProvider } from "./context/SupportContext";
import { DataProvider } from "./context/DataContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertProvider>
      <DataProvider>
        <SupportProvider>
          <App />
        </SupportProvider>
      </DataProvider>
    </AlertProvider>
  </StrictMode>
);
