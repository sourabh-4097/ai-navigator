# AI Tool Navigator - API Contracts & Integration Plan

## Overview
This document defines the API contracts, data models, and integration strategy for replacing mock data with a real FastAPI backend connected to MongoDB.

## API Endpoints

### 1. Assessment Endpoints

#### POST `/api/assessment`
Create or update user assessment
```json
Request:
{
  "answers": {
    "1": "Software Developer",
    "2": "Intermediate - Some coding/technical knowledge",
    "3": "Increase productivity and efficiency",
    "4": "6-10 hours",
    "5": ["Code generation and development", "Workflow automation"],
    "6": "Tried a few basic tools (ChatGPT, etc.)"
  }
}

Response:
{
  "id": "assessment_id",
  "user_profile": {
    "role": "Software Developer",
    "skill_level": "Intermediate",
    "primary_goal": "Increase productivity and efficiency", 
    "time_available": "6-10 hours",
    "interests": ["Code generation and development", "Workflow automation"],
    "experience_level": "Tried a few basic tools"
  },
  "recommended_tools": ["tool_id_1", "tool_id_2"],
  "recommended_plans": ["plan_id_1"]
}
```

#### GET `/api/assessment/questions`
Get assessment questions
```json
Response:
[
  {
    "id": 1,
    "question": "What's your primary role or profession?",
    "type": "single-choice",
    "options": ["Software Developer", "Designer/Creative", ...]
  }
]
```

### 2. Tools Endpoints

#### GET `/api/tools`
Get all tools with optional filtering
```json
Query params: ?category=&search=&difficulty=&sort_by=
Response:
{
  "tools": [
    {
      "id": 1,
      "name": "ChatGPT",
      "category": "Conversational AI",
      "description": "Advanced language model...",
      "difficulty": "Beginner",
      "time_to_learn": "2-3 hours",
      "use_case": "Content Creation, Code Review",
      "pricing": "Free + Premium",
      "rating": 4.8,
      "tags": ["AI Chat", "Content", "Coding"],
      "features": ["Text Generation", "Code Assistance"],
      "learning_path": ["Basic prompting", "Advanced techniques"]
    }
  ],
  "categories": ["All Tools", "Conversational AI", ...]
}
```

#### GET `/api/tools/{tool_id}`
Get specific tool details
```json
Response: {
  "id": 1,
  "name": "ChatGPT",
  "category": "Conversational AI",
  "description": "...",
  "difficulty": "Beginner",
  "time_to_learn": "2-3 hours",
  "use_case": "Content Creation, Code Review",
  "pricing": "Free + Premium", 
  "rating": 4.8,
  "tags": ["AI Chat", "Content"],
  "features": ["Text Generation", "Code Assistance"],
  "learning_path": ["Step 1", "Step 2", "Step 3"],
  "examples": [
    {
      "title": "Content Creation Workflow",
      "description": "Learn how to use ChatGPT...",
      "tutorial_link": "/tutorials/chatgpt-content"
    }
  ]
}
```

### 3. Learning Plans Endpoints

#### GET `/api/learning-plans`
Get all learning plans
```json
Query params: ?search=&sort_by=
Response:
{
  "plans": [
    {
      "id": 1,
      "title": "AI-Powered Developer Essentials",
      "description": "Master the core AI tools...",
      "duration": "4 weeks", 
      "difficulty": "Beginner to Intermediate",
      "tools": ["ChatGPT", "GitHub Copilot"],
      "progress": 65,
      "weeks": [
        {
          "week": 1,
          "title": "Getting Started with ChatGPT",
          "tasks": ["Task 1", "Task 2"],
          "completed": 4
        }
      ]
    }
  ]
}
```

#### GET `/api/learning-plans/{plan_id}`
Get specific learning plan details

#### POST `/api/learning-plans/{plan_id}/progress`
Update learning plan progress
```json
Request:
{
  "week": 1,
  "task_index": 2,
  "completed": true
}
```

### 4. User Dashboard Endpoints

#### GET `/api/dashboard`
Get user dashboard data
```json
Response:
{
  "user_profile": {
    "name": "Alex Chen",
    "email": "alex@example.com",
    "skill_level": "Intermediate",
    "tools_explored": 8,
    "tools_mastered": 3,
    "active_plans": 2
  },
  "recommended_tools": [...],
  "active_plans": [...],
  "progress": {
    "total_tools": 12,
    "tools_explored": 8,
    "weekly_streak": 3,
    "achievement_badges": [...]
  }
}
```

#### POST `/api/user/profile`
Update user profile

## Data Models (MongoDB Collections)

### 1. users
```json
{
  "_id": "ObjectId",
  "name": "Alex Chen", 
  "email": "alex@example.com",
  "assessment_completed": true,
  "assessment_answers": {...},
  "skill_level": "Intermediate",
  "primary_goal": "Boost development productivity",
  "time_available": "6-10 hours/week",
  "interests": ["Web Development", "Automation"],
  "joined_date": "2024-01-15T00:00:00Z",
  "created_at": "2024-01-15T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z"
}
```

### 2. tools
```json
{
  "_id": "ObjectId",
  "name": "ChatGPT",
  "category": "Conversational AI", 
  "description": "Advanced language model...",
  "difficulty": "Beginner",
  "time_to_learn": "2-3 hours",
  "use_case": "Content Creation, Code Review",
  "pricing": "Free + Premium",
  "rating": 4.8,
  "tags": ["AI Chat", "Content", "Coding"],
  "features": ["Text Generation", "Code Assistance"],
  "learning_path": ["Basic prompting", "Advanced techniques"],
  "examples": [
    {
      "title": "Content Creation Workflow",
      "description": "Learn how to use...",
      "tutorial_link": "/tutorials/example"
    }
  ],
  "created_at": "2024-01-15T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z"
}
```

### 3. learning_plans
```json
{
  "_id": "ObjectId",
  "title": "AI-Powered Developer Essentials",
  "description": "Master the core AI tools...",
  "duration": "4 weeks",
  "difficulty": "Beginner to Intermediate", 
  "tools": ["ChatGPT", "GitHub Copilot"],
  "weeks": [
    {
      "week": 1,
      "title": "Getting Started with ChatGPT",
      "tasks": [
        "Set up ChatGPT account and explore interface",
        "Learn basic prompting techniques"
      ]
    }
  ],
  "created_at": "2024-01-15T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z"
}
```

### 4. user_progress
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "learning_plan_id": "ObjectId", 
  "progress_percentage": 65,
  "current_week": 3,
  "weeks_progress": [
    {
      "week": 1,
      "completed_tasks": 4,
      "total_tasks": 4,
      "completed_at": "2024-01-20T00:00:00Z"
    }
  ],
  "tools_explored": ["tool_id_1", "tool_id_2"],
  "tools_mastered": ["tool_id_1"],
  "weekly_streak": 3,
  "total_hours_learned": 24,
  "achievement_badges": [
    {
      "name": "First Steps",
      "description": "Completed your first tool exploration", 
      "earned": true,
      "earned_at": "2024-01-16T00:00:00Z"
    }
  ],
  "created_at": "2024-01-15T00:00:00Z",
  "updated_at": "2024-01-25T00:00:00Z"
}
```

### 5. assessment_questions
```json
{
  "_id": "ObjectId",
  "question_id": 1,
  "question": "What's your primary role or profession?",
  "type": "single-choice",
  "options": ["Software Developer", "Designer/Creative"],
  "order": 1,
  "active": true,
  "created_at": "2024-01-15T00:00:00Z"
}
```

## Frontend Integration Plan

### Mock Data Replacement Strategy

1. **Remove mock.js imports** from all components
2. **Create API service layer** (`/src/services/api.js`)
3. **Add React Query/SWR** for data fetching and caching
4. **Update components** to use real API calls
5. **Add loading states** and error handling
6. **Implement user authentication** (simple email-based)

### API Service Structure
```javascript
// /src/services/api.js
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const assessmentAPI = {
  getQuestions: () => fetch(`${API_BASE}/assessment/questions`),
  submitAssessment: (answers) => fetch(`${API_BASE}/assessment`, {method: 'POST'})
};

export const toolsAPI = {
  getTools: (filters) => fetch(`${API_BASE}/tools${buildQuery(filters)}`),
  getTool: (id) => fetch(`${API_BASE}/tools/${id}`)
};

export const plansAPI = {
  getPlans: (filters) => fetch(`${API_BASE}/learning-plans${buildQuery(filters)}`),
  getPlan: (id) => fetch(`${API_BASE}/learning-plans/${id}`)
};
```

## Implementation Steps

### Phase 1: Backend Setup
1. Create MongoDB models/schemas
2. Implement CRUD operations
3. Seed database with current mock data
4. Create API endpoints
5. Add error handling and validation

### Phase 2: Frontend Integration  
1. Create API service layer
2. Replace mock data calls with API calls
3. Add loading states and error handling
4. Implement user sessions/auth
5. Test all user flows

### Phase 3: Enhanced Features
1. User progress tracking
2. Achievement system
3. Recommendation engine
4. Search and filtering optimization

## Notes
- All timestamps use ISO 8601 format
- User identification initially by email (no complex auth)
- Recommendation logic based on assessment answers
- Progress tracking updates in real-time
- Cache frequently accessed data (tools, questions)