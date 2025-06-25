import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CollaboratorList from './CollaboratorList';

const API_URL = process.env.REACT_APP_API_URL || 'https://planwise-backend-kkns.onrender.com';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all tasks in this project.')) {
      try {
        await fetch(`${API_URL}/projects/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const toggleCollaborators = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleCollaboratorChange = () => {
    // Refresh projects to update collaboration counts
    fetchProjects();
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects ({projects.length})</h1>
        <Link to="/projects/new" className="btn btn-success">Create New Project</Link>
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <p>No projects found. <Link to="/projects/new">Create your first project</Link></p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {projects.map(project => (
            <div key={project.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{project.title}</h3>
                  <p style={{ color: '#666', margin: '0 0 1rem 0' }}>{project.description}</p>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    <p style={{ margin: '0.25rem 0' }}>
                      Owner: {project.owner ? project.owner.username : 'Unknown'}
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      Tasks: {project.tasks ? project.tasks.length : 0}
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      Collaborators: {project.collaborators ? project.collaborators.length : 0}
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleCollaborators(project.id)}
                    className="btn btn-info"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    {expandedProject === project.id ? 'Hide' : 'Manage'} Collaborators
                  </button>
                  <Link 
                    to={`/projects/${project.id}/edit`} 
                    className="btn"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteProject(project.id)} 
                    className="btn btn-danger"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {project.tasks && project.tasks.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Recent Tasks</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {project.tasks.slice(0, 3).map(task => (
                      <span 
                        key={task.id} 
                        className={`status-badge status-${task.status}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {task.title}
                      </span>
                    ))}
                    {project.tasks.length > 3 && (
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>
                        +{project.tasks.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {expandedProject === project.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                  <CollaboratorList 
                    projectId={project.id} 
                    onCollaboratorChange={handleCollaboratorChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectList;