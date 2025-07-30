from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from ..core.auth import get_current_user
from ..models.user import UserInDB
from ..models.tool import Tool, ToolCreate, ToolUpdate, Category
from ..services.tool_service import (
    get_all_tools, 
    get_tool_by_id, 
    create_tool, 
    update_tool, 
    delete_tool,
    get_all_categories,
    create_category,
    get_tools_by_category,
    get_tools_by_difficulty,
    get_tools_by_tags
)

router = APIRouter(prefix="/tools", tags=["tools"])

@router.get("/", response_model=List[Tool])
async def read_tools(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    tags: Optional[List[str]] = Query(None)
):
    if category:
        return await get_tools_by_category(category)
    elif difficulty:
        return await get_tools_by_difficulty(difficulty)
    elif tags:
        return await get_tools_by_tags(tags)
    else:
        return await get_all_tools()

@router.get("/{tool_id}", response_model=Tool)
async def read_tool(
    tool_id: str
):
    tool = await get_tool_by_id(tool_id)
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    return tool

@router.post("/", response_model=Tool, status_code=status.HTTP_201_CREATED)
async def create_new_tool(
    tool_data: ToolCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    return await create_tool(tool_data)

@router.put("/{tool_id}", response_model=Tool)
async def update_existing_tool(
    tool_id: str,
    tool_data: ToolUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    updated_tool = await update_tool(tool_id, tool_data)
    if not updated_tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    return updated_tool

@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_tool(
    tool_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    deleted = await delete_tool(tool_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )

@router.get("/categories/all", response_model=List[Category])
async def read_categories(
    current_user: UserInDB = Depends(get_current_user)
):
    return await get_all_categories()

@router.post("/categories/", response_model=Category, status_code=status.HTTP_201_CREATED)
async def create_new_category(
    name: str,
    current_user: UserInDB = Depends(get_current_user)
):
    return await create_category(name)