// auth.service.js
const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../token');


// Registro de usuario con validación de rol
const registerUser = async ({ name, email, password, role }) => {
  console.log('Rol recibido:', role);
  const validRoles = ['user', 'seller'];
  const normalizedRole = (role || '').toLowerCase().trim();
  if (!validRoles.includes(normalizedRole)) {
    throw new Error('Rol inválido. Solo se permiten los roles "user" y "seller".');
  }
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('El correo electrónico ya está registrado.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const roleData = await Role.findOne({ name: normalizedRole });
  if (!roleData) {
    throw new Error(`El rol "${role}" no está configurado en el sistema.`);
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: roleData._id,
  });

  const accessToken = generateAccessToken({ _id: user._id, role: roleData._id });
  const refreshToken = generateRefreshToken({ _id: user._id, role: roleData._id });

  user.tokens.push(accessToken);
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

// Login con validación de rol y secretCode para admin
const loginUser = async ({ email, password, role, secretCode }) => {
  if (!email || !password) {
    throw new Error('Todos los campos son obligatorios');
  }

  const user = await User.findOne({ email }).populate('role');
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Validar secretCode para admin
  if (role === 'admin' && secretCode !== process.env.ADMIN_SECRET_CODE) {
    throw new Error('Código secreto inválido');
  }

  // Validar rol si se proporciona
  if (role && user.role.name !== role) {
    throw new Error('Rol especificado no coincide con el usuario');
  }

  const accessToken = generateAccessToken({ _id: user._id, role: user.role._id });
const refreshToken = user.refreshToken || generateRefreshToken({ _id: user._id, role: user.role._id });

  if (!user.refreshToken) {
    user.refreshToken = refreshToken;
    await user.save();
  }

  return {
    user: {
      _id: user._id,
      name: user.name || 'Usuario',
      role: user.role.name
    },
    accessToken,
    refreshToken
  };
};


// Refrescar token de acceso
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token es requerido');
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({ _id: payload._id, role: payload.role });
    const newRefreshToken = generateRefreshToken({ _id: payload._id, role: payload.role });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};


// Crear administrador con código secreto
const createAdmin = async ({ name, email, password, secretCode }) => {
  const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;
  if (secretCode !== ADMIN_SECRET_CODE) {
    throw new Error('Código secreto inválido. No tienes permiso para crear un administrador.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const adminRole = await Role.findOne({ name: 'admin' });
  if (!adminRole) {
    throw new Error('El rol "admin" no está configurado en el sistema.');
  }

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: adminRole._id,
  });

  return { admin };
};

module.exports = { registerUser, loginUser, refreshAccessToken, createAdmin };