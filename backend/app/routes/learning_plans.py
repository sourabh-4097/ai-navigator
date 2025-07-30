from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from ..core.auth import get_current_user
from ..models.user import UserInDB
from ..models.learning_plan import (
    LearningPlan, 
    LearningPlanCreate, 
    LearningPlanUpdate,
    UserPlanProgress
)
from ..services.learning_plan_service import (
    get_all_learning_plans,
    get_learning_plan_by_id,
    create_learning_plan,
    update_learning_plan,
    delete_learning_plan,
    get_user_plans,
    start_learning_plan,
    update_plan_progress,
    complete_task,
    get_user_plan_progress
)

router = APIRouter(prefix="/learning-plans", tags=["learning plans"])

@router.get("/", response_model=List[LearningPlan])
async def read_learning_plans():
    return await get_all_learning_plans()

@router.get("/my-plans", response_model=List[Dict[str, Any]])
async def read_user_learning_plans(
    current_user: UserInDB = Depends(get_current_user)
):
    return await get_user_plans(current_user.id)

@router.get("/{plan_id}", response_model=LearningPlan)
async def read_learning_plan(
    plan_id: str
):
    plan = await get_learning_plan_by_id(plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning plan not found"
        )
    return plan

@router.post("/", response_model=LearningPlan, status_code=status.HTTP_201_CREATED)
async def create_new_learning_plan(
    plan_data: LearningPlanCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    return await create_learning_plan(plan_data)

@router.put("/{plan_id}", response_model=LearningPlan)
async def update_existing_learning_plan(
    plan_id: str,
    plan_data: LearningPlanUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    updated_plan = await update_learning_plan(plan_id, plan_data)
    if not updated_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning plan not found"
        )
    return updated_plan

@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_learning_plan(
    plan_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    deleted = await delete_learning_plan(plan_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning plan not found"
        )

@router.post("/{plan_id}/start", response_model=UserPlanProgress)
async def start_plan(
    plan_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    # Check if plan exists
    plan = await get_learning_plan_by_id(plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning plan not found"
        )
    
    return await start_learning_plan(current_user.id, plan_id)

@router.put("/{plan_id}/progress", response_model=UserPlanProgress)
async def update_progress(
    plan_id: str,
    progress: int,
    completed: bool = False,
    current_user: UserInDB = Depends(get_current_user)
):
    # Check if plan exists
    plan = await get_learning_plan_by_id(plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning plan not found"
        )
    
    # Check if user has started this plan
    user_progress = await get_user_plan_progress(current_user.id, plan_id)
    if not user_progress:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You haven't started this learning plan yet"
        )
    
    updated_progress = await update_plan_progress(current_user.id, plan_id, progress, completed)
    if not updated_progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Failed to update progress"
        )
    
    return updated_progress

@router.post("/{plan_id}/complete-task", response_model=Dict[str, Any])
async def mark_task_complete(
    plan_id: str,
    week_number: int,
    task_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    # Check if plan exists
    plan = await get_learning_plan_by_id(plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning plan not found"
        )
    
    # Check if user has started this plan
    user_progress = await get_user_plan_progress(current_user.id, plan_id)
    if not user_progress:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You haven't started this learning plan yet"
        )
    
    result = await complete_task(current_user.id, plan_id, week_number, task_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return result