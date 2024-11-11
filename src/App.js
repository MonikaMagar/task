import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', email: '', mobile: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };


  const addStudent = async () => {
    try {
      await axios.post('http://localhost:4000/add', formData);
      fetchStudents();
      setFormData({ name: '', age: '', email: '', mobile: '' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  // Update a student
  const updateStudent = async () => {
    try {
      await axios.put(`http://localhost:4000/update/${editId}`, formData);
      fetchStudents();
      setEditId(null);
      setFormData({ name: '', age: '', email: '', mobile: '' });
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  // Delete a student
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/delete/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? updateStudent() : addStudent();
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Set student data to form for editing
  const handleEdit = (student) => {
    setEditId(student.id);
    setFormData({ name: student.name, age: student.age, email: student.email, mobile: student.mobile });
  };

  return (
    <div className="app-container">
      <h1>Student Management</h1>
      <form className="student-form" onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" required />
        <button type="submit" className="submit-button">{editId ? 'Update Student' : 'Add Student'}</button>
      </form>

      <h2>Student List</h2>
      <ul className="student-list">
        {students.map((student) => (
          <li key={student.id} className="student-item">
            <span>{student.name} - {student.age} - {student.email} - {student.mobile}</span>
            <button onClick={() => handleEdit(student)} className="edit-button">Edit</button>
            <button onClick={() => deleteStudent(student.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;