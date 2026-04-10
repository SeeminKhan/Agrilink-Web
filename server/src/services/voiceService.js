/**
 * Rule-based NLP intent parser for voice navigation.
 * Parses natural language strings into structured action objects.
 */

const CROP_KEYWORDS = [
  'tomato', 'tomatoes', 'maize', 'corn', 'avocado', 'potato', 'potatoes',
  'onion', 'onions', 'wheat', 'rice', 'mango', 'mangoes', 'banana', 'bananas',
  'coffee', 'tea', 'sugarcane',
];

const GRADE_PATTERN = /grade\s*([abc])/i;
const QUANTITY_PATTERN = /(\d+(?:\.\d+)?)\s*(kg|quintal|ton|bag|bags|sack|sacks)/i;

const parseIntent = (text = '') => {
  const lower = text.toLowerCase();

  // Detect crop
  const cropName = CROP_KEYWORDS.find((c) => lower.includes(c)) || null;

  // Detect quantity
  const qtyMatch = lower.match(QUANTITY_PATTERN);
  const quantity = qtyMatch ? `${qtyMatch[1]} ${qtyMatch[2]}` : null;

  // Detect grade
  const gradeMatch = lower.match(GRADE_PATTERN);
  const grade = gradeMatch ? gradeMatch[1].toUpperCase() : null;

  // Determine action
  let action = 'unknown';
  if (lower.includes('add') || lower.includes('list') || lower.includes('sell')) action = 'add_listing';
  else if (lower.includes('buy') || lower.includes('find') || lower.includes('search')) action = 'search_produce';
  else if (lower.includes('price') || lower.includes('rate')) action = 'get_price';
  else if (lower.includes('job') || lower.includes('work')) action = 'browse_jobs';
  else if (cropName || quantity) action = 'add_listing'; // infer

  return { action, cropName, quantity, grade, raw: text };
};

module.exports = { parseIntent };
