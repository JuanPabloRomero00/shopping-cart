const authService = require('../services/auth.service');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const registerHandler = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
  const { user, accessToken, refreshToken } = await authService.registerUser({ name, email, password, role });
  res.status(201).json({ success: true, user, token: accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const { email, password, role, secretCode } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser({ email, password, role, secretCode });
  res.status(200).json({ success: true, user, token: accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new Error('Refresh token es requerido');
    }
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(refreshToken);
  res.status(200).json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

const createAdminHandler = async (req, res, next) => {
  try {
    const { name, email, password, secretCode } = req.body;
    const { admin } = await authService.createAdmin({ name, email, password, secretCode });
    res.status(201).json({ success: true, admin });
  } catch (error) {
    next(error);
  }
};

const profileHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) throw new Error('No autorizado.');
    const user = await User.findById(userId)
      .select('-password -tokens -refreshToken')
      .populate('role', 'name');
    if (!user) throw new Error('Usuario no encontrado.');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfileHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    // Permite actualizar solo uno o ambos campos
    if (!name && !email) throw new Error('Debes ingresar al menos nombre o email para actualizar.');

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (email) updateFields.email = email.trim().toLowerCase();

    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password -tokens -refreshToken').populate('role', 'name');

    if (!user) throw new Error('Usuario no encontrado.');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const changePasswordHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Validación básica
    if (!currentPassword || !newPassword) throw new Error('Debes ingresar la contraseña actual y la nueva.');

    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado.');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('La contraseña actual es incorrecta.');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  registerHandler, 
  loginHandler, 
  refreshTokenHandler, 
  createAdminHandler,
  profileHandler,
  updateProfileHandler,
  changePasswordHandler 
};