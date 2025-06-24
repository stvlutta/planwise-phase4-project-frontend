import React, { useState, useEffect } from 'react';
import CollaboratorForm from './CollaboratorForm';

function CollaboratorList({ projectId, onCollaboratorChange }) {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchCollaborators();
    }
  }, [projectId]);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch('/project-collaborators', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Filter collaborators for this project
      const projectCollaborators = data.filter(collab => collab.project_id === parseInt(projectId));
      setCollaborators(projectCollaborators);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      setLoading(false);
    }
  };

  const deleteCollaborator = async (id) => {
    if (window.confirm('Are you sure you want to remove this collaborator?')) {
      try {
        await fetch(`/project-collaborators/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCollaborators(collaborators.filter(collab => collab.id !== id));
        if (onCollaboratorChange) onCollaboratorChange();
      } catch (error) {
        console.error('Error removing collaborator:', error);
      }
    }
  };

  const handleCollaboratorAdded = (newCollaborator) => {
    setCollaborators([...collaborators, newCollaborator]);
    setShowForm(false);
    if (onCollaboratorChange) onCollaboratorChange();
  };

  const handleCollaboratorUpdated = (updatedCollaborator) => {
    setCollaborators(collaborators.map(collab => 
      collab.id === updatedCollaborator.id ? updatedCollaborator : collab
    ));
    setEditingCollaborator(null);
    if (onCollaboratorChange) onCollaboratorChange();
  };

  const updateCollaboratorRole = async (collaboratorId, newRole) => {
    try {
      const response = await fetch(`/project-collaborators/${collaboratorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        const updatedCollaborator = await response.json();
        handleCollaboratorUpdated(updatedCollaborator);
      }
    } catch (error) {
      console.error('Error updating collaborator role:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return '#e74c3c';
      case 'member': return '#3498db';
      case 'viewer': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  if (loading) return <div className="loading">Loading collaborators...</div>;

  return (
    <div className="collaborator-section">
      <div className="section-header">
        <h3>Collaborators ({collaborators.length})</h3>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-success btn-sm"
        >
          Add Collaborator
        </button>
      </div>

      {showForm && (
        <CollaboratorForm
          projectId={projectId}
          onCollaboratorAdded={handleCollaboratorAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingCollaborator && (
        <CollaboratorForm
          projectId={projectId}
          collaborator={editingCollaborator}
          onCollaboratorUpdated={handleCollaboratorUpdated}
          onCancel={() => setEditingCollaborator(null)}
          isEdit={true}
        />
      )}

      {collaborators.length === 0 ? (
        <div className="empty-state">
          <p>No collaborators yet. Add team members to start collaborating!</p>
        </div>
      ) : (
        <div className="collaborator-list">
          {collaborators.map(collaborator => (
            <div key={collaborator.id} className="collaborator-item">
              <div className="collaborator-info">
                <div className="collaborator-name">
                  {collaborator.user ? collaborator.user.username : 'Unknown User'}
                </div>
                <div className="collaborator-email">
                  {collaborator.user ? collaborator.user.email : 'No email'}
                </div>
              </div>
              
              <div className="collaborator-role">
                <select 
                  value={collaborator.role} 
                  onChange={(e) => updateCollaboratorRole(collaborator.id, e.target.value)}
                  className="role-select"
                  style={{ backgroundColor: getRoleColor(collaborator.role) }}
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              
              <div className="collaborator-actions">
                <span className="collaborator-date">
                  Added {new Date(collaborator.created_at).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => deleteCollaborator(collaborator.id)}
                  className="btn-remove"
                  title="Remove collaborator"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollaboratorList;