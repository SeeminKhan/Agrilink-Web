const Produce = require('../models/Produce');
const { predictPrice } = require('../services/priceService');
const { generateQr } = require('../services/qrService');

// POST /sync/drafts  — bulk upload offline drafts
const syncDrafts = async (req, res, next) => {
  try {
    const drafts = req.body.drafts; // array of produce objects
    if (!Array.isArray(drafts) || drafts.length === 0) {
      return res.status(400).json({ message: 'No drafts provided' });
    }

    const results = await Promise.allSettled(
      drafts.map(async (draft) => {
        const priceSuggested = await predictPrice({
          crop: draft.cropName, quantity: draft.quantity,
          location: draft.location, season: draft.season,
        });
        const produce = await Produce.create({
          ...draft, farmerId: req.user._id, priceSuggested,
        });
        produce.qrCodeUrl = await generateQr(produce._id.toString());
        await produce.save();
        return produce;
      })
    );

    const saved = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
    const failed = results.filter((r) => r.status === 'rejected').length;

    res.status(207).json({ saved: saved.length, failed, items: saved });
  } catch (err) { next(err); }
};

module.exports = { syncDrafts };
