import { describe, expect, it } from 'vitest';
import { GAME_BY_ID, calc } from './games.js';
import {
  STORAGE_KEY,
  THEME_KEY,
  defaultValues,
  loadTheme,
  loadValues,
  saveTheme,
  saveValues,
} from './storage.js';

class MemoryStorage {
  constructor(initial = {}) {
    this.map = new Map(Object.entries(initial));
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  setItem(key, value) {
    this.map.set(key, String(value));
  }

  removeItem(key) {
    this.map.delete(key);
  }
}

class BrokenStorage {
  getItem() {
    throw new Error('blocked');
  }

  setItem() {
    throw new Error('blocked');
  }

  removeItem() {
    throw new Error('blocked');
  }
}

describe('loadValues', () => {
  it('migrates the React build flat keys into one versioned payload', () => {
    const storage = new MemoryStorage({
      gbf_crystals: '900',
      gbf_single_tickets: '2',
      gbf_ten_tickets: '1',
      wuwa_lunites: '160',
      nikke_gems: '300',
    });

    const values = loadValues(storage);

    expect(values.gbf).toEqual({ crystals: 900, single: 2, ten: 1 });
    expect(values.wuwa.lune).toBe(160);
    expect(values.nikke.gems).toBe(300);
    expect(calc(GAME_BY_ID.gbf, values.gbf).pulls).toBe(15);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)).values.gbf.crystals).toBe(900);
  });

  it('prefers the current payload over legacy keys', () => {
    const storage = new MemoryStorage({
      [STORAGE_KEY]: JSON.stringify({ version: 2, values: { gbf: { crystals: 6000 } } }),
      gbf_crystals: '300',
    });

    expect(loadValues(storage).gbf.crystals).toBe(6000);
  });

  it('normalizes invalid and unknown stored values', () => {
    const storage = new MemoryStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: 2,
        values: { gbf: { crystals: '-4', single: '2.9', ten: null, extra: 10 } },
      }),
    });

    expect(loadValues(storage).gbf).toEqual({ crystals: 0, single: 2, ten: 0 });
  });

  it('recovers from corrupt JSON without throwing', () => {
    const storage = new MemoryStorage({ [STORAGE_KEY]: '{not json' });
    expect(loadValues(storage)).toEqual(defaultValues());
  });

  it('survives storage that throws on every call', () => {
    expect(() => loadValues(new BrokenStorage())).not.toThrow();
    expect(loadValues(new BrokenStorage())).toEqual(defaultValues());
  });
});

describe('saveValues', () => {
  it('round-trips a saved payload', () => {
    const storage = new MemoryStorage();
    const values = defaultValues();
    values.ba.pyro = 2400;

    saveValues(values, storage);

    expect(loadValues(storage).ba.pyro).toBe(2400);
  });
});

describe('theme persistence', () => {
  it('stores and reads an explicit preference', () => {
    const storage = new MemoryStorage();
    saveTheme('dark', storage);
    expect(storage.getItem(THEME_KEY)).toBe('dark');
    expect(loadTheme(storage)).toBe('dark');
  });

  it('clears the preference when no explicit choice exists', () => {
    const storage = new MemoryStorage({ [THEME_KEY]: 'light' });
    saveTheme(null, storage);
    expect(loadTheme(storage)).toBeNull();
  });

  it('ignores malformed preferences', () => {
    const storage = new MemoryStorage({ [THEME_KEY]: 'sepia' });
    expect(loadTheme(storage)).toBeNull();
  });
});
