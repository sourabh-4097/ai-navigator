import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import ToolDirectory from "./pages/ToolDirectory";
import ToolDetail from "./pages/ToolDetail";
import LearningPlans from "./pages/LearningPlans";
import PlanDetail from "./pages/PlanDetail";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools" element={<ToolDirectory />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/learning-plans" element={<LearningPlans />} />
          <Route path="/plan/:id" element={<PlanDetail />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;