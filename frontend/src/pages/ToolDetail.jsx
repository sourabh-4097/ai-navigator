import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Brain, 
  ArrowLeft, 
  Star, 
  Clock, 
  DollarSign,
  CheckCircle,
  PlayCircle,
  BookOpen,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toolsAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const ToolDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [tool, setTool] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTool();
  }, [id]);

  const loadTool = async () => {
    try {
      setIsLoading(true);
      const data = await toolsAPI.getTool(id);
      setTool(data);
    } catch (error) {
      console.error('Error loading tool:', error);
      toast({
        title: "Error loading tool",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading tool details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Tool not found</h2>
            <p className="text-slate-600 mb-4">The AI tool you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/tools')}>
              Back to Tools
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{tool.name}</h1>
              <p className="text-xl text-slate-600">{tool.description}</p>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {tool.difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-semibold">{tool.rating}</span>
              <span className="text-slate-500 ml-1">rating</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span>{tool.time_to_learn} to learn</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <span>{tool.pricing}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 mb-4">{tool.description}</p>
                    <p className="text-slate-600">
                      This tool is perfect for {tool.use_case.toLowerCase()} and is designed for users with {tool.difficulty.toLowerCase()} experience level.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Use Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">
                      {tool.name} is commonly used for: <strong>{tool.use_case}</strong>
                    </p>
                    <div className="mt-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Popular Applications:</h4>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Content creation and copywriting</li>
                        <li>• Customer service automation</li>
                        <li>• Data analysis and insights</li>
                        <li>• Workflow optimization</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="learning-path" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Roadmap</CardTitle>
                    <CardDescription>
                      Follow this structured path to master {tool.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tool.learning_path.map((step, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            index <= currentStep 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                index <= currentStep 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-slate-300 text-slate-600'
                              }`}>
                                {index <= currentStep ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900">
                                  Step {index + 1}: {step}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Estimated time: {Math.ceil((index + 1) * 0.5)} hours
                                </p>
                              </div>
                            </div>
                            {index === currentStep + 1 && (
                              <Button 
                                size="sm"
                                onClick={() => setCurrentStep(index)}
                              >
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-900">Progress</span>
                        <span className="text-sm text-blue-700">
                          {Math.round(((currentStep + 1) / tool.learning_path.length) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={((currentStep + 1) / tool.learning_path.length) * 100} 
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Real-world Examples</CardTitle>
                    <CardDescription>
                      See how {tool.name} is used in practice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {tool.examples && tool.examples.length > 0 ? (
                        tool.examples.map((example, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-slate-900 mb-2">
                              {example.title}
                            </h4>
                            <p className="text-slate-600 mb-3">
                              {example.description}
                            </p>
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Tutorial
                            </Button>
                          </div>
                        ))
                      ) : (
                        // Default examples if none provided
                        <>
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-slate-900 mb-2">
                              Example 1: Content Creation Workflow
                            </h4>
                            <p className="text-slate-600 mb-3">
                              Learn how to use {tool.name} for creating blog posts, social media content, 
                              and marketing copy efficiently.
                            </p>
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Tutorial
                            </Button>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-slate-900 mb-2">
                              Example 2: API Integration
                            </h4>
                            <p className="text-slate-600 mb-3">
                              Step-by-step guide on integrating {tool.name} into your existing 
                              applications and workflows.
                            </p>
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Code Examples
                            </Button>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-slate-900 mb-2">
                              Example 3: Advanced Use Cases
                            </h4>
                            <p className="text-slate-600 mb-3">
                              Explore advanced techniques and best practices for power users 
                              of {tool.name}.
                            </p>
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Advanced Guide
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add to Learning Plan
                </Button>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Official Site
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tool Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Estimated Time</span>
                  <span className="font-medium">{tool.time_to_learn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Difficulty</span>
                  <Badge variant="secondary">{tool.difficulty}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">User Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{tool.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;