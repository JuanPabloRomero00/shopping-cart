const User = require('../models/user');
const { generateToken } = require('../token');

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();

    // Genero un token con el ID y rol del usuario
    const token = generateToken({ id: savedUser._id, role: savedUser.role });
    return { user: savedUser, token };
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};

const getAllUsers = async () => {
  try {
    // Hacer populate del campo role para obtener el nombre del rol
    const users = await User.find({}).populate('role', 'name').select('-password');
    return users;
  } catch (error) {
    throw new Error('Error al obtener usuarios: ' + error.message);
  }
};

const getUserById = async (userId) => {
  try {
    // También hacer populate aquí para obtener el nombre del rol
    const user = await User.findById(userId).populate('role', 'name').select('-password');
    return user;
  } catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
};