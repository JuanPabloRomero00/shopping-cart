const ProductService = require('../services/products.service');


// Crear producto
exports.createProductHandler = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body, req.user);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Obtener productos
exports.getProductsHandler = async (req, res, next) => {
  try {
    // Si el usuario está autenticado, filtra según rol
    if (req.user) {
      const products = await ProductService.getProducts(req.user);
      res.json({ success: true, products });
    } else {
      // Si no está autenticado, devuelve todos
      const products = await ProductService.getProducts({ role: 'admin' });
      res.json({ success: true, products });
    }
  } catch (err) {
    next(err);
  }
};

// Eliminar producto
exports.deleteProductHandler = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id || req.user._id; 
    const userRole = req.user.role;

    const result = await ProductService.deleteProduct(productId, userId, userRole);

    if (result.success) {
      return res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } else {
      return res.status(403).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar producto
exports.updateProductHandler = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;
    const updateData = req.body;

    const result = await ProductService.updateProduct(productId, updateData, userId, userRole);

    if (result.success) {
      return res.status(200).json({ success: true, product: result.product });
    } else {
      return res.status(403).json({ success: false, message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

// Obtener todos los productos públicos
exports.getAllProductsPublicHandler = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProductsPublic();
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

// Obtener todos los productos para admin
exports.getAllProductsHandler = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};
