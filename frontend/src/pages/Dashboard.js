import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { learningPlanService, toolService, userService } from "../services/api";
import { useToast } from "../hooks/use-toast";

const Dashboard = () => {
  const [userPlans, setUserPlans] = useState([]);
  const [recommendedTools, setRecommendedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's learning plans
        const plansData = await learningPlanService.getUserPlans();
        setUserPlans(plansData);
        
        // Fetch recommended tools based on user's profile
        const toolsData = await toolService.getAllTools();
        
        // Simple recommendation logic based on user's interests and skill level
        // In a real app, this would come from a backend recommendation engine
        let filteredTools = toolsData;
        
        if (user?.interests && user.interests.length > 0) {
          filteredTools = toolsData.filter(tool => 
            tool.tags && tool.tags.some(tag => user.interests.includes(tag))
          );
        }
        
        if (user?.skill_level) {
          filteredTools = filteredTools.filter(tool => 
            tool.difficulty === user.skill_level || 
            (user.skill_level === "Advanced" && tool.difficulty === "Intermediate") ||
            (user.skill_level === "Intermediate" && tool.difficulty === "Beginner")
          );
        }
        
        // Limit to 3 recommended tools
        setRecommendedTools(filteredTools.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || "User"}!</h1>
      
      {/* User stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Tools Explored</h3>
          <p className="text-3xl font-bold text-blue-600">{user?.tools_explored || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Plans Completed</h3>
          <p className="text-3xl font-bold text-green-600">{user?.plans_completed || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Weekly Streak</h3>
          <p className="text-3xl font-bold text-purple-600">{user?.weekly_streak || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Joined</h3>
          <p className="text-xl font-medium">
            {user?.joined_date ? new Date(user.joined_date).toLocaleDateString() : "Recently"}
          </p>
        </div>
      </div>
      
      {/* Active learning plans */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Learning Plans</h2>
          <Link
            to="/learning-plans"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            View All
          </Link>
        </div>
        
        {userPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You haven't started any learning plans yet.</p>
            <Link
              to="/learning-plans"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Browse Learning Plans
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPlans.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${plan.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-600 mb-4">
                    {plan.progress || 0}% Complete
                  </div>
                  
                  <Link
                    to={`/plan/${plan.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Recommended tools */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recommended Tools</h2>
          <Link
            to="/tools"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            View All
          </Link>
        </div>
        
        {recommendedTools.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">
              Complete your assessment to get personalized tool recommendations.
            </p>
            <Link
              to="/assessment"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Take Assessment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tool.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags && tool.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/tool/${tool.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick links */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/tools"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Browse Tools</h3>
            <p className="text-gray-600">Discover AI tools for your needs</p>
          </Link>
          <Link
            to="/learning-plans"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Learning Plans</h3>
            <p className="text-gray-600">Structured paths to master AI tools</p>
          </Link>
          <Link
            to="/assessment"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Retake Assessment</h3>
            <p className="text-gray-600">Update your preferences and goals</p>
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-600">Contact our support team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;