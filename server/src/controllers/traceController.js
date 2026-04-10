const Produce = require('../models/Produce');
const TraceLog = require('../models/TraceLog');

// GET /trace/:produceId
const getTrace = async (req, res, next) => {
  try {
    const produce = await Produce.findById(req.params.produceId)
      .populate('farmerId', 'name location phone avatar');
    if (!produce) return res.status(404).json({ message: req.t('produce.notFound') });

    const logs = await TraceLog.find({ produceId: produce._id })
      .populate('actor', 'name role')
      .sort({ createdAt: 1 });

    res.json({
      farmer: produce.farmerId,
      crop: {
        name: produce.cropName,
        quantity: produce.quantity,
        grade: produce.grade,
        harvestDate: produce.harvestDate,
        location: produce.location,
        images: produce.imageUrls,
        price: produce.priceSuggested || produce.priceManual,
        status: produce.status,
      },
      historyEvents: logs,
    });
  } catch (err) { next(err); }
};

// POST /trace/log
const addTraceLog = async (req, res, next) => {
  try {
    const { produceId, event, note, location } = req.body;
    const log = await TraceLog.create({
      produceId, event, note, location, actor: req.user._id,
    });
    res.status(201).json(log);
  } catch (err) { next(err); }
};

module.exports = { getTrace, addTraceLog };
