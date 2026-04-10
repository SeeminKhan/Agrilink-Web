const Produce = require('../models/Produce');
const { predictPrice } = require('../services/priceService');
const { generateQr } = require('../services/qrService');

// POST /produce
const createProduce = async (req, res, next) => {
  try {
    const { cropName, quantity, grade, harvestDate, location, coordinates, priceManual, season } = req.body;
    const imageUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const priceSuggested = await predictPrice({
      crop: cropName, quantity, location, season,
    });

    const produce = await Produce.create({
      farmerId: req.user._id,
      cropName, quantity, grade, harvestDate, location, coordinates,
      priceSuggested, priceManual, imageUrls,
    });

    produce.qrCodeUrl = await generateQr(produce._id.toString());
    await produce.save();

    res.status(201).json(produce);
  } catch (err) { next(err); }
};

// GET /produce  (marketplace — available only)
const getAllProduce = async (req, res, next) => {
  try {
    const items = await Produce.find({ status: 'available' })
      .populate('farmerId', 'name location avatar')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

// GET /produce/my
const getMyProduce = async (req, res, next) => {
  try {
    const items = await Produce.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

// GET /produce/offline-cache
const getOfflineCache = async (req, res, next) => {
  try {
    const items = await Produce.find({ status: 'available' })
      .select('cropName quantity grade location priceSuggested priceManual imageUrls')
      .limit(100)
      .lean();
    res.json(items);
  } catch (err) { next(err); }
};

// GET /produce/:id
const getProduceById = async (req, res, next) => {
  try {
    const item = await Produce.findById(req.params.id).populate('farmerId', 'name location phone avatar');
    if (!item) return res.status(404).json({ message: req.t('produce.notFound') });
    res.json(item);
  } catch (err) { next(err); }
};

// PUT /produce/:id
const updateProduce = async (req, res, next) => {
  try {
    const item = await Produce.findOne({ _id: req.params.id, farmerId: req.user._id });
    if (!item) return res.status(404).json({ message: req.t('produce.notFound') });
    Object.assign(item, req.body);
    if (req.files?.length) item.imageUrls = req.files.map((f) => `/uploads/${f.filename}`);
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

// DELETE /produce/:id
const deleteProduce = async (req, res, next) => {
  try {
    const item = await Produce.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    if (!item) return res.status(404).json({ message: req.t('produce.notFound') });
    res.json({ message: req.t('produce.deleted') });
  } catch (err) { next(err); }
};

module.exports = { createProduce, getAllProduce, getMyProduce, getOfflineCache, getProduceById, updateProduce, deleteProduce };
