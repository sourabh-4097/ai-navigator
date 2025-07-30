"""
Mock data provider for development and testing
"""
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock users
USERS = [
    {
        "id": str(uuid.uuid4()),
        "email": "admin@ainavigator.com",
        "hashed_password": pwd_context.hash("adminpassword"),
        "full_name": "Admin User",
        "is_admin": True,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "email": "user@example.com",
        "hashed_password": pwd_context.hash("userpassword"),
        "full_name": "Regular User",
        "is_admin": False,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
]

# Mock AI tools
TOOLS = [
    {
        "id": str(uuid.uuid4()),
        "name": "ChatGPT",
        "description": "A powerful language model for conversation and text generation",
        "category": "Language Models",
        "features": ["Text generation", "Conversation", "Content creation"],
        "difficulty": "Beginner",
        "time_to_learn": "1-2 hours",
        "use_case": "Content creation, answering questions, brainstorming ideas",
        "pricing": "$20/month for Plus, Free tier available",
        "rating": 4.8,
        "tags": ["AI", "NLP", "Chatbot", "OpenAI"],
        "learning_path": ["Basic prompts", "Advanced prompting", "API integration"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "DALL-E",
        "description": "An AI system that can create realistic images and art from a description in natural language",
        "category": "Image Generation",
        "features": ["Image generation", "Art creation", "Design assistance"],
        "difficulty": "Beginner",
        "time_to_learn": "1-3 hours",
        "use_case": "Creating illustrations, design concepts, visual content",
        "pricing": "Pay per use, starting at $0.04 per image",
        "rating": 4.7,
        "tags": ["AI", "Image Generation", "Art", "OpenAI"],
        "learning_path": ["Basic prompts", "Style guidance", "Advanced techniques"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Midjourney",
        "description": "An AI art generator that creates images from textual descriptions",
        "category": "Image Generation",
        "features": ["Image generation", "Art creation", "Style customization"],
        "difficulty": "Intermediate",
        "time_to_learn": "2-5 hours",
        "use_case": "Creating artistic images, concept art, illustrations",
        "pricing": "$10-30/month",
        "rating": 4.6,
        "tags": ["AI", "Image Generation", "Art", "Discord"],
        "learning_path": ["Discord basics", "Parameter usage", "Style mixing", "Advanced techniques"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
]

# Mock learning plans
LEARNING_PLANS = [
    {
        "id": str(uuid.uuid4()),
        "title": "Mastering ChatGPT for Content Creation",
        "description": "Learn how to use ChatGPT effectively for creating various types of content",
        "duration": "4 weeks",
        "difficulty": "Beginner",
        "tools": ["ChatGPT"],
        "weeks": [
            {
                "week": 1,
                "title": "Getting Started with ChatGPT",
                "tasks": [
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Create an OpenAI account",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Learn basic prompt structure",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Practice with 5 different prompts",
                        "completed": False
                    }
                ],
                "completed": 0
            },
            {
                "week": 2,
                "title": "Content Creation Basics",
                "tasks": [
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Create a blog post outline",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Generate social media content",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Practice editing and refining AI-generated content",
                        "completed": False
                    }
                ],
                "completed": 0
            }
        ],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "AI Art Generation Masterclass",
        "description": "Comprehensive guide to creating stunning artwork using AI tools",
        "duration": "6 weeks",
        "difficulty": "Intermediate",
        "tools": ["DALL-E", "Midjourney"],
        "weeks": [
            {
                "week": 1,
                "title": "Introduction to AI Art",
                "tasks": [
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Set up accounts on DALL-E and Midjourney",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Learn basic prompt structure for image generation",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Create your first 5 AI images",
                        "completed": False
                    }
                ],
                "completed": 0
            },
            {
                "week": 2,
                "title": "Advanced Prompting Techniques",
                "tasks": [
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Learn style references and modifiers",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Practice with different artistic styles",
                        "completed": False
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "description": "Create a themed collection of 10 images",
                        "completed": False
                    }
                ],
                "completed": 0
            }
        ],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
]

# Mock assessment questions
ASSESSMENT_QUESTIONS = [
    {
        "id": str(uuid.uuid4()),
        "question": "What is your experience level with AI tools?",
        "options": ["Beginner", "Intermediate", "Advanced"],
        "category": "Experience"
    },
    {
        "id": str(uuid.uuid4()),
        "question": "Which AI domains are you most interested in?",
        "options": ["Language Models", "Image Generation", "Audio Processing", "Video Creation"],
        "category": "Interests",
        "multiple": True
    },
    {
        "id": str(uuid.uuid4()),
        "question": "What are your primary goals for using AI tools?",
        "options": ["Content Creation", "Productivity", "Learning", "Creative Projects", "Business Applications"],
        "category": "Goals",
        "multiple": True
    }
]

# Mock user assessment results
USER_ASSESSMENTS = [
    {
        "id": str(uuid.uuid4()),
        "user_id": USERS[1]["id"],
        "answers": [
            {"question_id": ASSESSMENT_QUESTIONS[0]["id"], "answer": "Beginner"},
            {"question_id": ASSESSMENT_QUESTIONS[1]["id"], "answer": ["Language Models", "Image Generation"]},
            {"question_id": ASSESSMENT_QUESTIONS[2]["id"], "answer": ["Content Creation", "Learning"]}
        ],
        "created_at": datetime.now().isoformat()
    }
]

# Mock user learning progress
USER_LEARNING = [
    {
        "id": str(uuid.uuid4()),
        "user_id": USERS[1]["id"],
        "plan_id": LEARNING_PLANS[0]["id"],
        "progress": 25,  # percentage
        "started_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "last_activity": datetime.now().isoformat()
    }
]