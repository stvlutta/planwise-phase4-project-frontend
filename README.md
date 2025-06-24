# PlanWise - Smart Project Management

A modern, intuitive task and project management platform built with React. PlanWise helps teams organize, track, and collaborate on projects with a clean, user-friendly interface.

## Features

- **Task Management**: Create, edit, and track tasks with priority levels and due dates
- **Project Organization**: Organize tasks into projects for better workflow management
- **User Authentication**: Secure login and signup functionality
- **Real-time Dashboard**: Get an overview of your tasks and projects at a glance
- **Collaboration**: Add collaborators to projects and manage team access
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: CSS3 with modern design system and CSS variables
- **Forms**: Formik with Yup validation
- **Authentication**: JWT-based authentication
- **Build Tool**: Create React App
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/stvlutta/planwise-phase4-project-frontend.git
cd planwise-phase4-project-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

This frontend is designed to work with a backend API. Make sure to:

1. Set up the corresponding backend server
2. Configure the proxy in `package.json` to point to your backend URL (default: `http://localhost:5555`)

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/           # React components
│   ├── App.js           # Main app component
│   ├── Dashboard.js     # Dashboard overview
│   ├── Login.js         # Login form
│   ├── Signup.js        # Registration form
│   ├── Navbar.js        # Navigation bar
│   ├── TaskList.js      # Task listing component
│   ├── TaskForm.js      # Task creation/editing
│   ├── ProjectList.js   # Project listing
│   ├── ProjectForm.js   # Project creation/editing
│   ├── CollaboratorForm.js  # Add collaborators
│   ├── CollaboratorList.js  # Manage collaborators
│   └── ProtectedRoute.js    # Route protection
├── context/             # React context providers
│   └── AuthContext.js   # Authentication context
├── index.css           # Global styles and design system
└── index.js            # App entry point
```

## Key Components

### Authentication
- **AuthContext**: Manages user authentication state
- **Login/Signup**: User authentication forms
- **ProtectedRoute**: Ensures authenticated access to protected pages

### Task Management
- **TaskList**: Display and filter tasks
- **TaskForm**: Create and edit tasks with validation
- **Dashboard**: Overview of tasks and projects

### Project Management
- **ProjectList**: Display all projects
- **ProjectForm**: Create and edit projects
- **CollaboratorForm/List**: Manage project collaborators

## Styling

The project uses a modern design system with:
- CSS custom properties for consistent theming
- Modern color palette with blues and neutrals
- Responsive grid layouts
- Smooth animations and transitions
- Professional card-based UI components

## API Integration

The app expects a REST API with the following endpoints:
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /auth/me` - Get current user
- `GET /tasks` - Get user tasks
- `POST /tasks` - Create task
- `GET /projects` - Get user projects
- `POST /projects` - Create project

## Contact

Project Link: [https://github.com/stvlutta/planwise-phase4-project-frontend](https://github.com/stvlutta/planwise-phase4-project-frontend)