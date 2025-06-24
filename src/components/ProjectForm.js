import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CollaboratorList from './CollaboratorList';

const ProjectSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(1000, 'Description must be less than 1000 characters'),
  owner_id: Yup.number()
    .required('Owner is required')
});

function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [users, setUsers] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    owner_id: ''
  });

  useEffect(() => {
    fetchUsers();
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data);
      if (data.length > 0 && !isEdit) {
        setInitialValues(prev => ({ ...prev, owner_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const project = await response.json();
      setInitialValues({
        title: project.title,
        description: project.description || '',
        owner_id: project.owner_id
      });
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const url = isEdit ? `/projects/${id}` : '/projects';
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/projects');
      } else {
        const errorData = await response.json();
        setFieldError('submit', errorData.error || 'Failed to save project');
      }
    } catch (error) {
      setFieldError('submit', 'Network error occurred');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Project' : 'Create New Project'}</h1>
      
      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={ProjectSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Project Title *</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter project title"
                />
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter project description"
                  rows="4"
                />
                <ErrorMessage name="description" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="owner_id">Project Owner *</label>
                <Field as="select" id="owner_id" name="owner_id">
                  <option value="">Select project owner</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="owner_id" component="div" className="error" />
              </div>

              <ErrorMessage name="submit" component="div" className="error-message" />

              <div>
                <button type="submit" disabled={isSubmitting} className="btn btn-success">
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/projects')} 
                  className="btn"
                  style={{ marginLeft: '0.5rem' }}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      
      {isEdit && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <CollaboratorList projectId={id} />
        </div>
      )}
    </div>
  );
}

export default ProjectForm;