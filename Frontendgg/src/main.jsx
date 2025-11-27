import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe("pk_test_51SLDeJGVqNVBJVi8vewhhuz2q4Sp1GX1gEGe0HxFy8L9OkAPg0VRZxBbWLApoDUtaWG5ZDJUesW6vz7FzqUuvTtf00CaPe5uqR");



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Provider>
  </StrictMode>
);
