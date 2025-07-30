from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        return field_schema


# Assessment Models
class AssessmentQuestion(BaseModel):
    id: int
    question: str
    type: str  # "single-choice" or "multiple-choice"
    options: List[str]
    order: Optional[int] = 1
    active: Optional[bool] = True

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


class AssessmentAnswers(BaseModel):
    answers: Dict[str, Any]  # question_id -> answer


class UserProfile(BaseModel):
    role: Optional[str] = None
    skill_level: Optional[str] = None
    primary_goal: Optional[str] = None
    time_available: Optional[str] = None
    interests: Optional[List[str]] = []
    experience_level: Optional[str] = None


class AssessmentResponse(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_profile: UserProfile
    recommended_tools: List[str] = []
    recommended_plans: List[str] = []

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


# Tool Models
class ToolExample(BaseModel):
    title: str
    description: str
    tutorial_link: Optional[str] = None


class Tool(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    category: str
    description: str
    difficulty: str  # Beginner, Intermediate, Advanced
    time_to_learn: str
    use_case: str
    pricing: str
    rating: float
    tags: List[str] = []
    features: List[str] = []
    learning_path: List[str] = []
    examples: Optional[List[ToolExample]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


class ToolsResponse(BaseModel):
    tools: List[Tool]
    categories: List[str]


# Learning Plan Models
class PlanWeek(BaseModel):
    week: int
    title: str
    tasks: List[str]


class LearningPlan(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    duration: str
    difficulty: str
    tools: List[str]  # Tool names
    weeks: List[PlanWeek]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


class UserWeekProgress(BaseModel):
    week: int
    completed_tasks: int
    total_tasks: int
    completed_at: Optional[datetime] = None


class AchievementBadge(BaseModel):
    name: str
    description: str
    earned: bool = False
    earned_at: Optional[datetime] = None


class UserProgress(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    learning_plan_id: PyObjectId
    progress_percentage: int = 0
    current_week: int = 1
    weeks_progress: List[UserWeekProgress] = []
    tools_explored: List[str] = []
    tools_mastered: List[str] = []
    weekly_streak: int = 0
    total_hours_learned: int = 0
    achievement_badges: List[AchievementBadge] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


# User Models
class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    assessment_completed: bool = False
    assessment_answers: Optional[Dict[str, Any]] = {}
    skill_level: Optional[str] = None
    primary_goal: Optional[str] = None
    time_available: Optional[str] = None
    interests: List[str] = []
    joined_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


# Dashboard Models
class DashboardProgress(BaseModel):
    total_tools: int
    tools_explored: int
    tools_mastered: int
    active_plans: int
    completed_plans: int
    weekly_streak: int
    total_hours_learned: int
    achievement_badges: List[AchievementBadge]


class DashboardResponse(BaseModel):
    user_profile: User
    recommended_tools: List[Tool]
    active_plans: List[Dict[str, Any]]  # Learning plans with progress
    progress: DashboardProgress


# Request Models
class UserCreate(BaseModel):
    name: str
    email: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    skill_level: Optional[str] = None
    primary_goal: Optional[str] = None
    time_available: Optional[str] = None
    interests: Optional[List[str]] = None


class ProgressUpdate(BaseModel):
    week: int
    task_index: int
    completed: bool