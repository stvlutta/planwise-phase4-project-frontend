import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://planwise-backend-kkns.onrender.com';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dueDate: 'all'
  });
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch(`${API_URL}/tasks/${id}`, { 
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    
    // Due date filter
    if (filters.dueDate !== 'all') {
      const today = new Date();
      const taskDueDate = task.due_date ? new Date(task.due_date) : null;
      
      switch (filters.dueDate) {
        case 'overdue':
          if (!taskDueDate || taskDueDate >= today) return false;
          break;
        case 'today':
          if (!taskDueDate || taskDueDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'this_week':
          if (!taskDueDate) return false;
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (taskDueDate < today || taskDueDate > weekFromNow) return false;
          break;
        case 'no_due_date':
          if (taskDueDate) return false;
          break;
        default:
          break;
      }
    }
    
    return true;
  });

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      dueDate: 'all'
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== 'all').length;
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks ({filteredTasks.length})</h1>
        <Link to="/tasks/new" className="btn btn-success">Create New Task</Link>
      </div>

      <div className="card filter-section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Filter Tasks</h3>
          {getActiveFilterCount() > 0 && (
            <button 
              onClick={clearAllFilters}
              className="btn btn-secondary btn-sm"
            >
              Clear All Filters ({getActiveFilterCount()})
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <h4>Status</h4>
          <div className="filter-buttons">
            <button 
              className={`btn ${filters.status === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('status', 'all')}
            >
              All ({tasks.length})
            </button>
            <button 
              className={`btn ${filters.status === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('status', 'pending')}
            >
              Pending ({tasks.filter(t => t.status === 'pending').length})
            </button>
            <button 
              className={`btn ${filters.status === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('status', 'in_progress')}
            >
              In Progress ({tasks.filter(t => t.status === 'in_progress').length})
            </button>
            <button 
              className={`btn ${filters.status === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('status', 'completed')}
            >
              Completed ({tasks.filter(t => t.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <h4>Priority</h4>
          <div className="filter-buttons">
            <button 
              className={`btn ${filters.priority === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('priority', 'all')}
            >
              All Priorities
            </button>
            <button 
              className={`btn ${filters.priority === 'high' ? 'btn-primary' : 'btn-secondary'} priority-high-btn`}
              onClick={() => updateFilter('priority', 'high')}
            >
              High ({tasks.filter(t => t.priority === 'high').length})
            </button>
            <button 
              className={`btn ${filters.priority === 'medium' ? 'btn-primary' : 'btn-secondary'} priority-medium-btn`}
              onClick={() => updateFilter('priority', 'medium')}
            >
              Medium ({tasks.filter(t => t.priority === 'medium').length})
            </button>
            <button 
              className={`btn ${filters.priority === 'low' ? 'btn-primary' : 'btn-secondary'} priority-low-btn`}
              onClick={() => updateFilter('priority', 'low')}
            >
              Low ({tasks.filter(t => t.priority === 'low').length})
            </button>
          </div>
        </div>

        {/* Due Date Filter */}
        <div className="filter-group">
          <h4>Due Date</h4>
          <div className="filter-buttons">
            <button 
              className={`btn ${filters.dueDate === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('dueDate', 'all')}
            >
              All Dates
            </button>
            <button 
              className={`btn ${filters.dueDate === 'overdue' ? 'btn-primary' : 'btn-secondary'} overdue-btn`}
              onClick={() => updateFilter('dueDate', 'overdue')}
            >
              Overdue ({tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length})
            </button>
            <button 
              className={`btn ${filters.dueDate === 'today' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('dueDate', 'today')}
            >
              Due Today ({tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()).length})
            </button>
            <button 
              className={`btn ${filters.dueDate === 'this_week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('dueDate', 'this_week')}
            >
              This Week ({tasks.filter(t => {
                if (!t.due_date) return false;
                const taskDate = new Date(t.due_date);
                const today = new Date();
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return taskDate >= today && taskDate <= weekFromNow;
              }).length})
            </button>
            <button 
              className={`btn ${filters.dueDate === 'no_due_date' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('dueDate', 'no_due_date')}
            >
              No Due Date ({tasks.filter(t => !t.due_date).length})
            </button>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card">
          <p>No tasks found. <Link to="/tasks/new">Create your first task</Link></p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <div key={task.id} className={`task-item priority-${task.priority}`}>
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                  {task.due_date && (
                    <span className={`due-date-info ${new Date(task.due_date) < new Date() ? 'overdue' : ''}`}>
                      📅 Due: {new Date(task.due_date).toLocaleDateString()}
                      {new Date(task.due_date) < new Date() && ' (Overdue)'}
                    </span>
                  )}
                  {task.project && (
                    <span className="project-info">
                      📁 {task.project.title}
                    </span>
                  )}
                  <span className={`priority-info priority-${task.priority}`}>
                    {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority.toUpperCase()} Priority
                  </span>
                </div>
              </div>
              <div className="task-meta">
                <span className={`status-badge status-${task.status}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  {task.priority} priority
                </span>
                <div>
                  <select 
                    value={task.status} 
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    style={{ marginRight: '0.5rem', padding: '0.25rem' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Link to={`/tasks/${task.id}/edit`} className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="btn btn-danger"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;