from typing import List, Optional, Union, Literal
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class AssessmentOption(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    
class AssessmentQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    type: Literal["single-choice", "multiple-choice"]
    options: List[AssessmentOption]
    
class AssessmentQuestionCreate(BaseModel):
    question: str
    type: Literal["single-choice", "multiple-choice"]
    options: List[str]
    
class AssessmentAnswer(BaseModel):
    question_id: str
    answer: Union[str, List[str]]  # Single string for single-choice, list for multiple-choice
    
class UserAssessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    answers: List[AssessmentAnswer]
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        from_attributes = True