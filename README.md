# AI Navigator

AI Navigator is an application that helps users discover and learn AI tools based on their skill level, time availability, and goals.

## Project Structure

The project is divided into two main parts:

1. **Backend**: A FastAPI application that provides the API endpoints for the frontend.
2. **Frontend**: A React application that provides the user interface.

## Backend

The backend is built with FastAPI and MongoDB. It provides the following features:

- User authentication with JWT tokens
- User profile management
- Tool discovery and filtering
- Learning plan management
- Assessment for personalized recommendations

### Backend Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── auth.py
│   │   ├── config.py
│   │   └── database.py
│   ├── models/
│   │   ├── assessment.py
│   │   ├── learning_plan.py
│   │   ├── tool.py
│   │   └── user.py
│   ├── routes/
│   │   ├── assessment.py
│   │   ├── auth.py
│   │   ├── learning_plans.py
│   │   ├── tools.py
│   │   └── users.py
│   ├── services/
│   │   ├── assessment_service.py
│   │   ├── learning_plan_service.py
│   │   ├── tool_service.py
│   │   └── user_service.py
│   ├── utils/
│   │   └── seed_data.py
│   └── main.py
├── .env
├── requirements.txt
└── run.py
```

### Running the Backend

1. Install the required dependencies:

```bash
cd backend
pip install -r requirements.txt
```

2. Start MongoDB:

```bash
mongod --fork --logpath /var/log/mongodb.log
```

3. Seed the database with initial data:

```bash
python -m app.utils.seed_data
```

4. Start the backend server:

```bash
python run.py
```

The backend server will be available at http://localhost:12000.

## Frontend

The frontend is built with React and provides the following features:

- User authentication
- Tool discovery and filtering
- Learning plan management
- Assessment for personalized recommendations
- User profile management

### Frontend Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── config/
│   │   └── api.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Assessment.js
│   │   ├── Dashboard.js
│   │   ├── LandingPage.js
│   │   ├── LearningPlans.js
│   │   ├── Login.js
│   │   ├── PlanDetail.js
│   │   ├── Register.js
│   │   ├── ToolDetail.js
│   │   └── ToolDirectory.js
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

### Running the Frontend

1. Install the required dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend server:

```bash
npm start
```

The frontend server will be available at http://localhost:3000.

## API Documentation

The API documentation is available at http://localhost:12000/docs when the backend server is running.

## Default Admin User

A default admin user is created when seeding the database:

- Email: admin@ainavigator.com
- Password: adminpassword

## License

This project is licensed under the MIT License.
