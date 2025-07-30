from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any, Optional
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from models import (
    Tool, LearningPlan, User, UserProgress, AssessmentQuestion,
    AchievementBadge, UserWeekProgress, PlanWeek
)

class Database:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        self.db = self.client[os.environ['DB_NAME']]
        
        # Collections
        self.tools = self.db.tools
        self.learning_plans = self.db.learning_plans
        self.users = self.db.users
        self.user_progress = self.db.user_progress
        self.assessment_questions = self.db.assessment_questions

    async def seed_database(self):
        """Seed database with initial data"""
        
        # Check if already seeded
        if await self.tools.count_documents({}) > 0:
            return
        
        # Seed Assessment Questions
        questions_data = [
            {
                "question_id": 1,
                "question": "What's your primary role or profession?",
                "type": "single-choice",
                "options": [
                    "Software Developer",
                    "Designer/Creative",
                    "Product Manager", 
                    "Marketing Professional",
                    "Data Analyst",
                    "Entrepreneur/Founder",
                    "Student",
                    "Other"
                ],
                "order": 1,
                "active": True
            },
            {
                "question_id": 2,
                "question": "How would you rate your technical skill level?",
                "type": "single-choice",
                "options": [
                    "Beginner - Limited technical experience",
                    "Intermediate - Some coding/technical knowledge", 
                    "Advanced - Strong technical background",
                    "Expert - Deep technical expertise"
                ],
                "order": 2,
                "active": True
            },
            {
                "question_id": 3,
                "question": "What's your primary goal with AI tools?",
                "type": "single-choice",
                "options": [
                    "Increase productivity and efficiency",
                    "Learn new skills and capabilities",
                    "Build AI-powered products", 
                    "Automate repetitive tasks",
                    "Enhance creative work",
                    "Stay current with technology trends"
                ],
                "order": 3,
                "active": True
            },
            {
                "question_id": 4,
                "question": "How much time can you dedicate to learning AI tools weekly?",
                "type": "single-choice",
                "options": [
                    "1-2 hours",
                    "3-5 hours",
                    "6-10 hours",
                    "10+ hours"
                ],
                "order": 4,
                "active": True
            },
            {
                "question_id": 5,
                "question": "Which areas interest you most? (Select all that apply)",
                "type": "multiple-choice",
                "options": [
                    "Code generation and development",
                    "Content creation and writing",
                    "Image and video generation",
                    "Data analysis and insights",
                    "Workflow automation",
                    "Customer service and chatbots",
                    "Design and prototyping",
                    "Research and knowledge management"
                ],
                "order": 5,
                "active": True
            },
            {
                "question_id": 6,
                "question": "What's your experience with AI tools so far?",
                "type": "single-choice",
                "options": [
                    "Never used any AI tools",
                    "Tried a few basic tools (ChatGPT, etc.)",
                    "Regularly use 2-3 AI tools",
                    "Experienced with many AI tools"
                ],
                "order": 6,
                "active": True
            }
        ]
        
        await self.assessment_questions.insert_many(questions_data)
        
        # Seed Tools
        tools_data = [
            {
                "name": "ChatGPT",
                "category": "Conversational AI",
                "description": "Advanced language model for content creation, coding assistance, and problem-solving",
                "difficulty": "Beginner",
                "time_to_learn": "2-3 hours",
                "use_case": "Content Creation, Code Review, Problem Solving",
                "pricing": "Free + Premium",
                "rating": 4.8,
                "tags": ["AI Chat", "Content", "Coding", "Writing"],
                "features": ["Text Generation", "Code Assistance", "Conversation", "Translation"],
                "learning_path": [
                    "Basic prompting techniques",
                    "Advanced prompt engineering", 
                    "API integration",
                    "Custom GPT creation"
                ],
                "examples": [
                    {
                        "title": "Content Creation Workflow",
                        "description": "Learn how to use ChatGPT for creating blog posts, social media content, and marketing copy efficiently.",
                        "tutorial_link": "/tutorials/chatgpt-content"
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "GitHub Copilot",
                "category": "Code Assistant",
                "description": "AI-powered code completion and generation tool for developers",
                "difficulty": "Intermediate",
                "time_to_learn": "4-6 hours",
                "use_case": "Code Generation, Autocomplete, Documentation",
                "pricing": "$10/month",
                "rating": 4.6,
                "tags": ["Coding", "IDE", "Autocomplete", "Development"],
                "features": ["Code Completion", "Function Generation", "Comment to Code", "Multi-language Support"],
                "learning_path": [
                    "Setting up Copilot in your IDE",
                    "Writing effective code comments",
                    "Advanced code generation techniques",
                    "Best practices and limitations"
                ],
                "examples": [
                    {
                        "title": "API Integration Guide",
                        "description": "Step-by-step guide on integrating GitHub Copilot into your development workflow.",
                        "tutorial_link": "/tutorials/copilot-integration"
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Midjourney",
                "category": "Image Generation",
                "description": "AI art generator for creating stunning visuals from text descriptions",
                "difficulty": "Beginner",
                "time_to_learn": "3-4 hours",
                "use_case": "Art Creation, Design, Marketing Materials",
                "pricing": "$10-60/month",
                "rating": 4.7,
                "tags": ["AI Art", "Image Generation", "Design", "Creative"],
                "features": ["Text-to-Image", "Style Controls", "High Resolution", "Commercial License"],
                "learning_path": [
                    "Basic prompt writing",
                    "Understanding parameters and styles",
                    "Advanced prompt techniques",
                    "Commercial usage guidelines"
                ],
                "examples": [
                    {
                        "title": "Marketing Material Creation",
                        "description": "Create professional marketing materials using Midjourney's AI art generation.",
                        "tutorial_link": "/tutorials/midjourney-marketing"
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Notion AI",
                "category": "Productivity",
                "description": "AI-powered writing and productivity assistant integrated into Notion",
                "difficulty": "Beginner",
                "time_to_learn": "2-3 hours",
                "use_case": "Note Taking, Content Planning, Task Management",
                "pricing": "$10/month",
                "rating": 4.4,
                "tags": ["Productivity", "Writing", "Organization", "Workflow"],
                "features": ["Smart Writing", "Content Generation", "Summarization", "Translation"],
                "learning_path": [
                    "Setting up Notion AI",
                    "Writing assistance features",
                    "Content generation workflows",
                    "Integration with existing Notion setup"
                ],
                "examples": [
                    {
                        "title": "Content Planning Workflow",
                        "description": "Use Notion AI to streamline your content planning and creation process.",
                        "tutorial_link": "/tutorials/notion-content-planning"
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Zapier AI",
                "category": "Automation",
                "description": "AI-powered automation platform for connecting apps and workflows",
                "difficulty": "Intermediate",
                "time_to_learn": "5-7 hours",
                "use_case": "Workflow Automation, App Integration, Task Automation",
                "pricing": "Free + Premium tiers",
                "rating": 4.5,
                "tags": ["Automation", "Integration", "Workflow", "Productivity"],
                "features": ["App Connections", "Trigger Actions", "AI Suggestions", "Custom Workflows"],
                "learning_path": [
                    "Understanding automation basics",
                    "Creating your first Zap",
                    "Advanced trigger and action setup",
                    "AI-powered automation suggestions"
                ],
                "examples": [
                    {
                        "title": "Email Automation Setup",
                        "description": "Automate your email workflows using Zapier's AI-powered automation.",
                        "tutorial_link": "/tutorials/zapier-email-automation"
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await self.tools.insert_many(tools_data)
        
        # Seed Learning Plans
        plans_data = [
            {
                "title": "AI-Powered Developer Essentials",
                "description": "Master the core AI tools every developer needs to boost productivity",
                "duration": "4 weeks",
                "difficulty": "Beginner to Intermediate",
                "tools": ["ChatGPT", "GitHub Copilot", "Zapier AI"],
                "weeks": [
                    {
                        "week": 1,
                        "title": "Getting Started with ChatGPT",
                        "tasks": [
                            "Set up ChatGPT account and explore interface",
                            "Learn basic prompting techniques",
                            "Practice code review and debugging with ChatGPT",
                            "Create your first automated workflow"
                        ]
                    },
                    {
                        "week": 2,
                        "title": "GitHub Copilot Integration",
                        "tasks": [
                            "Install and configure Copilot in your IDE",
                            "Learn effective comment-to-code techniques",
                            "Practice function generation and completion",
                            "Build a small project using Copilot assistance"
                        ]
                    },
                    {
                        "week": 3,
                        "title": "Automation with Zapier AI",
                        "tasks": [
                            "Connect your first apps with Zapier",
                            "Create automated workflows for common tasks",
                            "Use AI suggestions for workflow optimization",
                            "Set up monitoring and error handling"
                        ]
                    },
                    {
                        "week": 4,
                        "title": "Advanced Integration & Best Practices",
                        "tasks": [
                            "Combine multiple AI tools in your workflow",
                            "Establish best practices and guidelines",
                            "Create a personal AI toolkit documentation",
                            "Plan next learning steps"
                        ]
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "Creative AI Mastery",
                "description": "Learn to harness AI for content creation, design, and marketing",
                "duration": "3 weeks",
                "difficulty": "Beginner",
                "tools": ["Midjourney", "ChatGPT", "Notion AI"],
                "weeks": [
                    {
                        "week": 1,
                        "title": "AI Art & Image Generation",
                        "tasks": [
                            "Master Midjourney basics and prompt writing",
                            "Create your first AI art collection",
                            "Learn style parameters and controls",
                            "Understand commercial usage rights"
                        ]
                    },
                    {
                        "week": 2,
                        "title": "Content Creation Workflows",
                        "tasks": [
                            "Set up content planning with Notion AI",
                            "Create blog posts and articles with AI assistance",
                            "Develop social media content strategies",
                            "Build reusable content templates"
                        ]
                    },
                    {
                        "week": 3,
                        "title": "Integrated Creative Workflow",
                        "tasks": [
                            "Combine tools for end-to-end content creation",
                            "Create brand guidelines and style consistency",
                            "Build portfolio showcasing AI-created work",
                            "Develop client delivery processes"
                        ]
                    }
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await self.learning_plans.insert_many(plans_data)
        
        print("Database seeded successfully!")

    # Tool Operations
    async def get_tools(self, category: str = None, search: str = None, difficulty: str = None, sort_by: str = "rating"):
        """Get tools with optional filtering"""
        query = {}
        
        if category and category != "All Tools":
            query["category"] = category
        
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}}
            ]
        
        if difficulty:
            query["difficulty"] = difficulty
        
        # Sort logic
        sort_field = "rating"
        sort_order = -1
        if sort_by == "name":
            sort_field = "name"
            sort_order = 1
        elif sort_by == "difficulty":
            difficulty_order = {"Beginner": 1, "Intermediate": 2, "Advanced": 3}
            # For now, use rating sort for difficulty
            pass
        
        tools = await self.tools.find(query).sort(sort_field, sort_order).to_list(1000)
        categories = await self.tools.distinct("category")
        categories.insert(0, "All Tools")
        
        return {
            "tools": tools,
            "categories": categories
        }

    async def get_tool_by_id(self, tool_id: str):
        """Get specific tool by ID"""
        if not ObjectId.is_valid(tool_id):
            return None
        return await self.tools.find_one({"_id": ObjectId(tool_id)})

    async def get_tool_by_name(self, name: str):
        """Get tool by name"""
        return await self.tools.find_one({"name": name})

    # Learning Plan Operations
    async def get_learning_plans(self, search: str = None, sort_by: str = "title"):
        """Get learning plans with optional filtering"""
        query = {}
        
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tools": {"$regex": search, "$options": "i"}}
            ]
        
        sort_field = "title"
        sort_order = 1
        if sort_by == "duration":
            sort_field = "duration"
        
        plans = await self.learning_plans.find(query).sort(sort_field, sort_order).to_list(1000)
        return {"plans": plans}

    async def get_learning_plan_by_id(self, plan_id: str):
        """Get specific learning plan by ID"""
        if not ObjectId.is_valid(plan_id):
            return None
        return await self.learning_plans.find_one({"_id": ObjectId(plan_id)})

    # User Operations
    async def create_or_get_user(self, email: str, name: str = None):
        """Create new user or get existing user"""
        user = await self.users.find_one({"email": email})
        if user:
            return user
        
        new_user = {
            "name": name or email.split("@")[0],
            "email": email,
            "assessment_completed": False,
            "assessment_answers": {},
            "skill_level": None,
            "primary_goal": None,
            "time_available": None,
            "interests": [],
            "joined_date": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.users.insert_one(new_user)
        new_user["_id"] = result.inserted_id
        return new_user

    async def update_user_assessment(self, user_id: str, answers: Dict[str, Any]):
        """Update user assessment answers and profile"""
        if not ObjectId.is_valid(user_id):
            return None
        
        # Extract profile information from answers
        profile_mapping = {
            "1": "role",
            "2": "skill_level", 
            "3": "primary_goal",
            "4": "time_available",
            "5": "interests",
            "6": "experience_level"
        }
        
        update_data = {
            "assessment_completed": True,
            "assessment_answers": answers,
            "updated_at": datetime.utcnow()
        }
        
        # Map answers to profile fields
        for q_id, answer in answers.items():
            if q_id in profile_mapping:
                field = profile_mapping[q_id]
                if field == "interests" and isinstance(answer, list):
                    update_data[field] = answer
                elif field != "interests":
                    update_data[field] = answer
        
        await self.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        return await self.users.find_one({"_id": ObjectId(user_id)})

    async def get_assessment_questions(self):
        """Get all assessment questions"""
        questions = await self.assessment_questions.find({"active": True}).sort("order", 1).to_list(1000)
        return questions

    # Progress Operations
    async def get_user_progress(self, user_id: str):
        """Get user's learning progress"""
        if not ObjectId.is_valid(user_id):
            return None
        
        progress_records = await self.user_progress.find({"user_id": ObjectId(user_id)}).to_list(1000)
        return progress_records

    async def create_user_progress(self, user_id: str, learning_plan_id: str):
        """Create new progress record for user and learning plan"""
        if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(learning_plan_id):
            return None
        
        # Check if progress already exists
        existing = await self.user_progress.find_one({
            "user_id": ObjectId(user_id),
            "learning_plan_id": ObjectId(learning_plan_id)
        })
        
        if existing:
            return existing
        
        # Get learning plan to initialize progress
        plan = await self.get_learning_plan_by_id(learning_plan_id)
        if not plan:
            return None
        
        # Initialize achievement badges
        default_badges = [
            {
                "name": "First Steps",
                "description": "Completed your first tool exploration",
                "earned": False
            },
            {
                "name": "Quick Learner",
                "description": "Mastered a tool in under 3 days",
                "earned": False
            },
            {
                "name": "Consistency King",
                "description": "Maintained 7-day learning streak",
                "earned": False
            },
            {
                "name": "Tool Explorer",
                "description": "Explored 10+ different AI tools",
                "earned": False
            }
        ]
        
        new_progress = {
            "user_id": ObjectId(user_id),
            "learning_plan_id": ObjectId(learning_plan_id),
            "progress_percentage": 0,
            "current_week": 1,
            "weeks_progress": [],
            "tools_explored": [],
            "tools_mastered": [],
            "weekly_streak": 0,
            "total_hours_learned": 0,
            "achievement_badges": default_badges,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.user_progress.insert_one(new_progress)
        new_progress["_id"] = result.inserted_id
        return new_progress

# Global database instance
db = Database()