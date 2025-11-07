import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const isValidImageUrl = (url) => {
  // Verifica que sea una URL válida y contenga una extensión de imagen
  const urlPattern = /^https?:\/\/.+/i;
  const imageExtensionPattern = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
  
  return urlPattern.test(url) && imageExtensionPattern.test(url);
};

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '', stock: 0, imageUrl: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast, showSuccess, showError, showWarning } = useToast();

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        showError('Error loading products.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Connection error when loading products.');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (newProduct.imageUrl && !isValidImageUrl(newProduct.imageUrl)) {
      showWarning('Please enter a valid image URL (jpg, jpeg, png, webp, gif).');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      if (data.success) {
        setNewProduct({ name: '', price: 0, description: '', stock: 0, imageUrl: '' });
        fetchProducts();
        showSuccess('Product created successfully!');
      } else {
        showError(data.message || 'Error creating product.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      showError('Connection error when creating product.');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (editingProduct.imageUrl && !isValidImageUrl(editingProduct.imageUrl)) {
      showWarning('Please enter a valid image URL (jpg, jpeg, png, webp, gif).');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(editingProduct),
      });
      const data = await response.json();
      if (data.success) {
        setEditingProduct(null);
        fetchProducts();
        showSuccess('Product updated successfully!');
      } else {
        showError(data.message || 'Error updating product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showError('Connection error when updating product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
        showSuccess('Product deleted successfully!');
      } else {
        showError(data.message || 'Error deleting product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Connection error when deleting product.');
    }
  };

  const breakpointColumnsObj = { default: 3, 1100: 2, 700: 1 };

  return (
    <div className="product-management-container">
      {/* Header */}
      <div className="product-management-header">
        <h1 className="product-management-title">Product Management</h1>
        <p className="product-management-subtitle">Manage your products inventory</p>
      </div>

      {/* Create Product Form */}
      <div className="create-product-section">
        <h2 className="create-product-title">Add New Product</h2>
        <form onSubmit={handleCreateProduct}>
          <div className="product-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Product Name</label>
              <input
                id="name"
                type="text"
                placeholder="Product name"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                placeholder="0.00"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                className="form-input"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                placeholder="0"
                value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                className="form-input"
                required
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newProduct.imageUrl}
                onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                className="form-input"
              />
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Product description"
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                className="form-textarea"
                rows="3"
              />
            </div>
          </div>
          
          {newProduct.imageUrl && isValidImageUrl(newProduct.imageUrl) && (
            <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
              <img
                src={newProduct.imageUrl}
                alt="Preview"
                style={{
                  maxWidth: '300px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          
          <button type="submit" className="create-button">
            Add Product
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="products-section">
        <h2 className="products-title">Your Products</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="products-masonry"
        columnClassName="products-masonry-column"
      >
        {products.map(product => (
          <div key={product._id} className="product-card">
            {product.imageUrl ? (
              <div className="product-image">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="product-image">
                <div className="product-image-placeholder">
                  No image available
                </div>
              </div>
            )}
            
            <div className="product-content">
              {editingProduct && editingProduct._id === product._id ? (
                <form onSubmit={handleEditProduct} className="edit-form">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="form-input"
                    required
                    min="0"
                    step="0.01"
                  />
                  <textarea
                    placeholder="Description"
                    value={editingProduct.description}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="form-textarea"
                    rows="2"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="form-input"
                    required
                    min="0"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={editingProduct.imageUrl}
                    onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    className="form-input"
                  />
                  <div className="product-actions">
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" className="cancel-button" onClick={() => setEditingProduct(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-details">
                    <span className="product-price">${product.price}</span>
                    <span className="product-stock">Stock: {product.stock}</span>
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </Masonry>
      </div>
      
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </div>
  );
}

export default ProductManagement;