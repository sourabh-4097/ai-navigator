from typing import List, Optional
from datetime import datetime
import uuid
import logging

from ..core.database import db
from ..models.tool import Tool, ToolCreate, ToolUpdate, Category
from ..core.mock_data import TOOLS

async def get_all_tools() -> List[Tool]:
    # Try to use MongoDB if available
    if db.client is not None:
        try:
            tool_collection = db.get_db().tools
            tools = await tool_collection.find().to_list(1000)
            return [Tool(**tool) for tool in tools]
        except Exception as e:
            logging.error(f"Error fetching tools from MongoDB: {e}")
            # Fall back to mock data
    
    # Use mock data if MongoDB is not available or there was an error
    logging.info("MongoDB not available, using mock data for tools")
    return [Tool(**tool) for tool in TOOLS]

async def get_tool_by_id(tool_id: str) -> Optional[Tool]:
    # Try to use MongoDB if available
    if db.client is not None:
        try:
            tool_collection = db.get_db().tools
            tool = await tool_collection.find_one({"id": tool_id})
            if tool:
                return Tool(**tool)
        except Exception as e:
            logging.error(f"Error fetching tool from MongoDB: {e}")
            # Fall back to mock data
    
    # Use mock data if MongoDB is not available or there was an error
    for tool in TOOLS:
        if tool["id"] == tool_id:
            return Tool(**tool)
    return None

async def create_tool(tool_data: ToolCreate) -> Tool:
    tool_collection = db.get_db().tools
    
    tool_id = str(uuid.uuid4())
    tool = Tool(
        id=tool_id,
        **tool_data.model_dump(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    await tool_collection.insert_one(tool.model_dump())
    return tool

async def update_tool(tool_id: str, tool_data: ToolUpdate) -> Optional[Tool]:
    tool_collection = db.get_db().tools
    
    # Get current tool data
    current_tool = await get_tool_by_id(tool_id)
    if not current_tool:
        return None
    
    # Update tool data
    update_data = tool_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Update the tool in the database
    await tool_collection.update_one(
        {"id": tool_id},
        {"$set": update_data}
    )
    
    # Get and return updated tool
    return await get_tool_by_id(tool_id)

async def delete_tool(tool_id: str) -> bool:
    tool_collection = db.get_db().tools
    
    # Delete the tool
    result = await tool_collection.delete_one({"id": tool_id})
    return result.deleted_count > 0

async def get_all_categories() -> List[Category]:
    category_collection = db.get_db().categories
    categories = await category_collection.find().to_list(1000)
    return [Category(**category) for category in categories]

async def create_category(name: str) -> Category:
    category_collection = db.get_db().categories
    
    # Check if category already exists
    existing = await category_collection.find_one({"name": name})
    if existing:
        return Category(**existing)
    
    # Create new category
    category_id = str(uuid.uuid4())
    category = Category(id=category_id, name=name)
    
    await category_collection.insert_one(category.model_dump())
    return category

async def get_tools_by_category(category: str) -> List[Tool]:
    tool_collection = db.get_db().tools
    tools = await tool_collection.find({"category": category}).to_list(1000)
    return [Tool(**tool) for tool in tools]

async def get_tools_by_difficulty(difficulty: str) -> List[Tool]:
    tool_collection = db.get_db().tools
    tools = await tool_collection.find({"difficulty": difficulty}).to_list(1000)
    return [Tool(**tool) for tool in tools]

async def get_tools_by_tags(tags: List[str]) -> List[Tool]:
    tool_collection = db.get_db().tools
    tools = await tool_collection.find({"tags": {"$in": tags}}).to_list(1000)
    return [Tool(**tool) for tool in tools]