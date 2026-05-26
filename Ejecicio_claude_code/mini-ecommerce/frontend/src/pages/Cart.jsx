import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import client from '../api/client';

const Cart = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCreateOrder = async () => {
    setOrdering(true);
    setError('');

    try {
      await client.post('/pedidos');
      setSuccess(true);
      await clearCart();
      setTimeout(() => {
        navigate('/pedidos');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al crear el pedido';
      setError(msg);
    } finally {
      setOrdering(false);
    }
  };

  if (success) {
    return (
      <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: '#16213e',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            &#10003;
          </div>
          <h2 style={{ color: '#4caf50', marginBottom: '12px' }}>Pedido realizado</h2>
          <p style={{ color: '#a8a8b3' }}>Tu pedido se ha creado correctamente. Redirigiendo a tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#a8a8b3', fontSize: '20px', marginBottom: '16px' }}>Tu carrito esta vacio</p>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Ver catalogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: '#e0e0e0', marginBottom: '24px' }}>Mi Carrito</h1>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Lista de ítems */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Resumen del pedido */}
          <div style={{
            width: '280px',
            flexShrink: 0,
          }}>
            <div style={{
              backgroundColor: '#16213e',
              borderRadius: '10px',
              padding: '24px',
              position: 'sticky',
              top: '80px',
            }}>
              <h3 style={{ color: '#e0e0e0', marginTop: 0, marginBottom: '20px' }}>Resumen del Pedido</h3>

              <div style={{ marginBottom: '16px' }}>
                {cart.items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '13px',
                  }}>
                    <span style={{ color: '#a8a8b3', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.producto_nombre} x{item.cantidad}
                    </span>
                    <span style={{ color: '#e0e0e0' }}>
                      ${parseFloat(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                borderTop: '1px solid #333',
                paddingTop: '16px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a8a8b3', fontWeight: '600' }}>Total</span>
                  <span style={{ color: '#e94560', fontWeight: 'bold', fontSize: '20px' }}>
                    ${parseFloat(cart.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(233,69,96,0.15)',
                  border: '1px solid #e94560',
                  color: '#e94560',
                  borderRadius: '6px',
                  padding: '10px',
                  marginBottom: '12px',
                  fontSize: '13px',
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleCreateOrder}
                disabled={ordering}
                style={{
                  width: '100%',
                  backgroundColor: '#e94560',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: ordering ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  opacity: ordering ? 0.7 : 1,
                }}
              >
                {ordering ? 'Procesando...' : 'Realizar Pedido'}
              </button>

              <button
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#a8a8b3',
                  border: '1px solid #444',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginTop: '10px',
                }}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: 'calc(100vh - 60px)',
  backgroundColor: '#0f0e17',
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
};

export default Cart;
