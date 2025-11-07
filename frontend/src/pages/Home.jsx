import React, { useState, useEffect } from 'react';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('userRole');
  
  const { toast, showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    // Cargar los productos públicos cuando el componente se monte
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products/public');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole');
      
      if (!token) {
        showWarning('You must log in to add products to cart.');
        return;
      }

      // Solo los usuarios comunes pueden agregar productos al carrito
      if (userRole === 'admin') {
        showWarning('Administrators cannot add products to cart.');
        return;
      }

      if (userRole === 'seller') {
        showWarning('Sellers cannot buy products. Your role is to sell.');
        return;
      }

      const response = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      
      const data = await response.json();
      console.log('[DEBUG] Add to cart response:', data); // Para debug
      
      if (data.success) {
        showSuccess('Product added to cart successfully!');
        // Disparar evento personalizado para que el carrito se actualice
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        showError(data.message || 'Error adding product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Connection error when adding product to cart.');
    }
  };

  // Duplicar productos para crear efecto infinito
  const duplicatedProducts = products.length > 0 ? [...products, ...products] : [];

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">
          <div>Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">Online Store</h1>
          <p className="home-subtitle">
            Discover the best products with the best quality and price
          </p>
          <button className="home-cta">
            Explore Products
          </button>
        </div>
      </section>

      {/* Carrusel de productos */}
      <section className="products-carousel-section">
        <div className="carousel-header">
          <h2 className="carousel-title">Featured Products</h2>
          <p className="carousel-subtitle">
            Explore our selection of featured products
          </p>
        </div>

        {products.length > 0 ? (
          <div className="products-carousel">
            <div className="carousel-track">
              {duplicatedProducts.map((product, index) => (
                <div key={`${product._id}-${index}`} className="product-card">
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        onError={e => { 
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="image-placeholder"
                      style={{ display: product.imageUrl ? 'none' : 'flex' }}
                    ></div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">${product.price}</p>
                    <p className="product-stock">
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
                    </p>
                    <div className="product-actions">
                      {userRole === 'admin' ? (
                        <button
                          className="add-to-cart-btn admin-view-btn"
                          disabled
                        >
                          View Only
                        </button>
                      ) : userRole === 'seller' ? (
                        <button
                          className="add-to-cart-btn seller-view-btn"
                          disabled
                        >
                          You Sell Only
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(product._id)}
                          className="add-to-cart-btn"
                          disabled={product.stock <= 0}
                        >
                          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-products">
            <div className="no-products-icon"></div>
            <p className="no-products-text">
              No products available at this time
            </p>
          </div>
        )}
      </section>
      
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </div>
  );
}

export default Home;