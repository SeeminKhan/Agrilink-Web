const Produce = require('../models/Produce');
const User = require('../models/User');
const { scoreMatch } = require('../services/matchingService');

// GET /matching/for-buyer/:buyerId
const matchForBuyer = async (req, res, next) => {
  try {
    const buyer = await User.findById(req.params.buyerId).lean();
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    const produces = await Produce.find({ status: 'available' })
      .populate('farmerId', 'name location avatar')
      .lean();

    const scored = produces
      .map((p) => ({ ...p, matchScore: scoreMatch(buyer, p) }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);

    res.json(scored);
  } catch (err) { next(err); }
};

// GET /matching/for-farmer/:farmerId
const matchForFarmer = async (req, res, next) => {
  try {
    const farmer = await User.findById(req.params.farmerId).lean();
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    // Return buyers who have searched for this farmer's primary crop
    // (simplified: return all buyers sorted by proximity)
    const buyers = await User.find({ role: 'buyer' }).lean();
    const produces = await Produce.find({ farmerId: farmer._id, status: 'available' }).lean();

    const scored = buyers.map((b) => ({
      buyer: { _id: b._id, name: b.name, location: b.location, avatar: b.avatar },
      matchScore: produces.reduce((best, p) => Math.max(best, scoreMatch(b, p)), 0),
    })).sort((a, b) => b.matchScore - a.matchScore).slice(0, 20);

    res.json(scored);
  } catch (err) { next(err); }
};

module.exports = { matchForBuyer, matchForFarmer };
