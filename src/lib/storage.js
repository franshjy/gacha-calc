import { GAMES } from './games.js';

export const STORAGE_KEY = 'gacha-calc:values:v2';
export const THEME_KEY = 'theme';
export const STORAGE_VERSION = 2;

/**
 * Field-by-field map from the React/CRA build's flat localStorage keys.
 * Values are moved once, on first load of the Svelte build.
 */
const LEGACY_KEYS = {
  gbf: { crystals: 'gbf_crystals', single: 'gbf_single_tickets', ten: 'gbf_ten_tickets' },
  ba: { pyro: 'ba_pyroxenes', single: 'ba_single_tickets', ten: 'ba_ten_tickets' },
  hsr: {
    jade: 'hsr_stellar_jades',
    shard: 'hsr_oneiric_shards',
    special: 'hsr_special_passes',
    pass: 'hsr_single_tickets',
  },
  zzz: {
    poly: 'zzz_polychromes',
    mono: 'zzz_monochromes',
    enc: 'zzz_encrypted_tapes',
    master: 'zzz_master_tapes',
  },
  nikke: { gems: 'nikke_gems', adv: 'nikke_advanced_vouchers', vou: 'nikke_vouchers' },
  wuwa: {
    astrite: 'wuwa_astrites',
    lune: 'wuwa_lunites',
    radiant: 'wuwa_radiant_tides',
    lustrous: 'wuwa_lustrous_tides',
    forging: 'wuwa_forging_tides',
  },
};

function resolveStorage(storage) {
  if (storage) return storage;
  try {
    return globalThis.localStorage ?? null;
  } catch (error) {
    return null;
  }
}

function read(storage, key) {
  const target = resolveStorage(storage);
  if (!target) return null;
  try {
    return target.getItem(key);
  } catch (error) {
    return null;
  }
}

function write(storage, key, value) {
  const target = resolveStorage(storage);
  if (!target) return;
  try {
    target.setItem(key, value);
  } catch (error) {
    /* private mode / quota: keep the session usable without persistence */
  }
}

function remove(storage, key) {
  const target = resolveStorage(storage);
  if (!target) return;
  try {
    target.removeItem(key);
  } catch (error) {
    /* ignore */
  }
}

function toValue(raw) {
  const n = Math.floor(Number.parseInt(raw, 10) || 0);
  return Math.min(9999999, Math.max(0, n));
}

export function emptyValues(game) {
  return Object.fromEntries(game.fields.map((field) => [field.k, 0]));
}

export function defaultValues(games = GAMES) {
  return Object.fromEntries(games.map((game) => [game.id, emptyValues(game)]));
}

export function normalizeValues(game, input) {
  const values = emptyValues(game);
  if (input && typeof input === 'object') {
    for (const field of game.fields) values[field.k] = toValue(input[field.k]);
  }
  return values;
}

function migrateLegacy(storage) {
  const values = defaultValues();
  let found = false;

  for (const game of GAMES) {
    const legacy = LEGACY_KEYS[game.id] ?? {};
    for (const [field, key] of Object.entries(legacy)) {
      const raw = read(storage, key);
      if (raw !== null) {
        values[game.id][field] = toValue(raw);
        found = true;
      }
    }
  }

  return found ? values : null;
}

export function loadValues(storage) {
  const raw = read(storage, STORAGE_KEY);

  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.values && typeof parsed.values === 'object') {
        return Object.fromEntries(GAMES.map((game) => [game.id, normalizeValues(game, parsed.values[game.id])]));
      }
    } catch (error) {
      /* corrupt payload: fall through to migration/defaults */
    }
  }

  const migrated = migrateLegacy(storage);
  if (migrated) {
    saveValues(migrated, storage);
    return migrated;
  }

  return defaultValues();
}

export function saveValues(values, storage) {
  write(storage, STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, values }));
}

export function loadTheme(storage) {
  const theme = read(storage, THEME_KEY);
  return theme === 'light' || theme === 'dark' ? theme : null;
}

export function saveTheme(theme, storage) {
  if (theme === 'light' || theme === 'dark') write(storage, THEME_KEY, theme);
  else remove(storage, THEME_KEY);
}
