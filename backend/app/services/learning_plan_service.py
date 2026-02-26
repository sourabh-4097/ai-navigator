from typing import List, Optional
from datetime import datetime
import uuid
import logging

from ..core.database import db
from ..core.mock_data import LEARNING_PLANS
from ..models.learning_plan import (
    LearningPlan, 
    LearningPlanCreate, 
    LearningPlanUpdate,
    UserPlanProgress,
    PlanTask,
    PlanWeek
)

async def get_all_learning_plans() -> List[LearningPlan]:
    # Try to use MongoDB if available
    if db.client is not None:
        try:
            plan_collection = db.get_db().learning_plans
            plans = await plan_collection.find().to_list(1000)
            return [LearningPlan(**plan) for plan in plans]
        except Exception as e:
            logging.error(f"Error fetching learning plans from MongoDB: {e}")
            # Fall back to mock data
    
    # Use mock data if MongoDB is not available or there was an error
    logging.info("MongoDB not available, using mock data for learning plans")
    return [LearningPlan(**plan) for plan in LEARNING_PLANS]

async def get_learning_plan_by_id(plan_id: str) -> Optional[LearningPlan]:
    # Try to use MongoDB if available
    if db.client is not None:
        try:
            plan_collection = db.get_db().learning_plans
            plan = await plan_collection.find_one({"id": plan_id})
            if plan:
                return LearningPlan(**plan)
        except Exception as e:
            logging.error(f"Error fetching learning plan from MongoDB: {e}")
            # Fall back to mock data
    
    # Use mock data if MongoDB is not available or there was an error
    for plan in LEARNING_PLANS:
        if plan["id"] == plan_id:
            return LearningPlan(**plan)
    return None

async def create_learning_plan(plan_data: LearningPlanCreate) -> LearningPlan:
    plan_collection = db.get_db().learning_plans
    
    # Process weeks and tasks to ensure they have IDs
    weeks = []
    for week_data in plan_data.weeks:
        tasks = []
        for task_data in week_data.tasks:
            # If task is just a string, convert to PlanTask
            if isinstance(task_data, str):
                task = PlanTask(id=str(uuid.uuid4()), description=task_data)
            else:
                task = PlanTask(
                    id=task_data.id if hasattr(task_data, 'id') else str(uuid.uuid4()),
                    description=task_data.description,
                    completed=task_data.completed if hasattr(task_data, 'completed') else False
                )
            tasks.append(task)
        
        week = PlanWeek(
            week=week_data.week,
            title=week_data.title,
            tasks=tasks,
            completed=week_data.completed if hasattr(week_data, 'completed') else 0
        )
        weeks.append(week)
    
    plan_id = str(uuid.uuid4())
    plan = LearningPlan(
        id=plan_id,
        title=plan_data.title,
        description=plan_data.description,
        duration=plan_data.duration,
        difficulty=plan_data.difficulty,
        tools=plan_data.tools,
        weeks=weeks,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    await plan_collection.insert_one(plan.model_dump())
    return plan

async def update_learning_plan(plan_id: str, plan_data: LearningPlanUpdate) -> Optional[LearningPlan]:
    plan_collection = db.get_db().learning_plans
    
    # Get current plan data
    current_plan = await get_learning_plan_by_id(plan_id)
    if not current_plan:
        return None
    
    # Update plan data
    update_data = plan_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Update the plan in the database
    await plan_collection.update_one(
        {"id": plan_id},
        {"$set": update_data}
    )
    
    # Get and return updated plan
    return await get_learning_plan_by_id(plan_id)

async def delete_learning_plan(plan_id: str) -> bool:
    plan_collection = db.get_db().learning_plans
    
    # Delete the plan
    result = await plan_collection.delete_one({"id": plan_id})
    return result.deleted_count > 0

async def get_user_plan_progress(user_id: str, plan_id: str) -> Optional[UserPlanProgress]:
    progress_collection = db.get_db().user_plan_progress
    progress = await progress_collection.find_one({"user_id": user_id, "plan_id": plan_id})
    if progress:
        return UserPlanProgress(**progress)
    return None

async def get_user_plans(user_id: str) -> List[dict]:
    """Get all learning plans with progress for a specific user"""
    progress_collection = db.get_db().user_plan_progress
    plan_collection = db.get_db().learning_plans
    
    # Get all progress records for the user
    progress_records = await progress_collection.find({"user_id": user_id}).to_list(1000)
    
    result = []
    for progress in progress_records:
        # Get the plan details
        plan = await plan_collection.find_one({"id": progress["plan_id"]})
        if plan:
            # Combine plan and progress data
            plan_with_progress = {
                **plan,
                "progress": progress["progress"],
                "started_at": progress["started_at"],
                "last_activity": progress["last_activity"],
                "completed": progress["completed"],
                "completed_at": progress.get("completed_at")
            }
            result.append(plan_with_progress)
    
    return result

async def start_learning_plan(user_id: str, plan_id: str) -> UserPlanProgress:
    """Start a learning plan for a user"""
    progress_collection = db.get_db().user_plan_progress
    
    # Check if user already started this plan
    existing_progress = await get_user_plan_progress(user_id, plan_id)
    if existing_progress:
        return existing_progress
    
    # Create new progress record
    now = datetime.utcnow()
    progress = UserPlanProgress(
        user_id=user_id,
        plan_id=plan_id,
        progress=0,
        started_at=now,
        last_activity=now,
        completed=False
    )
    
    await progress_collection.insert_one(progress.model_dump())
    return progress

async def update_plan_progress(user_id: str, plan_id: str, progress: int, completed: bool = False) -> Optional[UserPlanProgress]:
    """Update a user's progress on a learning plan"""
    progress_collection = db.get_db().user_plan_progress
    
    # Get current progress
    current_progress = await get_user_plan_progress(user_id, plan_id)
    if not current_progress:
        return None
    
    # Update data
    update_data = {
        "progress": progress,
        "last_activity": datetime.utcnow()
    }
    
    if completed and not current_progress.completed:
        update_data["completed"] = True
        update_data["completed_at"] = datetime.utcnow()
        
        # Update user's completed plans count
        user_collection = db.get_db().users
        await user_collection.update_one(
            {"id": user_id},
            {"$inc": {"plans_completed": 1}}
        )
    
    # Update the progress in the database
    await progress_collection.update_one(
        {"user_id": user_id, "plan_id": plan_id},
        {"$set": update_data}
    )
    
    # Get and return updated progress
    return await get_user_plan_progress(user_id, plan_id)

async def complete_task(user_id: str, plan_id: str, week_number: int, task_id: str) -> Optional[dict]:
    """Mark a task as completed in a learning plan"""
    plan_collection = db.get_db().learning_plans
    progress_collection = db.get_db().user_plan_progress
    
    # Get the plan
    plan = await get_learning_plan_by_id(plan_id)
    if not plan:
        return None
    
    # Find the week and task
    week_index = next((i for i, w in enumerate(plan.weeks) if w.week == week_number), None)
    if week_index is None:
        return None
    
    week = plan.weeks[week_index]
    task_index = next((i for i, t in enumerate(week.tasks) if t.id == task_id), None)
    if task_index is None:
        return None
    
    # Update the task as completed
    plan_dict = plan.model_dump()
    plan_dict["weeks"][week_index]["tasks"][task_index]["completed"] = True
    plan_dict["weeks"][week_index]["completed"] += 1
    
    # Calculate overall progress percentage
    total_tasks = sum(len(w.tasks) for w in plan.weeks)
    completed_tasks = sum(w.completed for w in plan.weeks) + 1  # +1 for the task we just completed
    progress_percentage = int((completed_tasks / total_tasks) * 100)
    
    # Update the plan in the database
    await plan_collection.update_one(
        {"id": plan_id},
        {"$set": {
            f"weeks.{week_index}.tasks.{task_index}.completed": True,
            f"weeks.{week_index}.completed": plan_dict["weeks"][week_index]["completed"]
        }}
    )
    
    # Update the user's progress
    await update_plan_progress(user_id, plan_id, progress_percentage, progress_percentage == 100)
    
    return {
        "plan_id": plan_id,
        "week": week_number,
        "task_id": task_id,
        "progress": progress_percentage
    }