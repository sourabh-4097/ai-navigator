from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
import uuid

class TokenPayload(BaseModel):
    sub: str
    exp: int

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserBase(BaseModel):
    email: EmailStr
    name: str
    
class UserCreate(UserBase):
    password: str
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    skill_level: Optional[str] = None
    primary_goal: Optional[str] = None
    time_available: Optional[str] = None
    technical_background: Optional[str] = None
    interests: Optional[List[str]] = None
    
class UserProfile(UserBase):
    id: str
    skill_level: Optional[str] = None
    primary_goal: Optional[str] = None
    time_available: Optional[str] = None
    technical_background: Optional[str] = None
    interests: Optional[List[str]] = None
    completed_assessment: bool = False
    joined_date: datetime
    tools_explored: int = 0
    plans_completed: int = 0
    weekly_streak: int = 0
    
    class Config:
        from_attributes = True
        
class UserInDB(UserProfile):
    hashed_password: str