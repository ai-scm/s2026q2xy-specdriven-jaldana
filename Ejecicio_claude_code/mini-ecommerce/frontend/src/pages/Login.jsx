import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesion';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#e0e0e0', textAlign: 'center', marginBottom: '24px' }}>
          Iniciar Sesion
        </h2>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contrasena"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={submitBtnStyle}
          >
            {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </button>
        </form>

        <p style={{ color: '#a8a8b3', textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          No tienes cuenta?{' '}
          <Link to="/register" style={{ color: '#e94560' }}>
            Registrate aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: 'calc(100vh - 60px)',
  backgroundColor: '#0f0e17',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const cardStyle = {
  backgroundColor: '#16213e',
  borderRadius: '12px',
  padding: '40px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
};

const fieldStyle = {
  marginBottom: '16px',
};

const labelStyle = {
  display: 'block',
  color: '#a8a8b3',
  fontSize: '13px',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  backgroundColor: '#0f3460',
  border: '1px solid #444',
  color: '#e0e0e0',
  borderRadius: '6px',
  padding: '10px 12px',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
};

const submitBtnStyle = {
  width: '100%',
  backgroundColor: '#e94560',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '8px',
};

const errorStyle = {
  backgroundColor: 'rgba(233,69,96,0.15)',
  border: '1px solid #e94560',
  color: '#e94560',
  borderRadius: '6px',
  padding: '10px 14px',
  marginBottom: '16px',
  fontSize: '14px',
};

export default Login;
