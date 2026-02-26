import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import ToolDirectory from "./pages/ToolDirectory";
import ToolDetail from "./pages/ToolDetail";
import LearningPlans from "./pages/LearningPlans";
import PlanDetail from "./pages/PlanDetail";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/assessment" 
        element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/tools" element={<ToolDirectory />} />
      <Route path="/tool/:id" element={<ToolDetail />} />
      <Route 
        path="/learning-plans" 
        element={
          <ProtectedRoute>
            <LearningPlans />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/plan/:id" 
        element={
          <ProtectedRoute>
            <PlanDetail />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;