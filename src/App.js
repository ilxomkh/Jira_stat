import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import ProjectDetail from "./components/ProjectDetail";
import FilteredTasks from "./components/FilteredTasks";
import TasksByStatus from "./components/TasksByStatus";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/users" element={<Users />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/filtered-tasks" element={<FilteredTasks />} />
        <Route path="/tasks-by-status" element={<TasksByStatus />} />
      </Routes>
    </Router>
  );
}

export default App;