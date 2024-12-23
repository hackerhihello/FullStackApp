import React, { useState, useEffect } from 'react';
import { getRegisterUser, getUsersList, updateRegisterUser, getProfile, toggleUserStatus } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [mockUsers, setMockUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [mockSortConfig, setMockSortConfig] = useState({ key: '', direction: 'asc' });
  const [profileData, setProfileData] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState({ id: '', username: '', email: '', role: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getRegisterUser(token, currentPage, limit);
        setRegisteredUsers(response);
        setTotalUsers(response.total);

        const mockResponse = await getUsersList(token, currentPage, limit);
        setMockUsers(mockResponse.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit, token]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = totalUsers ? Math.ceil(totalUsers / limit) : 0; // Only calculate if totalUsers is valid


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await toggleUserStatus(token, userId);
      alert('User status updated successfully!');
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status');
    }
  };

  const filteredRegisteredUsers = registeredUsers.filter(user => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortTable = (key) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...filteredRegisteredUsers].sort((a, b) => {
      if (key === 'username' || key === 'email') {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      return 0;
    });

    setRegisteredUsers(sortedData);
  };

  const sortMockUsers = (key) => {
    const direction = mockSortConfig.direction === 'asc' ? 'desc' : 'asc';
    setMockSortConfig({ key, direction });

    const sortedData = [...mockUsers].sort((a, b) => {
      if (key === 'name' || key === 'email') {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      return 0;
    });

    setMockUsers(sortedData);
  };

  const chartData = {
    labels: mockUsers.map((user) => user.name),
    datasets: [
      {
        label: 'User Activity (Random)',
        data: mockUsers.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        borderWidth: 1,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
        {/* Chart Section */}
        <div className="row mb-4 d-flex justify-content-center align-items-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">User Activity Bar Chart</h5>
                </div>
                <div className="card-body">
                  <Bar data={chartData} />
                </div>
              </div>
            </div>
          </div>

          {/* Registered Users Section */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Registered Users</h5>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">
                          <button onClick={() => sortTable('username')}>
                            Username {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th scope="col">
                          <button onClick={() => sortTable('email')}>
                            Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th scope="col">Active Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegisteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.active ? 'Active' : 'Inactive'}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm ml-2"
                              onClick={() => handleToggleUserStatus(user._id)}
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


          {/* Mock Users List Section */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Mock Users List</h5>
                </div>
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">
                          <button onClick={() => sortMockUsers('name')}>
                            Name {mockSortConfig.key === 'name' ? (mockSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th scope="col">
                          <button onClick={() => sortMockUsers('email')}>
                            Email {mockSortConfig.key === 'email' ? (mockSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Website</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.address.city}, {user.address.street}</td>
                          <td>{user.phone}</td>
                          <td>{user.website}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


          {/* Pagination Section */}
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      {currentPage} of {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
