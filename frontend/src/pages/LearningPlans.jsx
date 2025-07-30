import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Brain, 
  Search, 
  Target, 
  Clock, 
  ArrowRight,
  BookOpen,
  CheckCircle,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockLearningPlans } from '../data/mock';

const LearningPlans = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('progress');
  
  const filteredPlans = mockLearningPlans
    .filter(plan => 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'progress': return b.progress - a.progress;
        case 'duration': return parseInt(a.duration) - parseInt(b.duration);
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const PlanCard = ({ plan }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-xl">{plan.title}</CardTitle>
          <Badge variant="outline">{plan.difficulty}</Badge>
        </div>
        <CardDescription className="text-base">
          {plan.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {plan.duration}
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {plan.tools.length} tools
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {plan.tools.map((tool, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tool}
              </Badge>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium">{plan.progress}%</span>
            </div>
            <Progress value={plan.progress} className="w-full" />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-slate-900">Weekly Breakdown:</h4>
            {plan.weeks.map((week, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Week {week.week}: {week.title}</span>
                <div className="flex items-center">
                  <span className="text-slate-500 mr-2">{week.completed}/{week.tasks.length}</span>
                  {week.completed === week.tasks.length ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate(`/plan/${plan.id}`)} 
            className="w-full"
            variant={plan.progress > 0 ? "default" : "outline"}
          >
            {plan.progress > 0 ? 'Continue Learning' : 'Start Plan'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/tools')}>
              Browse Tools
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Plans</h1>
          <p className="text-slate-600">
            Structured learning paths designed to help you master AI tools effectively
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search learning plans or tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress">Sort by Progress</SelectItem>
                  <SelectItem value="duration">Sort by Duration</SelectItem>
                  <SelectItem value="title">Sort by Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              {filteredPlans.length} learning plans available
            </span>
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </Button>
            )}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    🎯 Personalized Recommendations
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Based on your assessment, we've curated learning plans specifically for your goals and skill level.
                  </p>
                </div>
                <Button onClick={() => navigate('/assessment')}>
                  Retake Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* No Results */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No learning plans found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search terms to find the perfect learning plan for you.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear search
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12">
          <Card className="bg-slate-900 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to start your AI learning journey?
              </h3>
              <p className="text-slate-300 mb-6">
                Join thousands of learners who are mastering AI tools with our structured learning plans.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button variant="secondary" onClick={() => navigate('/tools')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Tools
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningPlans;