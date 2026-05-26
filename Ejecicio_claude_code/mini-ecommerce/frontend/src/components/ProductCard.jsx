import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x200?text=Sin+imagen';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      setFeedback({ type: 'error', message: 'Inicia sesion para agregar al carrito' });
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    setLoading(true);
    try {
      await addToCart(product.id, 1);
      setFeedback({ type: 'success', message: 'Agregado al carrito' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al agregar al carrito';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div style={{
      backgroundColor: '#16213e',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
    }}>
      <div style={{ position: 'relative' }}>
        <img
          src={product.imagen_url || FALLBACK_IMAGE}
          alt={product.nombre}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#0f3460',
          color: '#e0e0e0',
          fontSize: '11px',
          padding: '3px 8px',
          borderRadius: '10px',
        }}>
          {product.categoria || 'General'}
        </span>
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              color: '#e94560',
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: '8px 16px',
              borderRadius: '6px',
            }}>
              Agotado
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          color: '#e0e0e0',
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: '600',
          lineHeight: '1.3',
        }}>
          {product.nombre}
        </h3>

        <p style={{
          color: '#a8a8b3',
          fontSize: '13px',
          margin: '0 0 12px 0',
          lineHeight: '1.5',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.descripcion}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{
            color: '#e94560',
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            ${parseFloat(product.precio).toFixed(2)}
          </span>
          <span style={{
            color: isOutOfStock ? '#e94560' : '#4caf50',
            fontSize: '12px',
            backgroundColor: isOutOfStock ? 'rgba(233,69,96,0.1)' : 'rgba(76,175,80,0.1)',
            padding: '3px 8px',
            borderRadius: '10px',
          }}>
            {isOutOfStock ? 'Sin stock' : `Stock: ${product.stock}`}
          </span>
        </div>

        {feedback && (
          <div style={{
            padding: '6px 10px',
            borderRadius: '4px',
            marginBottom: '8px',
            fontSize: '13px',
            textAlign: 'center',
            backgroundColor: feedback.type === 'success' ? 'rgba(76,175,80,0.2)' : 'rgba(233,69,96,0.2)',
            color: feedback.type === 'success' ? '#4caf50' : '#e94560',
          }}>
            {feedback.message}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || loading}
          style={{
            backgroundColor: isOutOfStock ? '#444' : '#e94560',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Agregando...' : isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
