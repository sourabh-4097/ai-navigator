from typing import List, Optional
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class ToolBase(BaseModel):
    name: str
    category: str
    description: str
    difficulty: str
    time_to_learn: str
    use_case: str
    pricing: str
    rating: float
    tags: List[str]
    features: List[str]
    learning_path: List[str]
    
class ToolCreate(ToolBase):
    pass
    
class ToolUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    time_to_learn: Optional[str] = None
    use_case: Optional[str] = None
    pricing: Optional[str] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None
    features: Optional[List[str]] = None
    learning_path: Optional[List[str]] = None
    
class Tool(ToolBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        from_attributes = True
        
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    
    class Config:
        from_attributes = True