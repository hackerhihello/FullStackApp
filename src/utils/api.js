import axios from 'axios';

// Set the base URL for API requests
const API_URL = 'http://localhost:5000/api';

// Function to register a new user
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data; // Returns the response data, including the token and user data
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error message if any
  }
};

// Function to login an existing user
export const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    //   console.log(response.data); // Debugging log
      return response.data; // Returns the response data, including the token and user data
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
  

// Function to get the user profile (for regular users)
export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }, // Send JWT token in the Authorization header
    });
    return response.data; // Return profile data
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error message if any
  }
};


// Function to get the list of users (for admin)
export const getRegisterUser = async (token, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }, // Pagination parameters
    });
    return response.data.users; // Return the list of users
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error message if any
  }
};

// Function to update user details (Admin or self-update)
export const updateRegisterUser = async (token, userId, updatedData) => {
    try {
      const response = await axios.patch(`${API_URL}/users/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Returns updated user data
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
   

  // Function to toggle user status (Active/Inactive)
export const toggleUserStatus = async (token, userId) => {
    try {
      const response = await axios.patch(`${API_URL}/auth/users/${userId}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Returns success message or updated user status
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
  
  // Function to logout the user (Clear JWT token)
export const logout = () => {
    localStorage.removeItem('token'); // Or whatever storage you use
    // Redirect or update the UI as needed
  };
  

  // Function to get the list of users (for admin with pagination)
export const getUsersList = async (token, page = 1, limit = 10) => {
    try {
      // This URL can be adjusted if you're using a mock server
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users`, {
        params: {
          _page: page,  // Page number for pagination
          _limit: limit // Number of users per page
        }
      });
      // Simulating a pagination response with total data and users list
      return {
        users: response.data,
        total: 100, // Mocking a total of 100 users in the database (adjust as needed)
      };
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };
  