import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalProjects: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, projectsResponse] = await Promise.all([
        fetch('/tasks', { headers: getAuthHeaders() }),
        fetch('/projects', { headers: getAuthHeaders() })
      ]);

      const tasks = await tasksResponse.json();
      const projects = await projectsResponse.json();

      setStats({
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'pending').length,
        completedTasks: tasks.filter(task => task.status === 'completed').length,
        totalProjects: projects.length
      });

      // Get 5 most recent tasks
      const sortedTasks = tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecentTasks(sortedTasks.slice(0, 5));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingTasks}</div>
          <div className="stat-label">Pending Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completedTasks}</div>
          <div className="stat-label">Completed Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalProjects}</div>
          <div className="stat-label">Total Projects</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="btn btn-primary">View All Tasks</Link>
        </div>
        
        {recentTasks.length === 0 ? (
          <p>No tasks available. <Link to="/tasks/new">Create your first task</Link></p>
        ) : (
          <div className="task-list">
            {recentTasks.map(task => (
              <div key={task.id} className={`task-item priority-${task.priority}`}>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="task-meta">
                  <span className={`status-badge status-${task.status}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#666' }}>
                    {task.priority} priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
        <Link to="/tasks/new" className="btn btn-success btn-lg">Create New Task</Link>
        <Link to="/projects/new" className="btn btn-success btn-lg">Create New Project</Link>
      </div>
    </div>
  );
}

export default Dashboard;