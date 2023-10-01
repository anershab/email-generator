import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Loading = () => <div>Loading...</div>;

const Home = () => (
  <p style={{ fontFamily: "sans-serif" }}>
    Hello! Refer to README.md for usage.
  </p>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<DynamicComponentLoader />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

const DynamicComponentLoader = () => {
  const segments = window.location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  const componentName = segments[0] || "DefaultComponent";
  const DynamicComponent = lazy(() => import(`./emails/${componentName}`));
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DynamicComponent />
      </Suspense>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
