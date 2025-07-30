import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toolService } from "../services/api";
import { useToast } from "../hooks/use-toast";

const ToolDetail = () => {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true);
        const toolData = await toolService.getToolById(id);
        setTool(toolData);
      } catch (error) {
        console.error("Error fetching tool:", error);
        toast({
          title: "Error",
          description: "Failed to load tool details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl">Tool not found.</p>
          <Link to="/tools" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Tool Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/tools" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Tool Directory
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <div className="flex items-center mt-2 md:mt-0">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
              {tool.difficulty}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{tool.rating}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 text-lg mb-6">{tool.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Details</h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium w-32">Category:</span>
                <span>{tool.category}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Time to Learn:</span>
                <span>{tool.time_to_learn}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Use Case:</span>
                <span>{tool.use_case}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Pricing:</span>
                <span>{tool.pricing}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tool.tags && tool.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Key Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              {tool.features && tool.features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Learning Path</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {tool.learning_path && tool.learning_path.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            Add to My Learning Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;