import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { 
  Brain, 
  ArrowLeft, 
  Target, 
  Clock, 
  CheckCircle,
  PlayCircle,
  BookOpen,
  Award,
  Calendar,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { plansAPI } from '../services/api';
import { useUser } from '../hooks/useUser';
import { useToast } from '../hooks/use-toast';

const PlanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getUserEmail } = useUser();
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    try {
      setIsLoading(true);
      const userEmail = getUserEmail();
      const data = await plansAPI.getPlan(id, userEmail);
      setPlan(data);
    } catch (error) {
      console.error('Error loading learning plan:', error);
      toast({
        title: "Error loading learning plan",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Plan not found</h2>
            <p className="text-slate-600 mb-4">The learning plan you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/learning-plans')}>
              Back to Learning Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentWeek = plan.weeks[selectedWeek];
  const completedTasks = plan.weeks.reduce((total, week) => total + week.completed, 0);
  const totalTasks = plan.weeks.reduce((total, week) => total + week.tasks.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-slate-900" />
            <span className="text-xl font-bold text-slate-900">AI Navigator</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/learning-plans')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Plan Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{plan.title}</h1>
              <p className="text-xl text-slate-600">{plan.description}</p>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {plan.difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span>{plan.duration}</span>
            </div>
            <div className="flex items-center">
              <Target className="h-5 w-5 text-green-500 mr-2" />
              <span>{plan.tools.length} tools covered</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
              <span>{completedTasks}/{totalTasks} tasks completed</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Overall Progress</span>
              <span className="font-medium">{plan.progress}%</span>
            </div>
            <Progress value={plan.progress} className="w-full h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Week Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Weeks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.weeks.map((week, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedWeek === index 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedWeek(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">Week {week.week}</span>
                        {week.completed === week.tasks.length ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{week.title}</p>
                      <div className="text-xs text-slate-500">
                        {week.completed}/{week.tasks.length} tasks completed
                      </div>
                      <Progress 
                        value={(week.completed / week.tasks.length) * 100} 
                        className="w-full h-1 mt-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Current Week Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Week {currentWeek.week}: {currentWeek.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Focus on mastering the fundamentals this week
                      </CardDescription>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {currentWeek.completed}/{currentWeek.tasks.length}
                      </div>
                      <div className="text-sm text-slate-600">tasks completed</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Week Progress</span>
                      <span className="font-medium">
                        {Math.round((currentWeek.completed / currentWeek.tasks.length) * 100)}%
                      </span>
                    </div>
                    <Progress value={(currentWeek.completed / currentWeek.tasks.length) * 100} className="w-full" />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Study Time
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Task List */}
              <Card>
                <CardHeader>
                  <CardTitle>Tasks for Week {currentWeek.week}</CardTitle>
                  <CardDescription>
                    Complete these tasks to progress through your learning plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentWeek.tasks.map((task, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border transition-colors ${
                          index < currentWeek.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            checked={index < currentWeek.completed}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              index < currentWeek.completed 
                                ? 'text-green-900 line-through' 
                                : 'text-slate-900'
                            }`}>
                              {task}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                              Estimated time: {Math.ceil((index + 1) * 0.5)} hours
                            </p>
                            <div className="mt-3 flex items-center space-x-2">
                              {index < currentWeek.completed ? (
                                <Badge className="bg-green-500">Completed</Badge>
                              ) : index === currentWeek.completed ? (
                                <Button size="sm">
                                  Start Task
                                  <PlayCircle className="ml-1 h-3 w-3" />
                                </Button>
                              ) : (
                                <Badge variant="outline">Locked</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tools Covered */}
              <Card>
                <CardHeader>
                  <CardTitle>Tools You'll Master</CardTitle>
                  <CardDescription>
                    AI tools covered in this learning plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {plan.tools.map((tool, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">{tool}</h4>
                          <BookOpen className="h-4 w-4 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Learn the fundamentals and advanced techniques
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          View Tool Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Completion Rewards</CardTitle>
                  <CardDescription>
                    What you'll earn by completing this learning plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900">Completion Badge</h4>
                      <p className="text-sm text-slate-600">
                        Show off your newly acquired AI skills
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900">Skill Certification</h4>
                      <p className="text-sm text-slate-600">
                        Verify your knowledge with our assessment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;