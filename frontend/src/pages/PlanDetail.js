import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { learningPlanService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

const PlanDetail = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const planData = await learningPlanService.getPlanById(id);
        setPlan(planData);
      } catch (error) {
        console.error("Error fetching plan:", error);
        toast({
          title: "Error",
          description: "Failed to load learning plan details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, toast]);

  const handleCompleteTask = async (weekNumber, taskId) => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to track your progress.",
        variant: "destructive",
      });
      return;
    }

    try {
      await learningPlanService.completeTask(id, weekNumber, taskId);
      
      // Refresh plan data
      const updatedPlan = await learningPlanService.getPlanById(id);
      setPlan(updatedPlan);
      
      toast({
        title: "Success",
        description: "Task marked as completed.",
      });
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl">Learning plan not found.</p>
          <Link to="/learning-plans" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Learning Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/learning-plans" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Learning Plans
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
          <p className="text-gray-700 text-lg mb-4">{plan.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-medium">Difficulty:</span> {plan.difficulty}
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-medium">Duration:</span> {plan.duration}
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-medium">Tools:</span> {plan.tools.join(", ")}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-2">
            <span className="font-medium">Overall Progress:</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${plan.progress || 0}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-600 mb-6">
            {plan.progress || 0}% Complete
          </div>
        </div>
        
        {/* Weekly plan */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Weekly Plan</h2>
          
          {plan.weeks && plan.weeks.map((week) => (
            <div key={week.week} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Week {week.week}: {week.title}
              </h3>
              
              {/* Week progress */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${(week.completed / week.tasks.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-gray-600 mb-4">
                {week.completed} of {week.tasks.length} tasks completed
              </div>
              
              {/* Tasks */}
              <ul className="space-y-3">
                {week.tasks && week.tasks.map((task) => (
                  <li key={task.id} className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleCompleteTask(week.week, task.id)}
                        className="h-5 w-5 text-blue-600 rounded"
                      />
                    </div>
                    <span className={task.completed ? "line-through text-gray-500" : ""}>
                      {task.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;