import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();

    // Escuchar evento personalizado para actualizar carrito
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    // Cleanup del event listener
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.cart)) {
        setCart(data.cart);
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
  };

  const handleRemoveItem = async (productId) => {
    const response = await fetch(`http://localhost:5000/cart/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
    const data = await response.json();
    if (data.success && Array.isArray(data.cart)) {
      setCart(data.cart);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('¿Estás seguro de vaciar el carrito?')) return;
    const response = await fetch('http://localhost:5000/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
    const data = await response.json();
    if (data.success) {
      setCart([]);
    }
  };

  const total = cart.reduce(
    (sum, item) =>
      item.product && typeof item.product.price === 'number'
        ? sum + item.product.price * item.quantity
        : sum,
    0
  );

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center mt-8">
        Tu carrito está vacío.
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/')}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Tu Carrito</h2>
      <button
        className="mb-6 bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors"
        onClick={handleClearCart}
      >
        Vaciar Carrito
      </button>
      <ul className="w-full max-w-2xl flex flex-col gap-8">
        {cart.map((item, idx) =>
          item.product ? (
            <li
              key={item.product._id || idx}
              className="border border-gray-300 rounded p-6 flex flex-col items-center bg-white shadow"
            >
              {item.product.imageUrl && (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="mb-4 rounded-xl object-cover"
                  style={{
                    width: '320px',
                    height: '320px',
                    objectFit: 'cover',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                />
              )}
              <p className="font-semibold text-2xl text-center mb-2">{item.product.name}</p>
              <p className="text-green-700 font-bold text-xl mb-1 text-center">${item.product.price}</p>
              <p className="text-lg mb-2 text-center">Cantidad: {item.quantity}</p>
              <button
                className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 mt-2"
                onClick={() => handleRemoveItem(item.product._id)}
              >
                Eliminar
              </button>
            </li>
          ) : null
        )}
      </ul>
       <div className="w-full max-w-2xl mt-10 flex flex-col items-end gap-4">
        <span className="text-3xl font-bold">Total: ${total.toFixed(2)}</span>
        <div className="flex gap-4 justify-center items-center w-full">
          <button
            className="bg-green-600 text-white py-6 px-20 rounded text-2xl font-semibold hover:bg-green-700 transition-colors"
            onClick={() => {/* lógica de compra futura */}}
          >
            Comprar ahora
          </button>
          <button
            className="bg-blue-500 text-white py-6 px-20 rounded text-2xl font-semibold hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/')}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;