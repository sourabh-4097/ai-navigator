from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from ..core.database import db
from ..models.assessment import (
    AssessmentQuestion, 
    AssessmentQuestionCreate,
    AssessmentOption,
    AssessmentAnswer,
    UserAssessment
)

async def get_all_questions() -> List[AssessmentQuestion]:
    question_collection = db.get_db().assessment_questions
    questions = await question_collection.find().to_list(1000)
    return [AssessmentQuestion(**question) for question in questions]

async def get_question_by_id(question_id: str) -> Optional[AssessmentQuestion]:
    question_collection = db.get_db().assessment_questions
    question = await question_collection.find_one({"id": question_id})
    if question:
        return AssessmentQuestion(**question)
    return None

async def create_question(question_data: AssessmentQuestionCreate) -> AssessmentQuestion:
    question_collection = db.get_db().assessment_questions
    
    # Create options with IDs
    options = []
    for option_text in question_data.options:
        option = AssessmentOption(id=str(uuid.uuid4()), text=option_text)
        options.append(option)
    
    question_id = str(uuid.uuid4())
    question = AssessmentQuestion(
        id=question_id,
        question=question_data.question,
        type=question_data.type,
        options=options
    )
    
    await question_collection.insert_one(question.model_dump())
    return question

async def delete_question(question_id: str) -> bool:
    question_collection = db.get_db().assessment_questions
    
    # Delete the question
    result = await question_collection.delete_one({"id": question_id})
    return result.deleted_count > 0

async def save_user_assessment(user_id: str, answers: List[AssessmentAnswer]) -> UserAssessment:
    assessment_collection = db.get_db().user_assessments
    user_collection = db.get_db().users
    
    # Create assessment record
    assessment_id = str(uuid.uuid4())
    assessment = UserAssessment(
        id=assessment_id,
        user_id=user_id,
        answers=answers,
        completed_at=datetime.utcnow()
    )
    
    await assessment_collection.insert_one(assessment.model_dump())
    
    # Update user's completed_assessment status
    await user_collection.update_one(
        {"id": user_id},
        {"$set": {"completed_assessment": True}}
    )
    
    return assessment

async def get_user_assessment(user_id: str) -> Optional[UserAssessment]:
    assessment_collection = db.get_db().user_assessments
    
    # Get the most recent assessment for the user
    assessment = await assessment_collection.find_one(
        {"user_id": user_id},
        sort=[("completed_at", -1)]
    )
    
    if assessment:
        return UserAssessment(**assessment)
    return None

async def analyze_assessment(user_id: str) -> Dict[str, Any]:
    """Analyze a user's assessment answers to provide recommendations"""
    assessment = await get_user_assessment(user_id)
    if not assessment:
        return {"error": "No assessment found for this user"}
    
    # Get all questions to interpret answers
    questions = {q.id: q for q in await get_all_questions()}
    
    # Analyze answers
    interests = []
    skill_level = None
    time_available = None
    primary_goal = None
    
    for answer in assessment.answers:
        question = questions.get(answer.question_id)
        if not question:
            continue
            
        # Extract information based on question type
        if "skill level" in question.question.lower():
            # Find the selected option text
            if isinstance(answer.answer, str):
                option_id = answer.answer
                option = next((o for o in question.options if o.id == option_id), None)
                if option:
                    skill_level = option.text.split(" - ")[0]  # Extract just the level name
        
        elif "time" in question.question.lower() and "weekly" in question.question.lower():
            if isinstance(answer.answer, str):
                option_id = answer.answer
                option = next((o for o in question.options if o.id == option_id), None)
                if option:
                    time_available = option.text
        
        elif "primary goal" in question.question.lower():
            if isinstance(answer.answer, str):
                option_id = answer.answer
                option = next((o for o in question.options if o.id == option_id), None)
                if option:
                    primary_goal = option.text
        
        elif "interest" in question.question.lower() and isinstance(answer.answer, list):
            # Multiple choice question for interests
            for option_id in answer.answer:
                option = next((o for o in question.options if o.id == option_id), None)
                if option:
                    interests.append(option.text)
    
    # Update user profile with assessment results
    user_collection = db.get_db().users
    update_data = {}
    if skill_level:
        update_data["skill_level"] = skill_level
    if time_available:
        update_data["time_available"] = time_available
    if primary_goal:
        update_data["primary_goal"] = primary_goal
    if interests:
        update_data["interests"] = interests
    
    if update_data:
        await user_collection.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
    
    # Get recommended tools based on interests and skill level
    tool_collection = db.get_db().tools
    tool_query = {}
    
    if skill_level:
        if "Beginner" in skill_level:
            tool_query["difficulty"] = "Beginner"
        elif "Intermediate" in skill_level:
            tool_query["difficulty"] = {"$in": ["Beginner", "Intermediate"]}
        else:
            # Advanced users can use any tool
            pass
    
    if interests:
        # Find tools with matching tags or categories
        tool_query["$or"] = [
            {"tags": {"$in": interests}},
            {"category": {"$in": interests}}
        ]
    
    recommended_tools = await tool_collection.find(tool_query).to_list(10)
    
    # Get recommended learning plans
    plan_collection = db.get_db().learning_plans
    plan_query = {}
    
    if skill_level:
        if "Beginner" in skill_level:
            plan_query["difficulty"] = {"$regex": "Beginner", "$options": "i"}
        elif "Intermediate" in skill_level:
            plan_query["difficulty"] = {"$regex": "Intermediate", "$options": "i"}
    
    recommended_plans = await plan_collection.find(plan_query).to_list(5)
    
    return {
        "user_profile": {
            "skill_level": skill_level,
            "time_available": time_available,
            "primary_goal": primary_goal,
            "interests": interests
        },
        "recommended_tools": recommended_tools,
        "recommended_plans": recommended_plans
    }