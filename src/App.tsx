import React from "react";
import MainLayout from "./components/MainLayout";
import "./App.css";
import SpectrumStatusCards from "./components/SpectrumStatusCards";

function App() {
  return (
    <MainLayout>
      <SpectrumStatusCards />
    </MainLayout>
  );
}

export default App;
