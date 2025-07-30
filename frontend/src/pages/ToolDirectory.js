import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toolService } from "../services/api";
import { useToast } from "../hooks/use-toast";

const ToolDirectory = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Tools");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all tools
        const toolsData = await toolService.getAllTools();
        setTools(toolsData);

        // Fetch all categories
        const categoriesData = await toolService.getAllCategories();
        setCategories(["All Tools", ...categoriesData.map(cat => cat.name)]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load tools. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter tools based on selected category and difficulty
  const filteredTools = tools.filter((tool) => {
    const categoryMatch = selectedCategory === "All Tools" || tool.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "All Levels" || tool.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Tool Directory</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="All Levels">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
      
      {/* Tool Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading tools...</p>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">No tools found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{tool.name}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tool.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="mb-4">
                  <span className="text-sm font-medium">Category: </span>
                  <span className="text-sm text-gray-600">{tool.category}</span>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium">Time to Learn: </span>
                  <span className="text-sm text-gray-600">{tool.time_to_learn}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags && tool.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/tool/${tool.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolDirectory;