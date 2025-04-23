const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user; // El usuario viene del authMiddleware

    // Verificar si el usuario es admin o el propietario
    if (currentUser.role === 'admin' || currentUser.id === userId) {
      next();
    } else {
      res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = isOwnerOrAdmin; 