/**
 * Game definitions and the shared pull math.
 *
 * Every calculator uses the same interaction model:
 * premium currency in a pool, tickets that add pulls directly, and optional
 * side resources that are tracked but do not count toward limited pulls.
 */
export const GAMES = [
  {
    id: 'gbf',
    name: 'Granblue Fantasy',
    code: 'GBF',
    unit: ['draw', 'draws'],
    star: 'SSR',
    marks: [{ at: 300, label: 'Spark' }],
    cost: { per: 300, label: 'Crystals' },
    fields: [
      { k: 'crystals', label: 'Crystals', icon: 'gbf.crystal', pool: true },
      { k: 'single', label: 'Draw Tickets', tix: 1 },
      { k: 'ten', label: '10-Part Draw Tickets', tix: 10 },
    ],
  },
  {
    id: 'ba',
    name: 'Blue Archive',
    code: 'BA',
    unit: ['recruit', 'recruits'],
    star: '3★',
    marks: [{ at: 200, label: 'Spark' }],
    cost: { per: 120, label: 'Pyroxenes' },
    fields: [
      { k: 'pyro', label: 'Pyroxenes', icon: 'ba.pyro', pool: true },
      { k: 'single', label: 'Recruitment Tickets', tix: 1 },
      { k: 'ten', label: '10× Recruitment Tickets', tix: 10 },
    ],
  },
  {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    code: 'HSR',
    unit: ['warp', 'warps'],
    star: '5★',
    marks: [
      { at: 90, label: 'Hard pity' },
      { at: 180, label: 'Guarantee' },
    ],
    cost: { per: 160, label: 'Stellar Jade' },
    fields: [
      { k: 'jade', label: 'Stellar Jade', icon: 'hsr.jade', pool: true },
      { k: 'shard', label: 'Oneiric Shards', icon: 'hsr.shard', pool: true, hint: '1:1 into Jade' },
      { k: 'special', label: 'Star Rail Special Pass', icon: 'hsr.special', tix: 1 },
      { k: 'pass', label: 'Star Rail Pass', icon: 'hsr.pass', side: 'standard warps' },
    ],
  },
  {
    id: 'zzz',
    name: 'Zenless Zone Zero',
    code: 'ZZZ',
    unit: ['search', 'searches'],
    star: 'S-rank',
    marks: [
      { at: 90, label: 'Hard pity' },
      { at: 180, label: 'Guarantee' },
    ],
    cost: { per: 160, label: 'Polychromes' },
    fields: [
      { k: 'poly', label: 'Polychromes', icon: 'zzz.poly', pool: true },
      { k: 'mono', label: 'Monochrome Film', icon: 'zzz.mono', pool: true, hint: '1:1 into Polychromes' },
      { k: 'enc', label: 'Encrypted Master Tapes', icon: 'zzz.enc', tix: 1 },
      { k: 'master', label: 'Master Tapes', icon: 'zzz.master', side: 'standard searches' },
    ],
  },
  {
    id: 'nikke',
    name: 'Goddess of Victory: Nikke',
    code: 'NIKKE',
    unit: ['recruit', 'recruits'],
    star: 'SSR',
    marks: [{ at: 200, label: 'Gold Mileage' }],
    cost: { per: 300, label: 'Gems' },
    fields: [
      { k: 'gems', label: 'Gems', icon: 'nikke.gem', pool: true },
      { k: 'adv', label: 'Advanced Recruit Vouchers', icon: 'nikke.adv', tix: 1 },
      { k: 'vou', label: 'Standard Recruit Vouchers', icon: 'nikke.vou', side: 'standard recruits' },
    ],
  },
  {
    id: 'wuwa',
    name: 'Wuthering Waves',
    code: 'WUWA',
    unit: ['convene', 'convenes'],
    star: '5★',
    marks: [
      { at: 80, label: 'Hard pity' },
      { at: 160, label: 'Guarantee' },
    ],
    cost: { per: 160, label: 'Astrite' },
    fields: [
      { k: 'astrite', label: 'Astrite', icon: 'wuwa.astrite', pool: true },
      { k: 'lune', label: 'Lunite', pool: true, hint: '1:1 into Astrite' },
      { k: 'radiant', label: 'Radiant Tide', icon: 'wuwa.radiant', tix: 1 },
      { k: 'lustrous', label: 'Lustrous Tide', icon: 'wuwa.lustrous', side: 'standard convenes' },
      { k: 'forging', label: 'Forging Tide', icon: 'wuwa.forging', side: 'weapon convenes' },
    ],
  },
];

export const GAME_BY_ID = Object.fromEntries(GAMES.map((game) => [game.id, game]));

export const STATE_WORD = {
  empty: 'Empty',
  building: 'Building',
  close: 'Close',
  pity: 'Pity covered',
  ready: 'Ready',
};

export const MAX_INPUT = 9999999;

export function toDigits(raw) {
  return String(raw ?? '').replace(/\D/g, '').slice(0, 7);
}

export function clampValue(raw) {
  const n = Math.floor(Number.parseInt(raw, 10) || 0);
  return Math.min(MAX_INPUT, Math.max(0, n));
}

export function fmt(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function plural(game, n) {
  return n === 1 ? game.unit[0] : game.unit[1];
}

/**
 * @param {object} game
 * @param {Record<string, number>} values
 */
export function calc(game, values = {}) {
  let pool = 0;
  let tickets = 0;
  const side = [];

  for (const field of game.fields) {
    const n = Math.max(0, Math.floor(Number(values[field.k]) || 0));
    if (field.pool) pool += n;
    else if (field.tix) tickets += n * field.tix;
    else if (field.side) side.push({ label: field.side, n });
  }

  const fromPool = Math.floor(pool / game.cost.per);
  const pulls = fromPool + tickets;
  const max = game.marks[game.marks.length - 1].at;
  const next = game.marks.find((mark) => pulls < mark.at) || null;
  const short = next ? next.at - pulls : 0;
  const shortCurrency = next ? short * game.cost.per - (pool % game.cost.per) : 0;

  let state;
  if (pulls === 0) state = 'empty';
  else if (pulls >= max) state = 'ready';
  else if (game.marks.length > 1 && pulls >= game.marks[0].at) state = 'pity';
  else if (next && next.at - pulls <= Math.max(10, max * 0.1)) state = 'close';
  else state = 'building';

  const hard = game.marks.length > 1 ? Math.floor(pulls / game.marks[0].at) : 0;
  const guaranteed = Math.floor(pulls / max);

  return {
    pool,
    fromPool,
    tickets,
    pulls,
    side,
    max,
    next,
    short,
    shortCurrency,
    state,
    hard,
    guaranteed,
    ratio: Math.min(1, pulls / max),
  };
}

export function verdict(game, result) {
  const unit = (n) => plural(game, n);
  const last = game.marks[game.marks.length - 1];
  const pityBanner = game.marks.length > 1;

  if (result.state === 'empty') {
    return {
      title: '',
      sub: `${fmt(last.at * game.cost.per)} ${game.cost.label} covers the ${last.label.toLowerCase()}.`,
    };
  }

  if (result.state === 'ready') {
    const spare = result.pulls - last.at;
    if (pityBanner) {
      return {
        title: 'Guarantee covered',
        sub:
          `The limited ${game.star} is certain even if you lose the 50/50.` +
          (spare ? ` ${fmt(spare)} ${unit(spare)} spare.` : ''),
      };
    }
    return {
      title: `${last.label} ready`,
      sub: spare ? `${fmt(spare)} ${unit(spare)} left after the exchange.` : 'Exactly enough for the exchange.',
    };
  }

  if (result.state === 'pity') {
    return {
      title: 'Hard pity covered',
      sub: `One ${game.star} is certain; the limited one is a 50/50. ${fmt(result.short)} ${unit(result.short)} to the guarantee.`,
    };
  }

  if (result.state === 'close') {
    return {
      title: `${fmt(result.short)} ${unit(result.short)} from ${result.next.label.toLowerCase()}`,
      sub: `${fmt(result.shortCurrency)} more ${game.cost.label} closes it.`,
    };
  }

  return {
    title: `${Math.floor((result.pulls / result.next.at) * 100)}% to ${result.next.label.toLowerCase()}`,
    sub: `${fmt(result.shortCurrency)} ${game.cost.label}`,
  };
}
