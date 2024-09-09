import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "./context/SocketContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SocketProvider>
          <App />
        </SocketProvider>

        <Toaster />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
