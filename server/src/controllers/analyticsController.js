const Produce = require('../models/Produce');

// GET /analytics/price-trends
const priceTrends = async (req, res, next) => {
  try {
    const data = await Produce.aggregate([
      { $match: { status: 'available' } },
      {
        $group: {
          _id: {
            crop: '$cropName',
            week: { $isoWeek: '$createdAt' },
            year: { $isoWeekYear: '$createdAt' },
          },
          avgPrice: { $avg: '$priceSuggested' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);
    res.json(data);
  } catch (err) { next(err); }
};

// GET /analytics/crop-demand
const cropDemand = async (req, res, next) => {
  try {
    const data = await Produce.aggregate([
      {
        $group: {
          _id: '$cropName',
          totalQuantity: { $sum: '$quantity' },
          listingCount: { $sum: 1 },
          avgPrice: { $avg: '$priceSuggested' },
          avgDemand: { $avg: '$demandScore' },
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);
    res.json(data);
  } catch (err) { next(err); }
};

// GET /analytics/heatmap
const heatmap = async (req, res, next) => {
  try {
    const data = await Produce.aggregate([
      { $match: { 'coordinates.lat': { $exists: true } } },
      {
        $group: {
          _id: '$location',
          lat: { $first: '$coordinates.lat' },
          lng: { $first: '$coordinates.lng' },
          count: { $sum: 1 },
          avgPrice: { $avg: '$priceSuggested' },
        },
      },
    ]);
    res.json(data);
  } catch (err) { next(err); }
};

// GET /analytics/income/:farmerId
const farmerIncome = async (req, res, next) => {
  try {
    const data = await Produce.aggregate([
      { $match: { farmerId: require('mongoose').Types.ObjectId.createFromHexString(req.params.farmerId) } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          totalRevenue: { $sum: { $multiply: ['$quantity', { $ifNull: ['$priceSuggested', '$priceManual'] }] } },
          listings: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(data);
  } catch (err) { next(err); }
};

module.exports = { priceTrends, cropDemand, heatmap, farmerIncome };
