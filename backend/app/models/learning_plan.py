from typing import List, Optional
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class PlanTask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    description: str
    completed: bool = False
    
class PlanWeek(BaseModel):
    week: int
    title: str
    tasks: List[PlanTask]
    completed: int = 0
    
class LearningPlanBase(BaseModel):
    title: str
    description: str
    duration: str
    difficulty: str
    tools: List[str]
    
class LearningPlanCreate(LearningPlanBase):
    weeks: List[PlanWeek]
    
class LearningPlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = None
    tools: Optional[List[str]] = None
    weeks: Optional[List[PlanWeek]] = None
    
class LearningPlan(LearningPlanBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    weeks: List[PlanWeek]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        from_attributes = True
        
class UserPlanProgress(BaseModel):
    user_id: str
    plan_id: str
    progress: int = 0
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = False
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True