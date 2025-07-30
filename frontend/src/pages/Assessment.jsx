import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, ArrowRight, Brain, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { assessmentAPI } from '../services/api';
import { useUser } from '../hooks/useUser';

const Assessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getUserEmail, setUser } = useUser();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await assessmentAPI.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error loading questions",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    if (!answers[currentQ.question_id]) {
      toast({
        title: "Please select an answer",
        description: "You need to answer the current question to continue.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    try {
      setIsSubmitting(true);
      const userEmail = getUserEmail();
      
      // Convert question_id keys to strings for API
      const formattedAnswers = {};
      Object.entries(answers).forEach(([key, value]) => {
        formattedAnswers[key.toString()] = value;
      });

      const result = await assessmentAPI.submitAssessment(formattedAnswers, userEmail);
      
      // Update user data
      setUser({
        email: userEmail,
        name: userEmail.split('@')[0],
        assessment_completed: true,
        ...result.user_profile
      });

      toast({
        title: "Assessment Complete!",
        description: "Generating your personalized learning path...",
      });

      setIsComplete(true);
      
      // Navigate to dashboard after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error submitting assessment",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading assessment questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              We're analyzing your responses to create your personalized learning path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={100} className="w-full" />
              <p className="text-sm text-slate-600">
                Creating your dashboard with recommended tools and learning plans...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <p>No questions available. Please try again later.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-slate-900" />
            <span className="text-xl font-bold text-slate-900">AI Navigator</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Exit Assessment
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
            {currentQ.type === 'multiple-choice' && (
              <CardDescription>
                Select all that apply
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {currentQ.type === 'single-choice' ? (
              <RadioGroup 
                value={answers[currentQ.question_id] || ''} 
                onValueChange={(value) => handleAnswer(currentQ.question_id, value)}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`checkbox-${index}`}
                      checked={(answers[currentQ.question_id] || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = answers[currentQ.question_id] || [];
                        if (checked) {
                          handleAnswer(currentQ.question_id, [...currentAnswers, option]);
                        } else {
                          handleAnswer(currentQ.question_id, currentAnswers.filter(a => a !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`checkbox-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;