import gbfArt from '../assets/gbf/art.webp';
import gbfArtDark from '../assets/gbf/art-dark.webp';
import gbfCrystal from '../assets/gbf/currency-crystal.jpg';
import gbfLogo from '../assets/gbf/logo-simple.webp';

import baArt from '../assets/ba/art.webp';
import baPyro from '../assets/ba/currency-pyroxene.png';
import baLogo from '../assets/ba/logo-display.webp';

import hsrArt from '../assets/hsr/art.webp';
import hsrArtDark from '../assets/hsr/art-dark.webp';
import hsrJade from '../assets/hsr/currency-stellar-jade.png';
import hsrShard from '../assets/hsr/currency-oneiric-shard.png';
import hsrSpecial from '../assets/hsr/currency-special-pass.png';
import hsrPass from '../assets/hsr/currency-pass.png';
import hsrLogo from '../assets/hsr/logo-display.webp';

import nikkeArt from '../assets/nikke/art.webp';
import nikkeGem from '../assets/nikke/currency-gem.png';
import nikkeAdv from '../assets/nikke/currency-advanced-voucher.png';
import nikkeVou from '../assets/nikke/currency-voucher.png';
import nikkeLogo from '../assets/nikke/logo-display.webp';

import zzzArt from '../assets/zzz/art.webp';
import zzzArtDark from '../assets/zzz/art-dark.webp';
import zzzPoly from '../assets/zzz/currency-poly.png';
import zzzMono from '../assets/zzz/currency-mono.png';
import zzzEnc from '../assets/zzz/currency-encrypted-tape.png';
import zzzMaster from '../assets/zzz/currency-master-tape.png';
import zzzLogo from '../assets/zzz/logo-display.webp';

import wuwaAstrite from '../assets/wuwa/currency-astrite.svg';
import wuwaLustrous from '../assets/wuwa/currency-lustrous-tide.svg';
import wuwaForging from '../assets/wuwa/currency-forging-tide.svg';
import wuwaRadiant from '../assets/wuwa/currency-radiant-tide.svg';
import wuwaLogo from '../assets/wuwa/logo-dark.svg';
import wuwaMark from '../assets/wuwa/logo-icon.svg';

/**
 * Art carries each game's identity. `baked` marks key art that already
 * includes the game's wordmark, so the layout does not stack a second logo.
 */
const BA_ART = { src: baArt, pos: '70% 45%', posMobile: '68% 45%', baked: true };
const NIKKE_ART = {
  src: nikkeArt,
  pos: '52% 25%',
  posMobile: '52% 25%',
  tilePos: '52% 0%',
  tilePosMobile: '52% 0%',
  baked: false,
};
const NO_ART = { src: null, pos: '50% 50%', posMobile: '50% 50%', baked: false };

export const GAME_ART = {
  gbf: {
    light: { src: gbfArt, pos: '70% 35%', posMobile: '78% 35%', baked: false },
    dark: { src: gbfArtDark, pos: '22% 25%', posMobile: '24% 30%', baked: false },
  },
  ba: { light: BA_ART, dark: BA_ART },
  hsr: {
    light: {
      src: hsrArt,
      pos: '80% 35%',
      posMobile: '82% 30%',
      tilePos: '60% 0%',
      tilePosMobile: '60% 0%',
      baked: false,
    },
    dark: { src: hsrArtDark, pos: '55% 40%', posMobile: '45% 40%', baked: false },
  },
  nikke: { light: NIKKE_ART, dark: NIKKE_ART },
  zzz: {
    light: { src: zzzArt, pos: '50% 22%', posMobile: '46% 20%', baked: false },
    dark: {
      src: zzzArtDark,
      pos: '55% 35%',
      posMobile: '50% 38%',
      tilePos: '55% 0%',
      tilePosMobile: '50% 0%',
      baked: false,
    },
  },
  wuwa: { light: NO_ART, dark: NO_ART },
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

export const WUWA_MARK = wuwaMark;

export const CURRENCY = {
  'gbf.crystal': gbfCrystal,
  'ba.pyro': baPyro,
  'hsr.jade': hsrJade,
  'hsr.shard': hsrShard,
  'hsr.special': hsrSpecial,
  'hsr.pass': hsrPass,
  'zzz.poly': zzzPoly,
  'zzz.mono': zzzMono,
  'zzz.enc': zzzEnc,
  'zzz.master': zzzMaster,
  'nikke.gem': nikkeGem,
  'nikke.adv': nikkeAdv,
  'nikke.vou': nikkeVou,
  'wuwa.astrite': wuwaAstrite,
  'wuwa.radiant': wuwaRadiant,
  'wuwa.lustrous': wuwaLustrous,
  'wuwa.forging': wuwaForging,
};
