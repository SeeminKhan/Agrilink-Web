const { parseIntent } = require('../services/voiceService');

// POST /voice/intent
const voiceIntent = (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'text is required' });
  const intent = parseIntent(text);
  res.json(intent);
};

module.exports = { voiceIntent };
