import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Brain, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  ArrowRight,
  Grid3X3,
  List,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toolsAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const ToolDirectory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState(['All Tools']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tools');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, [selectedCategory, sortBy, searchTerm]);

  const loadTools = async () => {
    try {
      setIsLoading(true);
      const filters = {
        category: selectedCategory !== 'All Tools' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        sort_by: sortBy
      };
      
      const data = await toolsAPI.getTools(filters);
      setTools(data.tools);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error loading tools:', error);
      toast({
        title: "Error loading tools",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ToolCard = ({ tool }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/tool/${tool._id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{tool.name}</CardTitle>
            <CardDescription className="mt-1">{tool.category}</CardDescription>
          </div>
          <Badge variant="secondary">{tool.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{tool.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {tool.time_to_learn}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            {tool.rating}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">{tool.pricing}</span>
          <Button size="sm">
            Learn More
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ToolListItem = ({ tool }) => (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer" onClick={() => navigate(`/tool/${tool._id}`)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
              <Badge variant="secondary">{tool.difficulty}</Badge>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                {tool.rating}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{tool.description}</p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>{tool.category}</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {tool.time_to_learn}
              </div>
              <span>{tool.pricing}</span>
            </div>
          </div>
          <Button>
            Learn More
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
            <Button variant="ghost" onClick={() => navigate('/learning-plans')}>
              Learning Plans
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Tool Directory</h1>
          <p className="text-slate-600">
            Discover and explore {tools.length} carefully curated AI tools to boost your productivity
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search tools, categories, or use cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              {isLoading ? 'Loading...' : `${tools.length} tools found`}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {/* Tools Grid/List */}
        {!isLoading && tools.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <ToolCard key={tool._id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tools.map((tool) => (
                  <ToolListItem key={tool._id} tool={tool} />
                ))}
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && tools.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tools found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Tools');
            }}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolDirectory;