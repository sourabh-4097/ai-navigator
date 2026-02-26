import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assessmentService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import Navigation from "../components/Navigation";

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const questionsData = await assessmentService.getQuestions();
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching assessment questions:", error);
        toast({
          title: "Error",
          description: "Failed to load assessment questions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  const handleSingleChoice = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: [optionId],
    });
  };

  const handleMultipleChoice = (questionId, optionId) => {
    const currentSelections = answers[questionId] || [];
    const updatedSelections = currentSelections.includes(optionId)
      ? currentSelections.filter((id) => id !== optionId)
      : [...currentSelections, optionId];

    setAnswers({
      ...answers,
      [questionId]: updatedSelections,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] && answers[questionId].length > 0;
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const allAnswered = questions.every((q) => isQuestionAnswered(q.id));
    
    if (!allAnswered) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Convert answers to the format expected by the backend
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptions]) => ({
        question_id: questionId,
        answer: selectedOptions.length === 1 ? selectedOptions[0] : selectedOptions
      }));
      
      await assessmentService.submitAssessment(formattedAnswers);
      
      // Get updated user profile with assessment results
      await updateProfile();
      
      toast({
        title: "Assessment Completed",
        description: "Thank you for completing the assessment. Your personalized recommendations are ready!",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading assessment questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl">No assessment questions available.</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-6">AI Tool Learning Assessment</h1>
          <p className="text-gray-600 mb-8">
            Answer these questions to help us personalize your AI tool learning journey.
          </p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-600 mb-8">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">{currentQuestionData.question}</h2>
          
          <div className="space-y-4">
            {currentQuestionData.options && currentQuestionData.options.map((option) => {
              const isSelected = answers[currentQuestionData.id]?.includes(option.id);
              
              return (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => {
                    if (currentQuestionData.type === "single-choice") {
                      handleSingleChoice(currentQuestionData.id, option.id);
                    } else {
                      handleMultipleChoice(currentQuestionData.id, option.id);
                    }
                  }}
                >
                  <div className="flex items-center">
                    {currentQuestionData.type === "single-choice" ? (
                      <div
                        className={`w-5 h-5 rounded-full border ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        } mr-3`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5"></div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded border ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        } mr-3 flex items-center justify-center`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                    )}
                    <span>{option.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded ${
              currentQuestion === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>
          
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={goToNextQuestion}
              disabled={!isQuestionAnswered(currentQuestionData.id)}
              className={`px-6 py-2 rounded ${
                !isQuestionAnswered(currentQuestionData.id)
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !isQuestionAnswered(currentQuestionData.id)}
              className={`px-6 py-2 rounded ${
                submitting || !isQuestionAnswered(currentQuestionData.id)
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {submitting ? "Submitting..." : "Complete Assessment"}
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Assessment;