const User = require('../models/User');
const { sign } = require('../services/jwtService');

const sanitize = (u) => ({
  _id: u._id, name: u.name, email: u.email, role: u.role,
  phone: u.phone, location: u.location, language: u.language,
  primaryCrop: u.primaryCrop, avatar: u.avatar,
});

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, location, language, primaryCrop } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: req.t('auth.missingFields') });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: req.t('auth.emailTaken') });
    }
    const user = await User.create({
      name, email, passwordHash: password, role, phone, location, language, primaryCrop,
    });
    const token = sign({ id: user._id, role: user.role });
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) { next(err); }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: req.t('auth.missingFields') });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: req.t('auth.invalidCredentials') });
    }
    const token = sign({ id: user._id, role: user.role });
    res.json({ token, user: sanitize(user) });
  } catch (err) { next(err); }
};

// GET /auth/me
const getMe = async (req, res) => res.json(sanitize(req.user));

module.exports = { register, login, getMe };
