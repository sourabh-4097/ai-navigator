import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            AI Navigator
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/tools"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActive("/tools") ? "text-blue-600 font-medium" : ""
              }`}
            >
              Tools
            </Link>
            
            {isAuthenticated() && (
              <>
                <Link
                  to="/learning-plans"
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${
                    isActive("/learning-plans") ? "text-blue-600 font-medium" : ""
                  }`}
                >
                  Learning Plans
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${
                    isActive("/dashboard") ? "text-blue-600 font-medium" : ""
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name || "User"}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;