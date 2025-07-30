// Mock data for AI Tool Learning Navigator

export const mockTools = [
  {
    id: 1,
    name: "ChatGPT",
    category: "Conversational AI",
    description: "Advanced language model for content creation, coding assistance, and problem-solving",
    difficulty: "Beginner",
    timeToLearn: "2-3 hours",
    useCase: "Content Creation, Code Review, Problem Solving",
    pricing: "Free + Premium",
    rating: 4.8,
    tags: ["AI Chat", "Content", "Coding", "Writing"],
    features: ["Text Generation", "Code Assistance", "Conversation", "Translation"],
    learningPath: [
      "Basic prompting techniques",
      "Advanced prompt engineering", 
      "API integration",
      "Custom GPT creation"
    ]
  },
  {
    id: 2,
    name: "GitHub Copilot",
    category: "Code Assistant",
    description: "AI-powered code completion and generation tool for developers",
    difficulty: "Intermediate",
    timeToLearn: "4-6 hours",
    useCase: "Code Generation, Autocomplete, Documentation",
    pricing: "$10/month",
    rating: 4.6,
    tags: ["Coding", "IDE", "Autocomplete", "Development"],
    features: ["Code Completion", "Function Generation", "Comment to Code", "Multi-language Support"],
    learningPath: [
      "Setting up Copilot in your IDE",
      "Writing effective code comments",
      "Advanced code generation techniques",
      "Best practices and limitations"
    ]
  },
  {
    id: 3,
    name: "Midjourney",
    category: "Image Generation",
    description: "AI art generator for creating stunning visuals from text descriptions",
    difficulty: "Beginner",
    timeToLearn: "3-4 hours",
    useCase: "Art Creation, Design, Marketing Materials",
    pricing: "$10-60/month",
    rating: 4.7,
    tags: ["AI Art", "Image Generation", "Design", "Creative"],
    features: ["Text-to-Image", "Style Controls", "High Resolution", "Commercial License"],
    learningPath: [
      "Basic prompt writing",
      "Understanding parameters and styles",
      "Advanced prompt techniques",
      "Commercial usage guidelines"
    ]
  },
  {
    id: 4,
    name: "Notion AI",
    category: "Productivity",
    description: "AI-powered writing and productivity assistant integrated into Notion",
    difficulty: "Beginner",
    timeToLearn: "2-3 hours",
    useCase: "Note Taking, Content Planning, Task Management",
    pricing: "$10/month",
    rating: 4.4,
    tags: ["Productivity", "Writing", "Organization", "Workflow"],
    features: ["Smart Writing", "Content Generation", "Summarization", "Translation"],
    learningPath: [
      "Setting up Notion AI",
      "Writing assistance features",
      "Content generation workflows",
      "Integration with existing Notion setup"
    ]
  },
  {
    id: 5,
    name: "Zapier AI",
    category: "Automation",
    description: "AI-powered automation platform for connecting apps and workflows",
    difficulty: "Intermediate",
    timeToLearn: "5-7 hours",
    useCase: "Workflow Automation, App Integration, Task Automation",
    pricing: "Free + Premium tiers",
    rating: 4.5,
    tags: ["Automation", "Integration", "Workflow", "Productivity"],
    features: ["App Connections", "Trigger Actions", "AI Suggestions", "Custom Workflows"],
    learningPath: [
      "Understanding automation basics",
      "Creating your first Zap",
      "Advanced trigger and action setup",
      "AI-powered automation suggestions"
    ]
  }
];

export const mockCategories = [
  "All Tools",
  "Conversational AI", 
  "Code Assistant",
  "Image Generation", 
  "Productivity",
  "Automation",
  "Data Analysis",
  "Content Creation"
];

export const mockLearningPlans = [
  {
    id: 1,
    title: "AI-Powered Developer Essentials",
    description: "Master the core AI tools every developer needs to boost productivity",
    duration: "4 weeks",
    difficulty: "Beginner to Intermediate",
    tools: ["ChatGPT", "GitHub Copilot", "Zapier AI"],
    progress: 65,
    weeks: [
      {
        week: 1,
        title: "Getting Started with ChatGPT",
        tasks: [
          "Set up ChatGPT account and explore interface",
          "Learn basic prompting techniques",
          "Practice code review and debugging with ChatGPT",
          "Create your first automated workflow"
        ],
        completed: 4
      },
      {
        week: 2,
        title: "GitHub Copilot Integration",
        tasks: [
          "Install and configure Copilot in your IDE",
          "Learn effective comment-to-code techniques",
          "Practice function generation and completion",
          "Build a small project using Copilot assistance"
        ],
        completed: 3
      },
      {
        week: 3,
        title: "Automation with Zapier AI",
        tasks: [
          "Connect your first apps with Zapier",
          "Create automated workflows for common tasks",
          "Use AI suggestions for workflow optimization",
          "Set up monitoring and error handling"
        ],
        completed: 1
      },
      {
        week: 4,
        title: "Advanced Integration & Best Practices",
        tasks: [
          "Combine multiple AI tools in your workflow",
          "Establish best practices and guidelines",
          "Create a personal AI toolkit documentation",
          "Plan next learning steps"
        ],
        completed: 0
      }
    ]
  },
  {
    id: 2,
    title: "Creative AI Mastery",
    description: "Learn to harness AI for content creation, design, and marketing",
    duration: "3 weeks",
    difficulty: "Beginner",
    tools: ["Midjourney", "ChatGPT", "Notion AI"],
    progress: 30,
    weeks: [
      {
        week: 1,
        title: "AI Art & Image Generation",
        tasks: [
          "Master Midjourney basics and prompt writing",
          "Create your first AI art collection",
          "Learn style parameters and controls",
          "Understand commercial usage rights"
        ],
        completed: 2
      },
      {
        week: 2,
        title: "Content Creation Workflows",
        tasks: [
          "Set up content planning with Notion AI",
          "Create blog posts and articles with AI assistance",
          "Develop social media content strategies",
          "Build reusable content templates"
        ],
        completed: 1
      },
      {
        week: 3,
        title: "Integrated Creative Workflow",
        tasks: [
          "Combine tools for end-to-end content creation",
          "Create brand guidelines and style consistency",
          "Build portfolio showcasing AI-created work",
          "Develop client delivery processes"
        ],
        completed: 0
      }
    ]
  }
];

export const mockUserProfile = {
  name: "Alex Chen",
  email: "alex@example.com",
  skillLevel: "Intermediate",
  primaryGoal: "Boost development productivity",
  timeAvailable: "5-10 hours/week",
  technicalBackground: "Full-stack developer with 3+ years experience",
  interests: ["Web Development", "Automation", "AI Integration"],
  completedAssessment: true,
  joinedDate: "2024-01-15",
  toolsExplored: 8,
  plansCompleted: 1,
  weeklyStreak: 3
};

export const mockAssessmentQuestions = [
  {
    id: 1,
    question: "What's your primary role or profession?",
    type: "single-choice",
    options: [
      "Software Developer",
      "Designer/Creative",
      "Product Manager", 
      "Marketing Professional",
      "Data Analyst",
      "Entrepreneur/Founder",
      "Student",
      "Other"
    ]
  },
  {
    id: 2,
    question: "How would you rate your technical skill level?",
    type: "single-choice",
    options: [
      "Beginner - Limited technical experience",
      "Intermediate - Some coding/technical knowledge", 
      "Advanced - Strong technical background",
      "Expert - Deep technical expertise"
    ]
  },
  {
    id: 3,
    question: "What's your primary goal with AI tools?",
    type: "single-choice",
    options: [
      "Increase productivity and efficiency",
      "Learn new skills and capabilities",
      "Build AI-powered products", 
      "Automate repetitive tasks",
      "Enhance creative work",
      "Stay current with technology trends"
    ]
  },
  {
    id: 4,
    question: "How much time can you dedicate to learning AI tools weekly?",
    type: "single-choice",
    options: [
      "1-2 hours",
      "3-5 hours",
      "6-10 hours",
      "10+ hours"
    ]
  },
  {
    id: 5,
    question: "Which areas interest you most? (Select all that apply)",
    type: "multiple-choice",
    options: [
      "Code generation and development",
      "Content creation and writing",
      "Image and video generation",
      "Data analysis and insights",
      "Workflow automation",
      "Customer service and chatbots",
      "Design and prototyping",
      "Research and knowledge management"
    ]
  },
  {
    id: 6,
    question: "What's your experience with AI tools so far?",
    type: "single-choice",
    options: [
      "Never used any AI tools",
      "Tried a few basic tools (ChatGPT, etc.)",
      "Regularly use 2-3 AI tools",
      "Experienced with many AI tools"
    ]
  }
];

export const mockProgress = {
  totalTools: 12,
  toolsExplored: 8,
  toolsMastered: 3, 
  activePlans: 2,
  completedPlans: 1,
  weeklyStreak: 3,
  totalHoursLearned: 24,
  achievementBadges: [
    { name: "First Steps", description: "Completed your first tool exploration", earned: true },
    { name: "Quick Learner", description: "Mastered a tool in under 3 days", earned: true },
    { name: "Consistency King", description: "Maintained 7-day learning streak", earned: false },
    { name: "Tool Explorer", description: "Explored 10+ different AI tools", earned: false }
  ]
};