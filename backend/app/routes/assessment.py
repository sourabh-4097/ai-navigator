from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from ..core.auth import get_current_user
from ..models.user import UserInDB
from ..models.assessment import (
    AssessmentQuestion,
    AssessmentQuestionCreate,
    AssessmentAnswer,
    UserAssessment
)
from ..services.assessment_service import (
    get_all_questions,
    get_question_by_id,
    create_question,
    delete_question,
    save_user_assessment,
    get_user_assessment,
    analyze_assessment
)

router = APIRouter(prefix="/assessment", tags=["assessment"])

@router.get("/questions", response_model=List[AssessmentQuestion])
async def read_assessment_questions(
    current_user: UserInDB = Depends(get_current_user)
):
    return await get_all_questions()

@router.get("/questions/{question_id}", response_model=AssessmentQuestion)
async def read_assessment_question(
    question_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    question = await get_question_by_id(question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    return question

@router.post("/questions", response_model=AssessmentQuestion, status_code=status.HTTP_201_CREATED)
async def create_assessment_question(
    question_data: AssessmentQuestionCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    return await create_question(question_data)

@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment_question(
    question_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    deleted = await delete_question(question_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )

@router.post("/submit", response_model=UserAssessment)
async def submit_assessment(
    answers: List[AssessmentAnswer],
    current_user: UserInDB = Depends(get_current_user)
):
    return await save_user_assessment(current_user.id, answers)

@router.get("/my-assessment", response_model=UserAssessment)
async def get_my_assessment(
    current_user: UserInDB = Depends(get_current_user)
):
    assessment = await get_user_assessment(current_user.id)
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No assessment found for this user"
        )
    return assessment

@router.get("/analyze", response_model=Dict[str, Any])
async def get_assessment_analysis(
    current_user: UserInDB = Depends(get_current_user)
):
    analysis = await analyze_assessment(current_user.id)
    if "error" in analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=analysis["error"]
        )
    return analysis