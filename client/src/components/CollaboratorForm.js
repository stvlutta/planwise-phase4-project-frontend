import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CollaboratorSchema = Yup.object().shape({
  user_id: Yup.number()
    .required('Please select a user'),
  role: Yup.string()
    .oneOf(['owner', 'member', 'viewer'], 'Invalid role')
    .required('Role is required')
});

function CollaboratorForm({ 
  projectId, 
  collaborator, 
  onCollaboratorAdded, 
  onCollaboratorUpdated, 
  onCancel, 
  isEdit = false 
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const url = isEdit ? `/project-collaborators/${collaborator.id}` : '/project-collaborators';
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...values,
          project_id: parseInt(projectId)
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (isEdit) {
          onCollaboratorUpdated(result);
        } else {
          onCollaboratorAdded(result);
        }
      } else {
        const error = await response.json();
        setStatus(error.error || 'An error occurred');
      }
    } catch (error) {
      setStatus('Network error occurred');
    }
    setSubmitting(false);
  };

  const initialValues = {
    user_id: collaborator ? collaborator.user_id : '',
    role: collaborator ? collaborator.role : 'member'
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="collaborator-form-overlay">
      <div className="collaborator-form-modal">
        <div className="form-header">
          <h3>{isEdit ? 'Edit Collaborator' : 'Add New Collaborator'}</h3>
          <button onClick={onCancel} className="btn-close">×</button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={CollaboratorSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="collaborator-form">
              {status && <div className="error-message">{status}</div>}
              
              <div className="form-group">
                <label htmlFor="user_id">User</label>
                <Field as="select" name="user_id" className="form-control">
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="user_id" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <Field as="select" name="role" className="form-control">
                  <option value="viewer">Viewer - Can view project and tasks</option>
                  <option value="member">Member - Can view, create, and edit tasks</option>
                  <option value="owner">Owner - Full project access</option>
                </Field>
                <ErrorMessage name="role" component="div" className="error-message" />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={onCancel} 
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Collaborator' : 'Add Collaborator')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CollaboratorForm;