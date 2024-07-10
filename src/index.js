import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";

import App from "./App";
import theme from "./utils/theme";
import "./index.css";
import { AppProvider } from "./contexts";
import store from "./redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <Provider store={store}>
    <AppProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AppProvider>
  </Provider>

);
