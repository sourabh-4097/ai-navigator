import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { learningPlanService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import Navigation from "../components/Navigation";

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        // Fetch all learning plans
        const plansData = await learningPlanService.getAllPlans();
        setPlans(plansData);

        // Fetch user's learning plans if authenticated
        if (isAuthenticated()) {
          const userPlansData = await learningPlanService.getUserPlans();
          setUserPlans(userPlansData);
        }
      } catch (error) {
        console.error("Error fetching learning plans:", error);
        toast({
          title: "Error",
          description: "Failed to load learning plans. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [isAuthenticated, toast]);

  // Check if a plan is in user's plans
  const isUserPlan = (planId) => {
    return userPlans.some(plan => plan.id === planId);
  };

  // Start a learning plan
  const handleStartPlan = async (planId) => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a learning plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      await learningPlanService.startPlan(planId);
      toast({
        title: "Success",
        description: "Learning plan added to your dashboard.",
      });
      
      // Refresh user plans
      const userPlansData = await learningPlanService.getUserPlans();
      setUserPlans(userPlansData);
    } catch (error) {
      console.error("Error starting plan:", error);
      toast({
        title: "Error",
        description: "Failed to start learning plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading learning plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Learning Plans</h1>
      
      {isAuthenticated() && userPlans.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">My Learning Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPlans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-blue-50"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {plan.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-sm font-medium">Duration: </span>
                    <span className="text-sm text-gray-600">{plan.duration}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium">Tools: </span>
                    <span className="text-sm text-gray-600">{plan.tools.join(", ")}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
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
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-4">Available Learning Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{plan.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {plan.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-sm font-medium">Duration: </span>
                <span className="text-sm text-gray-600">{plan.duration}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium">Tools: </span>
                <span className="text-sm text-gray-600">{plan.tools.join(", ")}</span>
              </div>
              
              {isUserPlan(plan.id) ? (
                <Link
                  to={`/plan/${plan.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                  View Plan
                </Link>
              ) : (
                <button
                  onClick={() => handleStartPlan(plan.id)}
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
                >
                  Start Plan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default LearningPlans;