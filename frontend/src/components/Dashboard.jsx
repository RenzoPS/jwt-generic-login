import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, logout } from '../services/api';
import UserProfile from './UserProfile';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenido, {user?.username}!</h1>
        <div className="header-buttons">
          <button 
            onClick={() => setShowProfile(!showProfile)} 
            className="profile-button"
          >
            {showProfile ? 'Ver Usuarios' : 'Mi Perfil'}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {showProfile ? (
        <UserProfile />
      ) : (
        <div className="users-section">
          <h2>Usuarios Registrados</h2>
          <div className="users-list">
            {users.map((u) => (
              <div key={u._id} className="user-card">
                <h3>{u.username}</h3>
                <p>{u.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 