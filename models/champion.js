class info {
  /** @type {number} */
  attack;

  /** @type {number} */
  defense;

  /** @type {number} */
  magic;

  /** @type {number} */
  difficulty;
}

class Image {
  /** @type {string} */
  full;

  /** @type {string} */
  sprite;

  /** @type {number} */
  group;

  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  w;

  /** @type {number} */
  h;
}

class Stats {
  /** @type {number} */
  hp;

  /** @type {number} */
  hpperlevel;

  /** @type {number} */
  mp;

  /** @type {number} */
  mpperlevel;

  /** @type {number} */
  movespeed;

  /** @type {number} */
  armor;

  /** @type {number} */
  armorperlevel;

  /** @type {number} */
  spellblock;

  /** @type {number} */
  spellblockperlevel;

  /** @type {number} */
  attackrange;

  /** @type {number} */
  hpregen;

  /** @type {number} */
  hpregenperlevel;

  /** @type {number} */
  crit;

  /** @type {number} */
  critperlevel;

  /** @type {number} */
  attackdamage;

  /** @type {number} */
  attackspeedperlevel;

  /** @type {number} */
  attackspeed;
}

class Champion {
  /** @type {string} */
  version;

  /** @type {string} */
  id;

  /** @type {string} */
  key;

  /** @type {string} */
  name;

  /** @type {string} */
  title;

  /** @type {string} */
  blurb;

  /** @type {info} */
  info;

  /** @type {Image} */
  image;

  /** @type {string[]} */
  tags;

  /** @type {string}*/
  partype;

    /** @type {Stats} */
    stats;
}

export default Champion;
