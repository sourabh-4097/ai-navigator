import asyncio
import json
import os
from datetime import datetime
import uuid

from ..core.database import db
from ..core.auth import get_password_hash
from ..models.tool import Tool, Category
from ..models.learning_plan import LearningPlan, PlanWeek, PlanTask
from ..models.assessment import AssessmentQuestion, AssessmentOption
from ..models.user import UserInDB

async def seed_categories():
    """Seed categories into the database"""
    print("Seeding categories...")
    categories = [
        "AI Assistants",
        "Code Generation",
        "Content Creation",
        "Data Analysis",
        "Image Generation",
        "Productivity",
        "Research",
        "Video Generation",
        "Voice & Audio",
        "Other"
    ]
    
    category_collection = db.get_db().categories
    
    for category_name in categories:
        # Check if category already exists
        existing = await category_collection.find_one({"name": category_name})
        if not existing:
            category = {
                "id": str(uuid.uuid4()),
                "name": category_name
            }
            await category_collection.insert_one(category)
    
    print("Categories seeded successfully!")

async def seed_tools():
    """Seed tools into the database"""
    print("Seeding tools...")
    tools = [
        {
            "name": "ChatGPT",
            "category": "AI Assistants",
            "description": "A powerful AI assistant that can help with writing, answering questions, and generating creative content.",
            "difficulty": "Beginner",
            "time_to_learn": "1-2 hours",
            "use_case": "Content creation, programming assistance, learning new topics",
            "pricing": "Free tier available, $20/month for Plus",
            "rating": 4.8,
            "tags": ["AI Assistant", "Writing", "Programming", "Learning"],
            "features": [
                "Natural language understanding",
                "Code generation and debugging",
                "Creative writing assistance",
                "Knowledge up to a training cutoff date"
            ],
            "learning_path": [
                "Create an account",
                "Try basic prompts",
                "Learn prompt engineering techniques",
                "Experiment with different use cases"
            ]
        },
        {
            "name": "Midjourney",
            "category": "Image Generation",
            "description": "An AI tool that generates images from text descriptions.",
            "difficulty": "Intermediate",
            "time_to_learn": "3-5 hours",
            "use_case": "Creating artwork, design concepts, visual storytelling",
            "pricing": "Starting at $10/month",
            "rating": 4.7,
            "tags": ["Image Generation", "Art", "Design", "Creative"],
            "features": [
                "High-quality image generation",
                "Style customization",
                "Variations of generated images",
                "Community showcase"
            ],
            "learning_path": [
                "Join Discord server",
                "Learn basic prompt structure",
                "Understand parameters and modifiers",
                "Practice with different styles and concepts"
            ]
        },
        {
            "name": "GitHub Copilot",
            "category": "Code Generation",
            "description": "AI pair programmer that helps you write code faster with suggestions based on comments and context.",
            "difficulty": "Beginner",
            "time_to_learn": "2-3 hours",
            "use_case": "Coding assistance, learning new programming languages, increasing productivity",
            "pricing": "$10/month or $100/year",
            "rating": 4.6,
            "tags": ["Programming", "Code Generation", "Developer Tool"],
            "features": [
                "Real-time code suggestions",
                "Works in multiple programming languages",
                "IDE integration",
                "Comment-to-code generation"
            ],
            "learning_path": [
                "Install the extension in your IDE",
                "Start with simple coding tasks",
                "Learn to write descriptive comments",
                "Practice refining suggestions"
            ]
        },
        {
            "name": "Notion AI",
            "category": "Productivity",
            "description": "AI writing assistant integrated into Notion that helps with drafting, editing, and summarizing content.",
            "difficulty": "Beginner",
            "time_to_learn": "1-2 hours",
            "use_case": "Note-taking, content creation, summarization, brainstorming",
            "pricing": "$10/month on top of Notion subscription",
            "rating": 4.5,
            "tags": ["Writing", "Productivity", "Note-taking", "Summarization"],
            "features": [
                "Draft writing assistance",
                "Content summarization",
                "Translation capabilities",
                "Brainstorming help"
            ],
            "learning_path": [
                "Enable Notion AI in your workspace",
                "Try basic writing commands",
                "Use summarization features",
                "Experiment with different content types"
            ]
        },
        {
            "name": "DALL-E",
            "category": "Image Generation",
            "description": "OpenAI's image generation model that creates images from text descriptions.",
            "difficulty": "Beginner",
            "time_to_learn": "1-2 hours",
            "use_case": "Creating visual content, conceptualizing ideas, design inspiration",
            "pricing": "Credit-based system, starts free",
            "rating": 4.6,
            "tags": ["Image Generation", "Design", "Creative", "OpenAI"],
            "features": [
                "Text-to-image generation",
                "Edit existing images",
                "Generate variations",
                "Outpainting and inpainting"
            ],
            "learning_path": [
                "Create an OpenAI account",
                "Learn basic prompt structure",
                "Experiment with different styles",
                "Practice refining prompts for better results"
            ]
        }
    ]
    
    tool_collection = db.get_db().tools
    
    for tool_data in tools:
        # Check if tool already exists
        existing = await tool_collection.find_one({"name": tool_data["name"]})
        if not existing:
            tool = {
                "id": str(uuid.uuid4()),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                **tool_data
            }
            await tool_collection.insert_one(tool)
    
    print("Tools seeded successfully!")

async def seed_learning_plans():
    """Seed learning plans into the database"""
    print("Seeding learning plans...")
    plans = [
        {
            "title": "AI Assistant Mastery",
            "description": "Learn how to effectively use AI assistants like ChatGPT to boost your productivity and creativity.",
            "duration": "4 weeks",
            "difficulty": "Beginner",
            "tools": ["ChatGPT"],
            "weeks": [
                {
                    "week": 1,
                    "title": "Getting Started with AI Assistants",
                    "tasks": [
                        "Create accounts on major AI assistant platforms",
                        "Learn basic prompt structure",
                        "Complete 3 simple tasks with an AI assistant",
                        "Compare results from different assistants"
                    ]
                },
                {
                    "week": 2,
                    "title": "Advanced Prompting Techniques",
                    "tasks": [
                        "Learn about prompt engineering",
                        "Practice role-based prompting",
                        "Try chain-of-thought prompting",
                        "Create a complex creative project with AI assistance"
                    ]
                },
                {
                    "week": 3,
                    "title": "Specialized Use Cases",
                    "tasks": [
                        "Use AI for code generation and debugging",
                        "Create content with AI assistance",
                        "Use AI for research and summarization",
                        "Build a personal knowledge base with AI"
                    ]
                },
                {
                    "week": 4,
                    "title": "Integration into Workflow",
                    "tasks": [
                        "Set up AI tools in your daily workflow",
                        "Create templates for common tasks",
                        "Measure productivity improvements",
                        "Share your learnings with others"
                    ]
                }
            ]
        },
        {
            "title": "Code Generation with AI",
            "description": "Master the use of AI coding assistants to write better code faster.",
            "duration": "3 weeks",
            "difficulty": "Intermediate",
            "tools": ["GitHub Copilot"],
            "weeks": [
                {
                    "week": 1,
                    "title": "Setting Up AI Coding Tools",
                    "tasks": [
                        "Install GitHub Copilot in your IDE",
                        "Configure settings for optimal suggestions",
                        "Complete a simple coding task with AI assistance",
                        "Learn to write effective comments for better suggestions"
                    ]
                },
                {
                    "week": 2,
                    "title": "Building Projects with AI Assistance",
                    "tasks": [
                        "Start a new coding project with AI assistance",
                        "Use AI to help with documentation",
                        "Refactor existing code with AI suggestions",
                        "Debug problems with AI help"
                    ]
                },
                {
                    "week": 3,
                    "title": "Advanced AI Coding Techniques",
                    "tasks": [
                        "Learn to generate complex algorithms with AI",
                        "Use AI to explore unfamiliar libraries and frameworks",
                        "Build a complete feature with minimal manual coding",
                        "Evaluate code quality and performance"
                    ]
                }
            ]
        }
    ]
    
    plan_collection = db.get_db().learning_plans
    
    for plan_data in plans:
        # Check if plan already exists
        existing = await plan_collection.find_one({"title": plan_data["title"]})
        if not existing:
            # Process weeks and tasks
            weeks = []
            for week_data in plan_data["weeks"]:
                tasks = []
                for task_description in week_data["tasks"]:
                    task = {
                        "id": str(uuid.uuid4()),
                        "description": task_description,
                        "completed": False
                    }
                    tasks.append(task)
                
                week = {
                    "week": week_data["week"],
                    "title": week_data["title"],
                    "tasks": tasks,
                    "completed": 0
                }
                weeks.append(week)
            
            plan = {
                "id": str(uuid.uuid4()),
                "title": plan_data["title"],
                "description": plan_data["description"],
                "duration": plan_data["duration"],
                "difficulty": plan_data["difficulty"],
                "tools": plan_data["tools"],
                "weeks": weeks,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await plan_collection.insert_one(plan)
    
    print("Learning plans seeded successfully!")

async def seed_assessment_questions():
    """Seed assessment questions into the database"""
    print("Seeding assessment questions...")
    questions = [
        {
            "question": "What is your current skill level with AI tools?",
            "type": "single-choice",
            "options": [
                "Beginner - Just getting started",
                "Intermediate - Some experience",
                "Advanced - Regular user of AI tools"
            ]
        },
        {
            "question": "How much time can you dedicate to learning AI tools weekly?",
            "type": "single-choice",
            "options": [
                "Less than 1 hour",
                "1-3 hours",
                "4-7 hours",
                "More than 7 hours"
            ]
        },
        {
            "question": "What is your primary goal for using AI tools?",
            "type": "single-choice",
            "options": [
                "Increase productivity",
                "Learn new skills",
                "Build products or services",
                "Creative projects",
                "Research and learning"
            ]
        },
        {
            "question": "Which areas of AI are you most interested in?",
            "type": "multiple-choice",
            "options": [
                "AI Assistants",
                "Code Generation",
                "Content Creation",
                "Data Analysis",
                "Image Generation",
                "Productivity",
                "Research",
                "Video Generation",
                "Voice & Audio"
            ]
        },
        {
            "question": "What is your technical background?",
            "type": "single-choice",
            "options": [
                "Non-technical",
                "Basic technical knowledge",
                "Developer/Engineer",
                "Data Scientist/Analyst",
                "Designer",
                "Content Creator"
            ]
        }
    ]
    
    question_collection = db.get_db().assessment_questions
    
    for question_data in questions:
        # Check if question already exists
        existing = await question_collection.find_one({"question": question_data["question"]})
        if not existing:
            # Create options with IDs
            options = []
            for option_text in question_data["options"]:
                option = {
                    "id": str(uuid.uuid4()),
                    "text": option_text
                }
                options.append(option)
            
            question = {
                "id": str(uuid.uuid4()),
                "question": question_data["question"],
                "type": question_data["type"],
                "options": options
            }
            await question_collection.insert_one(question)
    
    print("Assessment questions seeded successfully!")

async def seed_admin_user():
    """Seed an admin user into the database"""
    print("Seeding admin user...")
    user_collection = db.get_db().users
    
    # Check if admin user already exists
    existing = await user_collection.find_one({"email": "admin@ainavigator.com"})
    if not existing:
        user = {
            "id": str(uuid.uuid4()),
            "email": "admin@ainavigator.com",
            "name": "Admin User",
            "hashed_password": get_password_hash("adminpassword"),
            "skill_level": "Advanced",
            "primary_goal": "Build products or services",
            "time_available": "4-7 hours",
            "technical_background": "Developer/Engineer",
            "interests": ["AI Assistants", "Code Generation", "Productivity"],
            "completed_assessment": True,
            "joined_date": datetime.utcnow(),
            "tools_explored": 5,
            "plans_completed": 2,
            "weekly_streak": 3
        }
        await user_collection.insert_one(user)
        print("Admin user created with email: admin@ainavigator.com and password: adminpassword")
    else:
        print("Admin user already exists")

async def seed_all():
    """Seed all data into the database"""
    # Connect to MongoDB
    db.connect_to_mongo()
    
    try:
        await seed_categories()
        await seed_tools()
        await seed_learning_plans()
        await seed_assessment_questions()
        await seed_admin_user()
        print("All data seeded successfully!")
    finally:
        # Close MongoDB connection
        db.close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed_all())