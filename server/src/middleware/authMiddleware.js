const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: req.t('auth.unauthorized') });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash -otp -otpExpiry');
    if (!req.user) return res.status(401).json({ message: req.t('auth.unauthorized') });
    next();
  } catch {
    res.status(401).json({ message: req.t('auth.tokenInvalid') });
  }
};

module.exports = authMiddleware;
