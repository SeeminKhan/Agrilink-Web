const en = require('../locales/en.json');
const hi = require('../locales/hi.json');
const mr = require('../locales/mr.json');

const locales = { en, hi, mr };

/**
 * Attaches req.t(key) helper for multilingual responses.
 * Reads x-user-language header (en | hi | mr), defaults to en.
 */
const i18nMiddleware = (req, _res, next) => {
  const lang = req.headers['x-user-language'];
  const dict = locales[lang] || locales.en;

  req.t = (key) => {
    const parts = key.split('.');
    let val = dict;
    for (const p of parts) val = val?.[p];
    // fallback to English
    if (!val) {
      let fb = locales.en;
      for (const p of parts) fb = fb?.[p];
      return fb || key;
    }
    return val;
  };

  next();
};

module.exports = i18nMiddleware;
