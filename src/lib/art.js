import gbfCrystal from '../assets/gbf/currency-crystal.jpg';
import gbfTicket from '../assets/gbf/currency-draw-ticket.webp';
import gbfTen from '../assets/gbf/currency-ten-ticket.webp';
import gbfLogo from '../assets/gbf/logo-simple.webp';

import baPyro from '../assets/ba/currency-pyroxene.png';
import baTicket from '../assets/ba/currency-recruit-ticket.webp';
import baTen from '../assets/ba/currency-ten-ticket.webp';
import baLogo from '../assets/ba/logo-display.webp';

import hsrJade from '../assets/hsr/currency-stellar-jade.webp';
import hsrShard from '../assets/hsr/currency-oneiric-shard.png';
import hsrSpecial from '../assets/hsr/currency-special-pass.webp';
import hsrPass from '../assets/hsr/currency-pass.webp';
import hsrLogo from '../assets/hsr/logo-display.webp';

import nikkeGem from '../assets/nikke/currency-gem.webp';
import nikkeMileage from '../assets/nikke/currency-gold-mileage.webp';
import nikkeAdv from '../assets/nikke/currency-advanced-voucher.webp';
import nikkeVou from '../assets/nikke/currency-voucher.webp';
import nikkeLogo from '../assets/nikke/logo-display.webp';

import zzzPoly from '../assets/zzz/currency-poly.png';
import zzzMono from '../assets/zzz/currency-mono.png';
import zzzEnc from '../assets/zzz/currency-encrypted-tape.png';
import zzzMaster from '../assets/zzz/currency-master-tape.png';
import zzzLogo from '../assets/zzz/logo-display.webp';

import wuwaAstrite from '../assets/wuwa/currency-astrite.webp';
import wuwaLunite from '../assets/wuwa/currency-lunite.webp';
import wuwaLustrous from '../assets/wuwa/currency-lustrous-tide.webp';
import wuwaForging from '../assets/wuwa/currency-forging-tide.webp';
import wuwaRadiant from '../assets/wuwa/currency-radiant-tide.webp';
import wuwaLogo from '../assets/wuwa/logo-display.webp';

/**
 * Key art ships as a width ladder beside each plate: `art-640.webp`,
 * `art-960.webp`, `art-1600.webp` (and the same for `art-dark-*`), plus a
 * native-width rung where the master is not 1600 wide. Vite resolves every rung
 * to a URL here so the components can hand the browser a real srcset, instead of
 * one 1600px file that a phone has to download and downscale.
 */
const PLATES = import.meta.glob('../assets/*/art*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

const RUNGS = {};
for (const [path, url] of Object.entries(PLATES)) {
  const match = /\/([a-z]+)\/(art(?:-dark)?)-(\d+)\.webp$/.exec(path);
  if (!match) continue;
  (RUNGS[`${match[1]}/${match[2]}`] ??= []).push([Number(match[3]), url]);
}
for (const rungs of Object.values(RUNGS)) rungs.sort((a, b) => a[0] - b[0]);

/** The ladder for one plate: largest rung as `src`, every rung as `srcSet`. */
function plate(game, variant) {
  const rungs = RUNGS[`${game}/art${variant === 'dark' ? '-dark' : ''}`];
  if (!rungs?.length) throw new Error(`no art ladder for ${game}/${variant}`);
  return {
    src: rungs.at(-1)[1],
    srcSet: rungs.map(([width, url]) => `${url} ${width}w`).join(', '),
  };
}

/**
 * Art carries each game's identity. `baked` marks key art that already
 * includes the game's wordmark, so the layout does not stack a second logo.
 */
const BA_ART = { ...plate('ba', 'light'), pos: '70% 45%', posMobile: '68% 45%', baked: true };
const NIKKE_ART = {
  ...plate('nikke', 'light'),
  pos: '52% 25%',
  posMobile: '52% 25%',
  tilePos: '52% 0%',
  tilePosMobile: '52% 0%',
  baked: false,
};

export const GAME_ART = {
  gbf: {
    light: { ...plate('gbf', 'light'), pos: '70% 35%', posMobile: '78% 35%', baked: false },
    dark: { ...plate('gbf', 'dark'), pos: '22% 25%', posMobile: '24% 30%', baked: false },
  },
  ba: { light: BA_ART, dark: BA_ART },
  hsr: {
    light: {
      ...plate('hsr', 'light'),
      pos: '80% 35%',
      posMobile: '82% 30%',
      tilePos: '60% 0%',
      tilePosMobile: '60% 0%',
      baked: false,
    },
    dark: { ...plate('hsr', 'dark'), pos: '55% 40%', posMobile: '45% 40%', baked: false },
  },
  nikke: { light: NIKKE_ART, dark: NIKKE_ART },
  zzz: {
    light: { ...plate('zzz', 'light'), pos: '50% 22%', posMobile: '46% 20%', baked: false },
    dark: {
      ...plate('zzz', 'dark'),
      pos: '55% 35%',
      posMobile: '50% 38%',
      tilePos: '55% 0%',
      tilePosMobile: '50% 0%',
      baked: false,
    },
  },
  wuwa: {
    light: {
      ...plate('wuwa', 'light'),
      pos: '82% 55%',
      posMobile: '86% 45%',
      tilePos: '80% 40%',
      tilePosMobile: '82% 45%',
      baked: false,
    },
    dark: {
      ...plate('wuwa', 'dark'),
      pos: '58% 35%',
      posMobile: '60% 28%',
      tilePos: '62% 20%',
      tilePosMobile: '62% 20%',
      baked: false,
    },
  },
};

/** Light-on-dark wordmarks, used on dark caption scrims and the banner plate. */
export const GAME_LOGO = {
  gbf: gbfLogo,
  ba: baLogo,
  hsr: hsrLogo,
  nikke: nikkeLogo,
  zzz: zzzLogo,
  wuwa: wuwaLogo,
};

export const CURRENCY = {
  'gbf.crystal': gbfCrystal,
  'gbf.single': gbfTicket,
  'gbf.ten': gbfTen,
  'ba.pyro': baPyro,
  'ba.single': baTicket,
  'ba.ten': baTen,
  'hsr.jade': hsrJade,
  'hsr.shard': hsrShard,
  'hsr.special': hsrSpecial,
  'hsr.pass': hsrPass,
  'zzz.poly': zzzPoly,
  'zzz.mono': zzzMono,
  'zzz.enc': zzzEnc,
  'zzz.master': zzzMaster,
  'nikke.gem': nikkeGem,
  'nikke.mileage': nikkeMileage,
  'nikke.adv': nikkeAdv,
  'nikke.vou': nikkeVou,
  'wuwa.astrite': wuwaAstrite,
  'wuwa.lune': wuwaLunite,
  'wuwa.radiant': wuwaRadiant,
  'wuwa.lustrous': wuwaLustrous,
  'wuwa.forging': wuwaForging,
};
