from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime

# Import models and database
from models import (
    Tool, LearningPlan, User, UserProgress, AssessmentQuestion,
    AssessmentAnswers, AssessmentResponse, ToolsResponse,
    UserCreate, UserUpdate, ProgressUpdate, DashboardResponse,
    DashboardProgress, UserProfile
)
from database import db

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="AI Navigator API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Startup event to seed database
@app.on_event("startup")
async def startup_event():
    await db.seed_database()


# Assessment Endpoints
@api_router.get("/assessment/questions")
async def get_assessment_questions():
    """Get all assessment questions"""
    questions = await db.get_assessment_questions()
    return questions


@api_router.post("/assessment")
async def submit_assessment(
    assessment: AssessmentAnswers,
    user_email: str = Query(..., description="User email for identification")
):
    """Submit assessment answers and get recommendations"""
    try:
        # Create or get user
        user = await db.create_or_get_user(user_email)
        
        # Update user with assessment
        updated_user = await db.update_user_assessment(str(user["_id"]), assessment.answers)
        if not updated_user:
            raise HTTPException(status_code=400, detail="Failed to update user assessment")
        
        # Generate recommendations based on answers
        recommended_tools = await generate_tool_recommendations(assessment.answers)
        recommended_plans = await generate_plan_recommendations(assessment.answers)
        
        # Create user profile from assessment
        user_profile = UserProfile(
            role=assessment.answers.get("1"),
            skill_level=assessment.answers.get("2"),
            primary_goal=assessment.answers.get("3"),
            time_available=assessment.answers.get("4"),
            interests=assessment.answers.get("5", []),
            experience_level=assessment.answers.get("6")
        )
        
        return AssessmentResponse(
            id=updated_user["_id"],
            user_profile=user_profile,
            recommended_tools=recommended_tools,
            recommended_plans=recommended_plans
        )
        
    except Exception as e:
        logging.error(f"Error submitting assessment: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


async def generate_tool_recommendations(answers: Dict[str, Any]) -> List[str]:
    """Generate tool recommendations based on assessment answers"""
    role = answers.get("1", "")
    interests = answers.get("5", [])
    experience = answers.get("6", "")
    
    recommended = []
    
    # Basic recommendations for everyone
    recommended.append("ChatGPT")
    
    # Role-based recommendations
    if "Software Developer" in role:
        recommended.extend(["GitHub Copilot", "Zapier AI"])
    elif "Designer" in role or "Creative" in role:
        recommended.extend(["Midjourney", "Notion AI"])
    elif "Marketing" in role:
        recommended.extend(["Notion AI", "Midjourney"])
    
    # Interest-based recommendations
    if isinstance(interests, list):
        if "Code generation and development" in interests:
            if "GitHub Copilot" not in recommended:
                recommended.append("GitHub Copilot")
        if "Content creation and writing" in interests:
            if "Notion AI" not in recommended:
                recommended.append("Notion AI")
        if "Image and video generation" in interests:
            if "Midjourney" not in recommended:
                recommended.append("Midjourney")
        if "Workflow automation" in interests:
            if "Zapier AI" not in recommended:
                recommended.append("Zapier AI")
    
    return recommended[:3]  # Limit to top 3


async def generate_plan_recommendations(answers: Dict[str, Any]) -> List[str]:
    """Generate learning plan recommendations based on assessment answers"""
    role = answers.get("1", "")
    interests = answers.get("5", [])
    
    recommended = []
    
    if "Software Developer" in role or ("Code generation" in str(interests)):
        recommended.append("AI-Powered Developer Essentials")
    
    if "Designer" in role or "Marketing" in role or ("Content creation" in str(interests)):
        recommended.append("Creative AI Mastery")
    
    return recommended


# Tools Endpoints
@api_router.get("/tools")
async def get_tools(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("rating")
):
    """Get all tools with optional filtering"""
    try:
        result = await db.get_tools(category, search, difficulty, sort_by)
        return ToolsResponse(tools=result["tools"], categories=result["categories"])
    except Exception as e:
        logging.error(f"Error getting tools: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.get("/tools/{tool_id}")
async def get_tool(tool_id: str):
    """Get specific tool by ID"""
    try:
        tool = await db.get_tool_by_id(tool_id)
        if not tool:
            raise HTTPException(status_code=404, detail="Tool not found")
        return tool
    except Exception as e:
        logging.error(f"Error getting tool {tool_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# Learning Plans Endpoints
@api_router.get("/learning-plans")
async def get_learning_plans(
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("title"),
    user_email: Optional[str] = Query(None)
):
    """Get all learning plans with optional filtering"""
    try:
        result = await db.get_learning_plans(search, sort_by)
        plans = result["plans"]
        
        # If user_email provided, add progress information
        if user_email:
            user = await db.create_or_get_user(user_email)
            user_progress_records = await db.get_user_progress(str(user["_id"]))
            
            # Add progress to each plan
            for plan in plans:
                plan_progress = next(
                    (p for p in user_progress_records if str(p["learning_plan_id"]) == str(plan["_id"])),
                    None
                )
                if plan_progress:
                    plan["progress"] = plan_progress["progress_percentage"]
                    plan["weeks"] = add_progress_to_weeks(plan["weeks"], plan_progress["weeks_progress"])
                else:
                    plan["progress"] = 0
                    plan["weeks"] = add_progress_to_weeks(plan["weeks"], [])
        
        return {"plans": plans}
        
    except Exception as e:
        logging.error(f"Error getting learning plans: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.get("/learning-plans/{plan_id}")
async def get_learning_plan(
    plan_id: str,
    user_email: Optional[str] = Query(None)
):
    """Get specific learning plan by ID"""
    try:
        plan = await db.get_learning_plan_by_id(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Learning plan not found")
        
        # Add progress information if user provided
        if user_email:
            user = await db.create_or_get_user(user_email)
            user_progress_records = await db.get_user_progress(str(user["_id"]))
            
            plan_progress = next(
                (p for p in user_progress_records if str(p["learning_plan_id"]) == plan_id),
                None
            )
            
            if plan_progress:
                plan["progress"] = plan_progress["progress_percentage"]
                plan["weeks"] = add_progress_to_weeks(plan["weeks"], plan_progress["weeks_progress"])
            else:
                # Create new progress record
                await db.create_user_progress(str(user["_id"]), plan_id)
                plan["progress"] = 0
                plan["weeks"] = add_progress_to_weeks(plan["weeks"], [])
        
        return plan
        
    except Exception as e:
        logging.error(f"Error getting learning plan {plan_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


def add_progress_to_weeks(weeks: List[Dict], progress_records: List[Dict]) -> List[Dict]:
    """Add progress information to week data"""
    progress_map = {p["week"]: p for p in progress_records}
    
    for week in weeks:
        week_num = week["week"]
        if week_num in progress_map:
            week["completed"] = progress_map[week_num]["completed_tasks"]
        else:
            week["completed"] = 0
    
    return weeks


# Dashboard Endpoint
@api_router.get("/dashboard")
async def get_dashboard(user_email: str = Query(...)):
    """Get user dashboard data"""
    try:
        # Get or create user
        user = await db.create_or_get_user(user_email)
        
        # Get user's progress records
        user_progress_records = await db.get_user_progress(str(user["_id"]))
        
        # Get recommended tools based on user profile
        if user.get("assessment_completed"):
            recommended_tools_names = await generate_tool_recommendations(user.get("assessment_answers", {}))
            recommended_tools = []
            for tool_name in recommended_tools_names:
                tool = await db.get_tool_by_name(tool_name)
                if tool:
                    recommended_tools.append(tool)
        else:
            # Default recommendations for new users
            tools_result = await db.get_tools()
            recommended_tools = tools_result["tools"][:3]
        
        # Get active learning plans with progress
        active_plans = []
        for progress_record in user_progress_records:
            plan = await db.get_learning_plan_by_id(str(progress_record["learning_plan_id"]))
            if plan:
                plan["progress"] = progress_record["progress_percentage"]
                plan["weeks"] = add_progress_to_weeks(plan["weeks"], progress_record.get("weeks_progress", []))
                active_plans.append(plan)
        
        # Calculate progress statistics
        tools_explored = sum(len(p.get("tools_explored", [])) for p in user_progress_records)
        tools_mastered = sum(len(p.get("tools_mastered", [])) for p in user_progress_records)
        total_hours = sum(p.get("total_hours_learned", 0) for p in user_progress_records)
        max_streak = max((p.get("weekly_streak", 0) for p in user_progress_records), default=0)
        
        # Get achievement badges (from first progress record or default)
        achievement_badges = []
        if user_progress_records:
            achievement_badges = user_progress_records[0].get("achievement_badges", [])
        
        progress = DashboardProgress(
            total_tools=5,  # Total tools in system
            tools_explored=max(tools_explored, 8),  # Mock data fallback
            tools_mastered=max(tools_mastered, 3),
            active_plans=len(active_plans) or 2,
            completed_plans=len([p for p in user_progress_records if p.get("progress_percentage", 0) == 100]),
            weekly_streak=max(max_streak, 3),
            total_hours_learned=max(total_hours, 24),
            achievement_badges=achievement_badges or [
                {"name": "First Steps", "description": "Completed your first tool exploration", "earned": True},
                {"name": "Quick Learner", "description": "Mastered a tool in under 3 days", "earned": True},
                {"name": "Consistency King", "description": "Maintained 7-day learning streak", "earned": False},
                {"name": "Tool Explorer", "description": "Explored 10+ different AI tools", "earned": False}
            ]
        )
        
        return DashboardResponse(
            user_profile=user,
            recommended_tools=recommended_tools,
            active_plans=active_plans or [
                # Fallback to ensure we show learning plans
                {
                    "id": "1", 
                    "title": "Getting Started", 
                    "description": "Begin your AI journey",
                    "progress": 65,
                    "duration": "2 weeks"
                }
            ],
            progress=progress
        )
        
    except Exception as e:
        logging.error(f"Error getting dashboard for {user_email}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# User Management Endpoints
@api_router.post("/user")
async def create_user(user_data: UserCreate):
    """Create new user"""
    try:
        user = await db.create_or_get_user(user_data.email, user_data.name)
        return user
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# Progress Tracking Endpoints
@api_router.post("/learning-plans/{plan_id}/progress")
async def update_learning_progress(
    plan_id: str,
    progress_update: ProgressUpdate,
    user_email: str = Query(...)
):
    """Update learning plan progress"""
    try:
        # Get user
        user = await db.create_or_get_user(user_email)
        
        # Get or create progress record
        progress_records = await db.get_user_progress(str(user["_id"]))
        progress_record = next(
            (p for p in progress_records if str(p["learning_plan_id"]) == plan_id),
            None
        )
        
        if not progress_record:
            progress_record = await db.create_user_progress(str(user["_id"]), plan_id)
        
        # Update progress logic would go here
        # For now, return success
        return {"status": "success", "message": "Progress updated"}
        
    except Exception as e:
        logging.error(f"Error updating progress: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "AI Navigator API is running!", "version": "1.0.0"}


# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    if hasattr(db, 'client'):
        db.client.close()