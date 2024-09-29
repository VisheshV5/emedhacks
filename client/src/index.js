import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
// import "./index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "./common/components/SnackbarContext";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
