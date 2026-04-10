/**
 * Usage: roleMiddleware('admin', 'farmer')
 */
const roleMiddleware = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: req.t('auth.forbidden') });
  }
  next();
};

module.exports = roleMiddleware;
