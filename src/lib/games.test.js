import { describe, expect, it } from 'vitest';
import { GAMES, GAME_BY_ID, STATE_WORD, calc, clampValue, fmt, plural, toDigits, verdict } from './games.js';
import { parseRoute } from './route.js';

const game = (id) => GAME_BY_ID[id];

describe('game definitions', () => {
  it('has six unique calculators with ascending pity marks', () => {
    expect(GAMES).toHaveLength(6);
    expect(new Set(GAMES.map((entry) => entry.id)).size).toBe(6);

    for (const entry of GAMES) {
      expect(entry.fields.length).toBeGreaterThan(1);
      const marks = entry.marks.map((mark) => mark.at);
      expect([...marks].sort((a, b) => a - b)).toEqual(marks);
      expect(entry.cost.per).toBeGreaterThan(0);
    }
  });

  it('keeps each currency layout distinct', () => {
    const shapes = GAMES.map((entry) => entry.fields.map((field) => field.k).join('|'));
    expect(new Set(shapes).size).toBe(6);
  });
});

describe('calc', () => {
  it('adds tickets to currency pulls for Granblue', () => {
    const result = calc(game('gbf'), { crystals: 3000, single: 1, ten: 2 });
    expect(result.fromPool).toBe(10);
    expect(result.tickets).toBe(21);
    expect(result.pulls).toBe(31);
    expect(result.short).toBe(269);
    expect(result.shortCurrency).toBe(80700);
    expect(result.state).toBe('building');
  });

  it('rounds down partial currency and keeps standard passes out of limited warps', () => {
    const result = calc(game('hsr'), { jade: 159, shard: 1, special: 0, pass: 50 });
    expect(result.pulls).toBe(1);
    expect(result.side).toEqual([{ label: 'standard warps', n: 50 }]);
  });

  it('counts Lunite into the Wuwa pool and reaches the guarantee at 160', () => {
    const result = calc(game('wuwa'), { astrite: 0, lune: 0, radiant: 160, lustrous: 20, forging: 5 });
    expect(result.pulls).toBe(160);
    expect(result.state).toBe('ready');
    expect(result.hard).toBe(2);
    expect(result.guaranteed).toBe(1);
    expect(result.ratio).toBe(1);
  });

  it('reports hard pity coverage between the two pity marks', () => {
    const result = calc(game('zzz'), { poly: 0, mono: 0, enc: 100 });
    expect(result.pulls).toBe(100);
    expect(result.state).toBe('pity');
    expect(result.short).toBe(80);
    expect(result.next.label).toBe('Guarantee');
  });

  it('flags a single-target calculator as close near the spark', () => {
    const result = calc(game('gbf'), { crystals: 84000, single: 0, ten: 0 });
    expect(result.pulls).toBe(280);
    expect(result.state).toBe('close');
    expect(result.short).toBe(20);
  });

  it('flags a early five-star attempt as close to hard pity', () => {
    const result = calc(game('hsr'), { jade: 13440, special: 0 });
    expect(result.pulls).toBe(84);
    expect(result.state).toBe('close');
    expect(result.next.label).toBe('Hard pity');
  });

  it('reports empty totals without a next mark', () => {
    const result = calc(game('ba'), {});
    expect(result.pulls).toBe(0);
    expect(result.state).toBe('empty');
    expect(result.next.at).toBe(200);
    expect(result.shortCurrency).toBe(24000);
  });

  it('caps progress at the final mark while keeping the raw total', () => {
    const result = calc(game('nikke'), { gems: 63000, adv: 10, vou: 0 });
    expect(result.pulls).toBe(220);
    expect(result.ratio).toBe(1);
    expect(result.state).toBe('ready');
    expect(result.pulls - result.max).toBe(20);
  });
});

describe('verdict', () => {
  it('leaves the state line empty and states the need as a distance', () => {
    const copy = verdict(game('gbf'), calc(game('gbf'), {}));
    expect(copy.title).toBe('');
    expect(copy.sub).toBe('90,000 Crystals to spark');
  });

  it('names the leftover once a two-step pity banner is covered', () => {
    const copy = verdict(game('wuwa'), calc(game('wuwa'), { astrite: 28800 }));
    expect(copy.title).toBe('Guarantee covered');
    expect(copy.sub).toBe('3,200 Astrite after guarantee');
  });

  it('counts tickets toward the leftover of a single-target banner', () => {
    const copy = verdict(game('ba'), calc(game('ba'), { pyro: 24000, single: 5 }));
    expect(copy.title).toBe('Spark ready');
    expect(copy.sub).toBe('600 Pyroxenes after spark');
  });

  it('puts each mark still ahead on its own line', () => {
    const copy = verdict(game('hsr'), calc(game('hsr'), { jade: 13440 }));
    expect(copy.title).toBe('6 warps from hard pity');
    expect(copy.sub).toBe('960 Stellar Jade to hard pity\n15,360 to guarantee');
  });

  it('keeps the same shape while building', () => {
    const copy = verdict(game('gbf'), calc(game('gbf'), { crystals: 30000 }));
    expect(copy.title).toBe('33% to spark');
    expect(copy.sub).toBe('60,000 Crystals to spark');
  });

  it('drops the marks already met', () => {
    const copy = verdict(game('zzz'), calc(game('zzz'), { poly: 16000 }));
    expect(copy.title).toBe('Hard pity covered');
    expect(copy.sub).toBe('12,800 Polychromes to guarantee');
  });
});

describe('formatting helpers', () => {
  it('formats totals with en-US separators', () => {
    expect(fmt(46200)).toBe('46,200');
  });

  it('pluralizes the game unit', () => {
    expect(plural(game('zzz'), 1)).toBe('search');
    expect(plural(game('zzz'), 2)).toBe('searches');
  });

  it('strips non-digits and caps inputs at seven characters', () => {
    expect(toDigits('12,345abc')).toBe('12345');
    expect(toDigits('123456789')).toBe('1234567');
    expect(toDigits('')).toBe('');
  });

  it('clamps values to a non-negative integer', () => {
    expect(clampValue('-5')).toBe(0);
    expect(clampValue('12.9')).toBe(12);
    expect(clampValue('99999999')).toBe(9999999);
  });

  it('exposes a word for every state', () => {
    expect(Object.keys(STATE_WORD)).toEqual(['empty', 'building', 'close', 'pity', 'ready']);
  });
});

describe('parseRoute', () => {
  it('accepts hash and slash forms', () => {
    expect(parseRoute('#gbf')).toBe('gbf');
    expect(parseRoute('#/gbf')).toBe('gbf');
    expect(parseRoute('#/')).toBe('home');
    expect(parseRoute('')).toBe('home');
  });

  it('falls back to home for unknown games', () => {
    expect(parseRoute('#genshin')).toBe('home');
  });
});
