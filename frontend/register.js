// Register form handler
document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  // Send data to the server
  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    if (data.token && data.refreshToken && data.user) {
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userId', data.user._id);

      // Redirigir al login después del registro
      window.location.href = 'login.html';
    } else {
      showError('Error: No se recibieron los datos esperados del servidor.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showError('Error: No se pudo enviar el formulario.');
  });
});

// Ocultar el campo de admin secret code si el rol no es admin
const roleField = document.getElementById('role');
const adminSecretCodeField = document.getElementById('adminSecretCode');

roleField.addEventListener('change', function() {
  if (this.value === 'admin') {
    adminSecretCodeField.style.display = 'block';
  } else {
    adminSecretCodeField.style.display = 'none';
  }
});