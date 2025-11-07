const { verifyToken } = require('../token');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new Error('Acceso no autorizado')); 
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    // Validación mínima de estructura
    if (!decoded || !decoded._id || !decoded.role) {
      return res.status(401).json({ message: 'Token inválido: datos insuficientes' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;