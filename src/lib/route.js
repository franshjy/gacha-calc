import { GAME_BY_ID } from './games.js';

export const HOME_ROUTE = 'home';

/** Accepts `#gbf`, `#/gbf`, and an empty hash. Unknown routes land on home. */
export function parseRoute(hash) {
  const id = String(hash ?? '')
    .replace(/^#\/?/, '')
    .replace(/\/+$/, '')
    .toLowerCase();

  if (!id || id === HOME_ROUTE) return HOME_ROUTE;
  return GAME_BY_ID[id] ? id : HOME_ROUTE;
}
