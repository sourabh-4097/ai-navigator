from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..core.auth import get_current_user
from ..models.user import UserProfile, UserUpdate, UserInDB
from ..services.user_service import update_user, get_user_by_id

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserProfile)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        skill_level=current_user.skill_level,
        primary_goal=current_user.primary_goal,
        time_available=current_user.time_available,
        technical_background=current_user.technical_background,
        interests=current_user.interests,
        completed_assessment=current_user.completed_assessment,
        joined_date=current_user.joined_date,
        tools_explored=current_user.tools_explored,
        plans_completed=current_user.plans_completed,
        weekly_streak=current_user.weekly_streak
    )

@router.put("/me", response_model=UserProfile)
async def update_user_me(
    user_data: UserUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    updated_user = await update_user(current_user.id, user_data)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return updated_user