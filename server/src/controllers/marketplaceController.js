const Produce = require('../models/Produce');
const TraceLog = require('../models/TraceLog');
const { scoreMatch } = require('../services/matchingService');

// GET /marketplace
const getMarketplace = async (req, res, next) => {
  try {
    const items = await Produce.find({ status: 'available' })
      .populate('farmerId', 'name location avatar')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

// POST /marketplace/filter
const filterMarketplace = async (req, res, next) => {
  try {
    const { cropType, minPrice, maxPrice, minQuantity, harvestAfter, harvestBefore } = req.body;
    const query = { status: 'available' };

    if (cropType) query.cropName = { $regex: cropType, $options: 'i' };
    if (minQuantity) query.quantity = { $gte: Number(minQuantity) };
    if (minPrice || maxPrice) {
      query.priceSuggested = {};
      if (minPrice) query.priceSuggested.$gte = Number(minPrice);
      if (maxPrice) query.priceSuggested.$lte = Number(maxPrice);
    }
    if (harvestAfter || harvestBefore) {
      query.harvestDate = {};
      if (harvestAfter) query.harvestDate.$gte = new Date(harvestAfter);
      if (harvestBefore) query.harvestDate.$lte = new Date(harvestBefore);
    }

    let items = await Produce.find(query)
      .populate('farmerId', 'name location avatar coordinates')
      .lean();

    // AI-like sorting by match score if buyer coords provided
    if (req.body.lat && req.body.lng) {
      const buyer = { coordinates: { lat: req.body.lat, lng: req.body.lng } };
      items = items
        .map((p) => ({ ...p, _score: scoreMatch(buyer, p) }))
        .sort((a, b) => b._score - a._score);
    }

    res.json(items);
  } catch (err) { next(err); }
};

// GET /marketplace/qr/:produceId
const getQrTrace = async (req, res, next) => {
  try {
    const produce = await Produce.findById(req.params.produceId)
      .populate('farmerId', 'name location phone avatar');
    if (!produce) return res.status(404).json({ message: req.t('produce.notFound') });
    const logs = await TraceLog.find({ produceId: produce._id })
      .populate('actor', 'name role')
      .sort({ createdAt: 1 });
    res.json({ produce, traceLogs: logs });
  } catch (err) { next(err); }
};

module.exports = { getMarketplace, filterMarketplace, getQrTrace };
