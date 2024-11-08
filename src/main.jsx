import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import routes from "./routes/index.jsx";
import { Provider } from "react-redux";
import store from "./redux/store/index.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="837752866445-nm1iiab34qppfleb93s7acd032cb8d8t.apps.googleusercontent.com">
        <RouterProvider router={routes} />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
