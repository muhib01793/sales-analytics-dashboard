/**
 * Deterministic mock data generator.
 * Uses a seeded PRNG (mulberry32) so the same 5,000 orders are produced on every load.
 */

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];

export const CATEGORIES = [
  { name: 'Electronics', basePrice: 320, costRatio: 0.72 },
  { name: 'Furniture', basePrice: 210, costRatio: 0.6 },
  { name: 'Apparel', basePrice: 58, costRatio: 0.45 },
  { name: 'Home & Kitchen', basePrice: 85, costRatio: 0.55 },
  { name: 'Sports', basePrice: 120, costRatio: 0.5 },
];

// Repeated entries weight the distribution (roughly 57% completed).
export const STATUSES = [
  'Completed',
  'Completed',
  'Completed',
  'Completed',
  'Pending',
  'Cancelled',
  'Returned',
];

const FIRST_NAMES = [
  'Ava', 'Liam', 'Noah', 'Mia', 'Ethan', 'Sofia', 'Lucas', 'Amelia', 'Mason', 'Zara',
  'Omar', 'Aisha', 'Ravi', 'Chen', 'Elena', 'Diego', 'Priya', 'Kenji', 'Fatima', 'Hugo',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Garcia', 'Khan', 'Patel', 'Nguyen', 'Brown', 'Rossi',
  'Kim', 'Silva', 'Novak', 'Haddad', 'Okafor', 'Muller', 'Lopez',
];

const START_DATE_UTC = Date.UTC(2024, 0, 1);
const DAY_SPAN = 730; // Jan 1 2024 through Dec 31 2025
const MS_PER_DAY = 86400000;
const CUSTOMER_COUNT = 400;

export function createRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round2 = (value) => Math.round(value * 100) / 100;

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function customerNameFor(customerId) {
  const first = FIRST_NAMES[customerId % FIRST_NAMES.length];
  const last = LAST_NAMES[Math.floor(customerId / FIRST_NAMES.length) % LAST_NAMES.length];
  return `${first} ${last}`;
}

/**
 * Generates `count` orders sorted by date ascending.
 * @param {number} count
 * @param {number} seed
 * @returns {Array<object>}
 */
export function generateOrders(count = 5000, seed = 20240101) {
  const rng = createRng(seed);

  // Draw day offsets first, then sort, so IDs and dates line up chronologically.
  const dayOffsets = Array.from({ length: count }, () => Math.floor(rng() * DAY_SPAN)).sort(
    (a, b) => a - b
  );

  return dayOffsets.map((dayOffset, index) => {
    const category = pick(CATEGORIES, rng);
    const quantity = 1 + Math.floor(rng() * 5);
    const unitPrice = round2(category.basePrice * (0.7 + rng() * 0.6));
    const grossAmount = quantity * unitPrice;
    const discount = rng() < 0.25 ? round2(grossAmount * 0.1) : 0;
    const revenue = round2(grossAmount - discount);
    const cost = round2(revenue * category.costRatio * (0.9 + rng() * 0.2));
    const profit = round2(revenue - cost);
    const customerId = 1 + Math.floor(rng() * CUSTOMER_COUNT);
    const date = new Date(START_DATE_UTC + dayOffset * MS_PER_DAY).toISOString().slice(0, 10);

    return {
      id: `ORD-${String(index + 1).padStart(5, '0')}`,
      date,
      customerId,
      customerName: customerNameFor(customerId),
      region: pick(REGIONS, rng),
      category: category.name,
      status: pick(STATUSES, rng),
      quantity,
      unitPrice,
      discount,
      revenue,
      cost,
      profit,
    };
  });
}
