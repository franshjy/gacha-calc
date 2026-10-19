import { GAME_BY_ID, clampValue } from './games.js';
import { emptyValues, loadTheme, loadValues, saveTheme, saveValues } from './storage.js';

/**
 * Single reactive source of truth for saved totals and the theme choice.
 * Persistence is synchronous and guarded inside storage.js.
 */
export const app = $state({
  values: loadValues(),
  theme: loadTheme(),
});

export function valuesFor(gameId) {
  return app.values[gameId];
}

export function setField(gameId, field, raw) {
  const game = GAME_BY_ID[gameId];
  if (!game) return;
  app.values[gameId][field] = clampValue(raw);
  saveValues(app.values);
}

export function clearGame(gameId) {
  const game = GAME_BY_ID[gameId];
  if (!game) return;
  app.values[gameId] = emptyValues(game);
  saveValues(app.values);
}

export function setTheme(theme) {
  app.theme = theme;
  saveTheme(theme);
}
