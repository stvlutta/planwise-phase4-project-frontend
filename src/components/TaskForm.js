import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://planwise-backend-kkns.onrender.com';

const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  status: Yup.string()
    .oneOf(['pending', 'in_progress', 'completed'], 'Invalid status')
    .required('Status is required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .required('Priority is required'),
  user_id: Yup.number()
    .required('User is required'),
  project_id: Yup.number()
    .nullable(),
  due_date: Yup.date()
    .nullable()
});

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { getAuthHeaders, user } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    user_id: user?.id || '',
    project_id: '',
    due_date: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchProjects(),
          isEdit ? fetchTask() : Promise.resolve()
        ]);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setUsers(data);
      if (data.length > 0 && !isEdit && user) {
        setInitialValues(prev => ({ ...prev, user_id: user.id }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        headers: getAuthHeaders()
      });
      const task = await response.json();
      setInitialValues({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        user_id: task.user_id,
        project_id: task.project_id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const payload = {
        ...values,
        project_id: values.project_id || null,
        due_date: values.due_date || null
      };

      const url = isEdit ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/tasks');
      } else {
        const errorData = await response.json();
        setFieldError('submit', errorData.error || 'Failed to save task');
      }
    } catch (error) {
      setFieldError('submit', 'Network error occurred');
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  return (
    <div>
      <h1>{isEdit ? 'Edit Task' : 'Create New Task'}</h1>
      
      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={TaskSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                />
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                />
                <ErrorMessage name="description" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <Field as="select" id="status" name="status">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <Field as="select" id="priority" name="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Field>
                <ErrorMessage name="priority" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="user_id">Assigned User *</label>
                <Field as="select" id="user_id" name="user_id">
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="user_id" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="project_id">Project (Optional)</label>
                <Field as="select" id="project_id" name="project_id">
                  <option value="">No project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="project_id" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Due Date (Optional)</label>
                <Field
                  type="date"
                  id="due_date"
                  name="due_date"
                />
                <ErrorMessage name="due_date" component="div" className="error" />
              </div>

              <ErrorMessage name="submit" component="div" className="error-message" />

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => navigate('/tasks')} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-success">
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default TaskForm;