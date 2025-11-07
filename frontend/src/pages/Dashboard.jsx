import React, { useEffect, useState } from 'react';
import '../styles/main.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('usuarios');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setError('No hay token de acceso');
          return;
        }
        
        // Obtener perfil del admin
        try {
          const profileResponse = await fetch('http://localhost:5000/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setUserProfile(profileData.user);
          } else {
            console.error('Error al obtener perfil:', profileResponse.status);
          }
        } catch (profileError) {
          console.error('Error en perfil:', profileError);
        }

        // Obtener todos los usuarios
        try {
          const usersResponse = await fetch('http://localhost:5000/users', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setUsers(usersData.users || []);
          } else {
            console.error('Error al obtener usuarios:', usersResponse.status);
            setUsers([]);
          }
        } catch (usersError) {
          console.error('Error en usuarios:', usersError);
          setUsers([]);
        }

        // Obtener todos los productos
        try {
          const productsResponse = await fetch('http://localhost:5000/products/all', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            setProducts(productsData.products || []);
          } else {
            console.error('Error al obtener productos:', productsResponse.status);
            setProducts([]);
          }
        } catch (productsError) {
          console.error('Error en productos:', productsError);
          setProducts([]);
        }

        // Obtener todos los carritos
        try {
          const cartsResponse = await fetch('http://localhost:5000/cart/all', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (cartsResponse.ok) {
            const cartsData = await cartsResponse.json();
            setCarts(cartsData.carts || []);
          } else {
            console.error('Error al obtener carritos:', cartsResponse.status);
            setCarts([]);
          }
        } catch (cartsError) {
          console.error('Error en carritos:', cartsError);
          setCarts([]);
        }
        
      } catch (err) {
        console.error('Error general:', err);
        setError('Error de conexión: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  const renderUsersSection = () => (
    <div className="dashboard-section animate-fade-in">
      <h2 className="dashboard-section-title">Usuarios Registrados</h2>
      
      {users.length === 0 ? (
        <p className="dashboard-empty-message">No hay usuarios registrados.</p>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead className="dashboard-table-header">
              <tr>
                <th className="dashboard-table-header-cell">Nombre</th>
                <th className="dashboard-table-header-cell">Email</th>
                <th className="dashboard-table-header-cell">Rol</th>
                <th className="dashboard-table-header-cell">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="dashboard-table-body">
              {users.map((user, index) => (
                <tr key={user._id || index} className="dashboard-table-row">
                  <td className="dashboard-table-cell dashboard-table-cell--name">
                    {user.name}
                  </td>
                  <td className="dashboard-table-cell">
                    {user.email}
                  </td>
                  <td className="dashboard-table-cell">
                    <span className={`dashboard-role-badge ${
                      user.role?.name === 'admin' ? 'dashboard-role-badge--admin' :
                      user.role?.name === 'seller' ? 'dashboard-role-badge--seller' :
                      'dashboard-role-badge--user'
                    }`}>
                      {user.role?.name || user.role}
                    </span>
                  </td>
                  <td className="dashboard-table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderProductsSection = () => (
    <div className="dashboard-section animate-fade-in">
      <h2 className="dashboard-section-title">Productos del Sistema</h2>
      
      {products.length === 0 ? (
        <p className="dashboard-empty-message">No hay productos registrados.</p>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead className="dashboard-table-header">
              <tr>
                <th className="dashboard-table-header-cell">Nombre</th>
                <th className="dashboard-table-header-cell">Descripción</th>
                <th className="dashboard-table-header-cell">Precio</th>
                <th className="dashboard-table-header-cell">Stock</th>
                <th className="dashboard-table-header-cell">Vendedor</th>
                <th className="dashboard-table-header-cell">Creado</th>
              </tr>
            </thead>
            <tbody className="dashboard-table-body">
              {products.map((product, index) => (
                <tr key={product._id || index} className="dashboard-table-row">
                  <td className="dashboard-table-cell dashboard-table-cell--name">
                    {product.name}
                  </td>
                  <td className="dashboard-table-cell">
                    {product.description}
                  </td>
                  <td className="dashboard-table-cell dashboard-table-cell--price">
                    ${product.price}
                  </td>
                  <td className="dashboard-table-cell">
                    {product.stock}
                  </td>
                  <td className="dashboard-table-cell">
                    {product.createdBy ? (
                      <div className="seller-info">
                        <span className="seller-name">{product.createdBy.name}</span>
                        <span className="seller-email">{product.createdBy.email}</span>
                      </div>
                    ) : (
                      <span className="no-seller">Sin vendedor</span>
                    )}
                  </td>
                  <td className="dashboard-table-cell">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCartsSection = () => (
    <div className="dashboard-section animate-fade-in">
      <h2 className="dashboard-section-title">Carritos de Compras</h2>
      
      {carts.length === 0 ? (
        <p className="dashboard-empty-message">No hay carritos activos.</p>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead className="dashboard-table-header">
              <tr>
                <th className="dashboard-table-header-cell">Usuario</th>
                <th className="dashboard-table-header-cell">Productos</th>
                <th className="dashboard-table-header-cell">Total</th>
                <th className="dashboard-table-header-cell">Actualizado</th>
              </tr>
            </thead>
            <tbody className="dashboard-table-body">
              {carts.map((cart, index) => {
                // Calcular el total del carrito
                const total = cart.products?.reduce((sum, item) => {
                  return sum + (item.product?.price || 0) * (item.quantity || 0);
                }, 0) || 0;

                return (
                  <tr key={cart._id || index} className="dashboard-table-row">
                    <td className="dashboard-table-cell dashboard-table-cell--name">
                      {cart.user?.name || 'Usuario desconocido'}
                    </td>
                    <td className="dashboard-table-cell">
                      {cart.products?.length || 0} productos
                    </td>
                    <td className="dashboard-table-cell dashboard-table-cell--price">
                      ${total.toFixed(2)}
                    </td>
                    <td className="dashboard-table-cell">
                      {cart.updatedAt ? new Date(cart.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderMainContent = () => (
    <div className="dashboard animate-fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Panel de Administración</h1>
          {userProfile && (
            <p className="dashboard-subtitle">
              Bienvenido, {userProfile.name}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="dashboard-navigation">
        <div className="dashboard-nav-container">
          <div className="dashboard-nav-buttons">
            <button
              onClick={() => setActiveSection('usuarios')}
              className={`dashboard-nav-button ${
                activeSection === 'usuarios'
                  ? 'dashboard-nav-button--active'
                  : 'dashboard-nav-button--inactive'
              }`}
            >
              Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveSection('productos')}
              className={`dashboard-nav-button ${
                activeSection === 'productos'
                  ? 'dashboard-nav-button--active'
                  : 'dashboard-nav-button--inactive'
              }`}
            >
              Productos ({products.length})
            </button>
            <button
              onClick={() => setActiveSection('carritos')}
              className={`dashboard-nav-button ${
                activeSection === 'carritos'
                  ? 'dashboard-nav-button--active'
                  : 'dashboard-nav-button--inactive'
              }`}
            >
              Carritos ({carts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeSection === 'usuarios' && renderUsersSection()}
        {activeSection === 'productos' && renderProductsSection()}
        {activeSection === 'carritos' && renderCartsSection()}
      </div>
    </div>
  );

  return renderMainContent();
};

export default Dashboard;