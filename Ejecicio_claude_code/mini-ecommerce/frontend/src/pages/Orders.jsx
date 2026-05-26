import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const estadoColors = {
  pendiente: { bg: 'rgba(255,193,7,0.15)', color: '#ffc107' },
  procesando: { bg: 'rgba(33,150,243,0.15)', color: '#2196f3' },
  enviado: { bg: 'rgba(156,39,176,0.15)', color: '#9c27b0' },
  entregado: { bg: 'rgba(76,175,80,0.15)', color: '#4caf50' },
  cancelado: { bg: 'rgba(233,69,96,0.15)', color: '#e94560' },
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!expanded && !detail) {
      setLoading(true);
      try {
        const response = await client.get(`/pedidos/${order.id}`);
        setDetail(response.data);
      } catch (err) {
        console.error('Error al obtener detalle del pedido:', err);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  const colors = estadoColors[order.estado] || { bg: 'rgba(168,168,179,0.15)', color: '#a8a8b3' };

  return (
    <div style={{
      backgroundColor: '#16213e',
      borderRadius: '10px',
      marginBottom: '16px',
      overflow: 'hidden',
    }}>
      <div
        onClick={handleExpand}
        style={{
          padding: '20px 24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#a8a8b3', fontSize: '12px' }}>Pedido</span>
            <p style={{ color: '#e0e0e0', fontWeight: 'bold', margin: '2px 0 0 0', fontSize: '15px' }}>
              #{order.id}
            </p>
          </div>

          <div>
            <span style={{ color: '#a8a8b3', fontSize: '12px' }}>Fecha</span>
            <p style={{ color: '#e0e0e0', margin: '2px 0 0 0', fontSize: '14px' }}>
              {new Date(order.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div>
            <span style={{ color: '#a8a8b3', fontSize: '12px' }}>Total</span>
            <p style={{ color: '#e94560', fontWeight: 'bold', margin: '2px 0 0 0', fontSize: '16px' }}>
              ${parseFloat(order.total).toFixed(2)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            backgroundColor: colors.bg,
            color: colors.color,
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'capitalize',
          }}>
            {order.estado}
          </span>
          <span style={{ color: '#a8a8b3', fontSize: '18px' }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{
          borderTop: '1px solid #333',
          padding: '20px 24px',
        }}>
          {loading ? (
            <p style={{ color: '#a8a8b3', textAlign: 'center' }}>Cargando detalles...</p>
          ) : detail ? (
            <div>
              <h4 style={{ color: '#a8a8b3', marginTop: 0, marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase' }}>
                Productos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detail.items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    backgroundColor: '#0f3460',
                    borderRadius: '6px',
                  }}>
                    <img
                      src={item.producto_imagen_url || 'https://via.placeholder.com/50x50?text=img'}
                      alt={item.producto_nombre}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=img'; }}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#e0e0e0', margin: '0 0 2px 0', fontSize: '14px', fontWeight: '500' }}>
                        {item.producto_nombre}
                      </p>
                      <p style={{ color: '#a8a8b3', margin: 0, fontSize: '12px' }}>
                        {item.cantidad} x ${parseFloat(item.precio_unitario).toFixed(2)}
                      </p>
                    </div>
                    <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '15px' }}>
                      ${parseFloat(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #333',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <div>
                  <span style={{ color: '#a8a8b3', marginRight: '12px' }}>Total del pedido:</span>
                  <span style={{ color: '#e94560', fontWeight: 'bold', fontSize: '18px' }}>
                    ${parseFloat(detail.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#e94560' }}>Error al cargar los detalles</p>
          )}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await client.get('/pedidos');
        setOrders(response.data);
      } catch (err) {
        setError('Error al cargar los pedidos');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#a8a8b3', fontSize: '18px' }}>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: '#e0e0e0', marginBottom: '8px' }}>Mis Pedidos</h1>
        <p style={{ color: '#a8a8b3', marginBottom: '28px' }}>
          {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
        </p>

        {error && (
          <div style={{
            backgroundColor: 'rgba(233,69,96,0.15)',
            border: '1px solid #e94560',
            color: '#e94560',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#a8a8b3', fontSize: '16px', marginBottom: '16px' }}>
              Aun no has realizado ningun pedido
            </p>
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
              Ir al catalogo
            </button>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
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

export default Orders;
