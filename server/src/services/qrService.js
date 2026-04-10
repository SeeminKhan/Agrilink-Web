const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads/qr');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

/**
 * Generate a QR code PNG for a produce ID and return its public path.
 * @param {string} produceId
 * @returns {Promise<string>} relative URL e.g. /uploads/qr/<id>.png
 */
const generateQr = async (produceId) => {
  const filename = `${produceId}.png`;
  const filePath = path.join(uploadsDir, filename);
  const traceUrl = `${process.env.APP_URL || 'http://localhost:5000'}/api/trace/${produceId}`;
  await QRCode.toFile(filePath, traceUrl, { width: 300 });
  return `/uploads/qr/${filename}`;
};

module.exports = { generateQr };
