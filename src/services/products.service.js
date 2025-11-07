const Product = require('../models/product');

exports.createProduct = async (data, user) => {
  const product = new Product({
    ...data,
    createdBy: user._id
  });
  return await product.save();
};

exports.getProducts = async (user) => {
  // Obtener información del rol del usuario
  const Role = require('../models/role');
  let userRole = null;
  
  try {
    userRole = await Role.findById(user.role);
  } catch (error) {
    console.error('Error al obtener rol del usuario:', error);
  }
  
  // Si es admin, devuelve todos los productos
  if (userRole && userRole.name === 'admin') {
    return await Product.find().populate('createdBy', 'name email');
  }
  // Si es seller, devuelve solo los productos creados por él
  return await Product.find({ createdBy: user._id }).populate('createdBy', 'name email');
};

exports.getAllProductsPublic = async () => {
  return await Product.find();
};

exports.getAllProducts = async () => {
  return await Product.find().populate('createdBy', 'name email');
};

exports.deleteProduct = async (productId, userId, userRole) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, message: 'Producto no encontrado.' };
    }

    // Validación de permisos: solo admin o el creador pueden eliminar
    const isAdmin = userRole === 'admin';
    const isOwner = product.createdBy && product.createdBy.toString() === userId;

    if (!isAdmin && !isOwner) {
      return { success: false, message: 'No tienes permiso para eliminar este producto.' };
    }

    await Product.findByIdAndDelete(productId);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return { success: false, message: 'Error interno del servidor.' };
  }
};

exports.updateProduct = async (productId, updateData, userId, userRole) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, message: 'Producto no encontrado.' };
    }

    // Solo el creador o admin puede editar
    const isAdmin = userRole === 'admin';
    const isOwner = product.createdBy && product.createdBy.toString() === userId;

    if (!isAdmin && !isOwner) {
      return { success: false, message: 'No tienes permiso para editar este producto.' };
    }

    Object.assign(product, updateData);
    await product.save();
    return { success: true, product };
  } catch (error) {
    console.error('Error al editar el producto:', error);
    return { success: false, message: 'Error interno del servidor.' };
  }
};
