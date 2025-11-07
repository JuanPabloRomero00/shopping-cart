const usersService = require('../services/users.service');
const { getUserById } = require('../services/users.service');

//Handler creacion de usuario
const createUserHandler = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      throw new Error('Todos los campos son obligatorios');
    }
    const { user, token } = await usersService.createUser({ name, email, password, role });
    res.status(201).json({ success: true, user, token });
  } catch (error) {
    next(error);
  }
};

//Handler obtener todos los usuarios
const getAllUsersHandler = async (req, res, next) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const getUserByIdHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
};

