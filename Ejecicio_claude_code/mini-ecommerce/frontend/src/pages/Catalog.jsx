import { useState, useEffect } from 'react';
import client from '../api/client';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await client.get('/productos');
        const data = response.data;
        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = [...new Set(data.map((p) => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Error al cargar los productos. Intenta de nuevo.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'Todos') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.categoria === category));
    }
  };

  if (loading) {
    return (
      <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#a8a8b3', fontSize: '18px' }}>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...pageStyle, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#e94560', fontSize: '16px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: '#e0e0e0', marginBottom: '8px' }}>Catalogo de Productos</h1>
        <p style={{ color: '#a8a8b3', marginBottom: '24px' }}>
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Filtros por categoría */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '28px',
        }}>
          {['Todos', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: selectedCategory === cat ? '#e94560' : '#16213e',
                color: selectedCategory === cat ? 'white' : '#a8a8b3',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#a8a8b3', fontSize: '16px' }}>
              No hay productos en esta categoria.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
};

export default Catalog;
