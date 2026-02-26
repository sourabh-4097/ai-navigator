import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Discover and Master AI Tools
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            Your personalized navigator for learning AI tools based on your skill level,
            time availability, and goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated() ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 py-3 px-8 rounded-lg text-lg font-medium transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-blue-600 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Take Assessment</h3>
            <p className="text-gray-600">
              Answer a few questions about your skills, goals, and time availability to get personalized recommendations.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-blue-600 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Explore AI Tools</h3>
            <p className="text-gray-600">
              Discover AI tools tailored to your needs with detailed information on features, use cases, and learning paths.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-blue-600 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Follow Learning Plans</h3>
            <p className="text-gray-600">
              Follow structured learning plans to master AI tools efficiently and track your progress over time.
            </p>
          </div>
        </div>
      </div>

      {/* Tools Preview Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">ChatGPT</h3>
              <p className="text-gray-600 mb-4">
                Advanced language model for content creation, coding assistance, and problem-solving.
              </p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Beginner</span>
                <Link to="/tools" className="text-blue-600 hover:underline">Learn more</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Midjourney</h3>
              <p className="text-gray-600 mb-4">
                AI art generator for creating stunning visuals from text descriptions.
              </p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Intermediate</span>
                <Link to="/tools" className="text-blue-600 hover:underline">Learn more</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">GitHub Copilot</h3>
              <p className="text-gray-600 mb-4">
                AI-powered code completion and generation tool for developers.
              </p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Intermediate</span>
                <Link to="/tools" className="text-blue-600 hover:underline">Learn more</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Notion AI</h3>
              <p className="text-gray-600 mb-4">
                AI-powered writing and productivity assistant integrated into Notion.
              </p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Beginner</span>
                <Link to="/tools" className="text-blue-600 hover:underline">Learn more</Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              to="/tools"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-lg font-medium transition-colors"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your AI Learning Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join AI Navigator today and discover the perfect AI tools for your needs.
            Get personalized learning plans and track your progress.
          </p>
          {isAuthenticated() ? (
            <Link
              to="/dashboard"
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg text-lg font-medium transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg text-lg font-medium transition-colors"
            >
              Get Started for Free
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">AI Navigator</h3>
              <p className="text-gray-400">
                Your personalized guide to discovering and mastering AI tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/tools" className="text-gray-400 hover:text-white">Tools</Link></li>
                <li><Link to="/learning-plans" className="text-gray-400 hover:text-white">Learning Plans</Link></li>
                <li><Link to="/assessment" className="text-gray-400 hover:text-white">Assessment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Feedback</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Navigator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;