import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  Star, 
  ArrowRight,
  Award,
  BookOpen,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUserProfile, mockTools, mockLearningPlans, mockProgress } from '../data/mock';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = mockUserProfile;
  const recommendedTools = mockTools.slice(0, 3);
  const activePlans = mockLearningPlans;
  const progress = mockProgress;

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
            <Button variant="ghost" onClick={() => navigate('/tools')}>
              Browse Tools
            </Button>
            <Button variant="ghost" onClick={() => navigate('/learning-plans')}>
              Learning Plans
            </Button>
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-600">
            Ready to continue your AI learning journey? Here's what's waiting for you.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tools Explored</p>
                  <p className="text-2xl font-bold text-slate-900">{progress.toolsExplored}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tools Mastered</p>
                  <p className="text-2xl font-bold text-slate-900">{progress.toolsMastered}</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Plans</p>
                  <p className="text-2xl font-bold text-slate-900">{progress.activePlans}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Learning Streak</p>
                  <p className="text-2xl font-bold text-slate-900">{progress.weeklyStreak} days</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  AI tools perfectly matched to your goals and skill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedTools.map((tool) => (
                    <div key={tool.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{tool.name}</h3>
                        <Badge variant="secondary">{tool.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{tool.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {tool.timeToLearn}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            {tool.rating}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/tool/${tool.id}`)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button onClick={() => navigate('/tools')} className="w-full">
                    View All Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Learning Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Your Learning Plans
                </CardTitle>
                <CardDescription>
                  Continue your structured learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activePlans.map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">{plan.title}</h3>
                        <Badge variant="outline">{plan.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="w-full" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          Duration: {plan.duration}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/plan/${plan.id}`)}
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => navigate('/learning-plans')} className="w-full">
                    Browse All Learning Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/tools')} className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Tools
                </Button>
                <Button onClick={() => navigate('/learning-plans')} variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  View Learning Plans
                </Button>
                <Button onClick={() => navigate('/assessment')} variant="outline" className="w-full justify-start">
                  <Brain className="mr-2 h-4 w-4" />
                  Retake Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Badges you've earned on your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {progress.achievementBadges.map((badge, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border text-center ${
                        badge.earned 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}
                    >
                      <Award className={`h-6 w-6 mx-auto mb-1 ${
                        badge.earned ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <p className="text-xs font-medium">{badge.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Hours</span>
                  <span className="font-medium">{progress.totalHoursLearned}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Completion Rate</span>
                  <span className="font-medium">
                    {Math.round((progress.toolsMastered / progress.toolsExplored) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Current Streak</span>
                  <span className="font-medium">{progress.weeklyStreak} days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;