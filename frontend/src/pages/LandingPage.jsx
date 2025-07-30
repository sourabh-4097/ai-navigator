import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Brain, Target, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart Recommendations",
      description: "Get personalized AI tool suggestions based on your skill level, goals, and interests"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Structured Learning Paths",
      description: "Follow curated learning plans designed by experts to master AI tools effectively"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achievement badges"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Practical Tutorials",
      description: "Learn through hands-on examples, code snippets, and real-world use cases"
    }
  ];

  const benefits = [
    "Cut through AI tool overwhelm with curated recommendations",
    "Learn at your own pace with structured learning paths", 
    "Track progress and build momentum with gamification",
    "Join a community of learners and share experiences",
    "Stay updated with the latest AI tools and trends"
  ];

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
            <Button onClick={() => navigate('/assessment')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Users className="h-4 w-4 mr-2" />
              Join 10,000+ learners already navigating AI
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Stop drowning in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800"> AI tool chaos</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              There are thousands of AI tools out there. We help you find the right ones, 
              learn them effectively, and actually use them to boost your productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/assessment')}
                className="text-lg px-8 py-6 bg-slate-900 hover:bg-slate-800"
              >
                Take Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/tools')}
                className="text-lg px-8 py-6"
              >
                Browse Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Sound familiar?
            </h2>
            <p className="text-lg text-slate-600">
              You're not alone in feeling overwhelmed by the AI tool landscape
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-l-4 border-l-red-500">
              <CardContent className="p-0">
                <h3 className="font-semibold text-slate-900 mb-3">The Problem</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• 500+ new AI tools launched every month</li>
                  <li>• No clear path to learn what matters</li>
                  <li>• Paralysis by analysis - too many choices</li>
                  <li>• Wasted time on tools that don't fit your needs</li>
                  <li>• Missing out on productivity gains</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="p-6 border-l-4 border-l-green-500">
              <CardContent className="p-0">
                <h3 className="font-semibold text-slate-900 mb-3">Our Solution</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Personalized tool recommendations</li>
                  <li>• Structured learning paths for each tool</li>
                  <li>• Progress tracking and gamification</li>
                  <li>• Real-world examples and tutorials</li>
                  <li>• Community-driven insights and reviews</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600">
              Your personalized journey to AI tool mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why choose AI Navigator?
            </h2>
            <p className="text-lg text-slate-600">
              Stop wasting time and start learning effectively
            </p>
          </div>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to master AI tools?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Take our 2-minute assessment and get your personalized learning path
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/assessment')}
            className="text-lg px-8 py-6 bg-white text-slate-900 hover:bg-slate-100"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-100">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-slate-700" />
            <span className="text-lg font-semibold text-slate-700">AI Navigator</span>
          </div>
          <p className="text-slate-600">
            © 2024 AI Navigator. Helping you navigate the AI landscape effectively.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;