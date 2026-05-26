import { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (newQty) => {
    const qty = parseInt(newQty);
    if (isNaN(qty) || qty < 1) return;
    if (qty > item.producto_stock) return;

    setLoading(true);
    try {
      await updateItem(item.id, qty);
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeItem(item.id);
    } catch (err) {
      console.error('Error al eliminar ítem:', err);
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: '#16213e',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    }}>
      <img
        src={item.producto_imagen_url || 'https://via.placeholder.com/80x80?text=img'}
        alt={item.producto_nombre}
        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=img'; }}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '6px',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          color: '#e0e0e0',
          margin: '0 0 4px 0',
          fontSize: '15px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.producto_nombre}
        </h4>
        <p style={{ color: '#a8a8b3', margin: '0 0 4px 0', fontSize: '13px' }}>
          {item.producto_categoria}
        </p>
        <p style={{ color: '#e94560', margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
          ${parseFloat(item.producto_precio).toFixed(2)} c/u
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => handleQuantityChange(item.cantidad - 1)}
          disabled={loading || item.cantidad <= 1}
          style={qtyBtnStyle}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={item.producto_stock}
          value={item.cantidad}
          onChange={(e) => handleQuantityChange(e.target.value)}
          disabled={loading}
          style={{
            width: '50px',
            textAlign: 'center',
            backgroundColor: '#0f3460',
            border: '1px solid #444',
            color: '#e0e0e0',
            borderRadius: '4px',
            padding: '4px',
            fontSize: '14px',
          }}
        />
        <button
          onClick={() => handleQuantityChange(item.cantidad + 1)}
          disabled={loading || item.cantidad >= item.producto_stock}
          style={qtyBtnStyle}
        >
          +
        </button>
      </div>

      <div style={{ flexShrink: 0, textAlign: 'right', minWidth: '80px' }}>
        <p style={{ color: '#4caf50', fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '16px' }}>
          ${parseFloat(item.subtotal).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          disabled={loading}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #e94560',
            color: '#e94560',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

const qtyBtnStyle = {
  backgroundColor: '#0f3460',
  border: '1px solid #444',
  color: '#e0e0e0',
  width: '28px',
  height: '28px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default CartItem;
