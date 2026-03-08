import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PortfolioHome from "./PortfolioHome";
import CatPrepApp from "./catprep/CatPrepApp";

const App = () => {
  return (
    <BrowserRouter>
      {/* Global Toaster for notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1c1c21",
            color: "#fff",
            border: "1px solid #282732",
            zIndex: 99999, // Ensure it's above everything
          },
        }}
      />
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/catprep/*" element={<CatPrepApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
