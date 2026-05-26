import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#1a1a2e',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          color: '#e94560',
          fontSize: '20px',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}>
          Mini E-Commerce
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={linkStyle}>
          Catalogo
        </Link>

        {user && (
          <>
            <Link to="/carrito" style={{ ...linkStyle, position: 'relative' }}>
              Carrito
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-12px',
                  backgroundColor: '#e94560',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <Link to="/pedidos" style={linkStyle}>
              Pedidos
            </Link>
          </>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#a8a8b3', fontSize: '14px' }}>
              Hola, {user.nombre}
              {user.rol === 'admin' && (
                <span style={{
                  marginLeft: '6px',
                  backgroundColor: '#e94560',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                }}>
                  Admin
                </span>
              )}
            </span>
            <button onClick={handleLogout} style={buttonStyle}>
              Cerrar sesion
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={linkStyle}>
              Iniciar sesion
            </Link>
            <Link to="/register" style={{
              ...linkStyle,
              backgroundColor: '#e94560',
              padding: '6px 14px',
              borderRadius: '6px',
            }}>
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  color: '#e0e0e0',
  textDecoration: 'none',
  fontSize: '14px',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'color 0.2s',
};

const buttonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #e94560',
  color: '#e94560',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
};

export default Navbar;
