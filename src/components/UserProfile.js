import React, { useEffect, useState } from 'react';
import { getProfile } from '../utils/api';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './UserProfile.css';  // Custom styles for animations

// Register chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [userStats, setUserStats] = useState({ active: 0, inactive: 0 });
  const [showCard, setShowCard] = useState(false);  // State to trigger popup effect
  const [error, setError] = useState(null);  // State to capture any errors

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Wrap the getProfile call in a try-catch to handle errors
      getProfile(token)
        .then((data) => {
          if (data) {
            setProfile(data);
            setUserStats({
              active: data.active || 0,      // Ensure fallback to 0 if data.active is not available
              inactive: data.inactive || 0   // Ensure fallback to 0 if data.inactive is not available
            });
          }
        })
        .catch((err) => {
          // Handle error by setting the error state
          console.error('Error fetching profile data:', err);
          setError('Failed to fetch profile data');
        });
    } else {
      setError('No token found. Please log in.');
    }

    // Add a delay to trigger popup effect
    setTimeout(() => {
      setShowCard(true);  // Trigger pop-up effect after 500ms
    }, 500);
  }, []);  // Empty dependency array to run only once on mount

  // Bar Chart Data for User Stats
  const userStatsChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        label: 'User Activity',
        data: [userStats.active, userStats.inactive],
        backgroundColor: ['#4CAF50', '#FF6347'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Options
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (error) {
    return <div className="error-message text-center">{error}</div>; // Show error message if there's any
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        {/* Profile Card Column */}
        <Col xs={12} md={6} lg={4}>
          <Card className={`user-profile-card shadow-lg rounded animate-card ${showCard ? 'show' : ''}`}>
            <Card.Body>
              {profile ? (
                <>
                  <Card.Title className="text-center text-muted mb-3">{profile.username}</Card.Title>
                  <Card.Subtitle className="text-center text-muted mb-3">{profile.email}</Card.Subtitle>
                  <Card.Text className="text-center text-muted mb-4">
                    <strong>Role:</strong> {profile.role}
                  </Card.Text>
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Bar Chart Column */}
        <Col xs={12} md={6} lg={6} className="mt-4 mt-md-0">
          {/* Bar Chart for User Activity */}
          <div className={`bar-chart-container ${showCard ? 'show' : ''}`}>
            <h3 className="text-center text-white mb-4">User Activity</h3>
            <Bar data={userStatsChartData} options={chartOptions} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
