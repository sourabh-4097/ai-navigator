from typing import List, Optional
from datetime import datetime
import uuid
import logging

from ..core.database import db
from ..core.auth import get_password_hash, verify_password
from ..models.user import UserCreate, UserUpdate, UserInDB, UserProfile
from ..core.mock_data import USERS

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    # Try to use MongoDB if available
    if db.client:
        user_collection = db.get_db().users
        user = await user_collection.find_one({"email": email})
        if user:
            return UserInDB(**user)
    else:
        # Use mock data if MongoDB is not available
        for user in USERS:
            if user["email"] == email:
                return UserInDB(**user)
    return None

async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
    # Try to use MongoDB if available
    if db.client:
        user_collection = db.get_db().users
        user = await user_collection.find_one({"id": user_id})
        if user:
            return UserInDB(**user)
    else:
        # Use mock data if MongoDB is not available
        for user in USERS:
            if user["id"] == user_id:
                return UserInDB(**user)
    return None

async def create_user(user_data: UserCreate) -> UserInDB:
    # Check if user already exists
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise ValueError("User with this email already exists")
    
    # Create new user
    user_id = str(uuid.uuid4())
    user_in_db = UserInDB(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        hashed_password=get_password_hash(user_data.password),
        joined_date=datetime.utcnow(),
        completed_assessment=False,
        tools_explored=0,
        plans_completed=0,
        weekly_streak=0
    )
    
    # Try to use MongoDB if available
    if db.client:
        user_collection = db.get_db().users
        await user_collection.insert_one(user_in_db.model_dump())
    else:
        # Use mock data if MongoDB is not available
        logging.info(f"MongoDB not available, adding user to mock data: {user_data.email}")
        USERS.append(user_in_db.model_dump())
    
    return user_in_db

async def update_user(user_id: str, user_data: UserUpdate) -> Optional[UserProfile]:
    # Get current user data
    current_user = await get_user_by_id(user_id)
    if not current_user:
        return None
    
    # Update user data
    update_data = user_data.model_dump(exclude_unset=True)
    
    # If password is being updated, hash it
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    # Try to use MongoDB if available
    if db.client:
        user_collection = db.get_db().users
        # Update the user in the database
        await user_collection.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
    else:
        # Use mock data if MongoDB is not available
        for i, user in enumerate(USERS):
            if user["id"] == user_id:
                USERS[i].update(update_data)
                break
    
    # Get and return updated user
    updated_user = await get_user_by_id(user_id)
    if updated_user:
        return UserProfile(
            id=updated_user.id,
            email=updated_user.email,
            name=updated_user.name,
            skill_level=updated_user.skill_level,
            primary_goal=updated_user.primary_goal,
            time_available=updated_user.time_available,
            technical_background=updated_user.technical_background,
            interests=updated_user.interests,
            completed_assessment=updated_user.completed_assessment,
            joined_date=updated_user.joined_date,
            tools_explored=updated_user.tools_explored,
            plans_completed=updated_user.plans_completed,
            weekly_streak=updated_user.weekly_streak
        )
    return None

async def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    user = await get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user