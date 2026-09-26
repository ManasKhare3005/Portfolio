// Low-precision astronomy: good to a fraction of a degree, plenty for a sky you look at.
const RAD = Math.PI / 180;
const norm360 = (a) => ((a % 360) + 360) % 360;

export function daysSinceJ2000(date = new Date()) {
  return date.getTime() / 86400000 + 2440587.5 - 2451545.0;
}

// Local sidereal time in degrees
export function localSiderealTime(date, lonDeg) {
  const d = daysSinceJ2000(date);
  return norm360(280.46061837 + 360.98564736629 * d + lonDeg);
}

const OBLIQUITY = 23.439 * RAD;

function eclipticToEquatorial(lambda, beta = 0) {
  const ra = Math.atan2(
    Math.sin(lambda) * Math.cos(OBLIQUITY) - Math.tan(beta) * Math.sin(OBLIQUITY),
    Math.cos(lambda)
  );
  const dec = Math.asin(
    Math.sin(beta) * Math.cos(OBLIQUITY) + Math.cos(beta) * Math.sin(OBLIQUITY) * Math.sin(lambda)
  );
  return { ra: norm360(ra / RAD), dec: dec / RAD };
}

export function sunPosition(date) {
  const d = daysSinceJ2000(date);
  const g = norm360(357.528 + 0.9856003 * d) * RAD;
  const L = norm360(280.46 + 0.9856474 * d);
  const lambda = norm360(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
  return { ...eclipticToEquatorial(lambda * RAD), lambda };
}

export function moonPosition(date) {
  const d = daysSinceJ2000(date);
  const L0 = norm360(218.316 + 13.176396 * d);
  const M = norm360(134.963 + 13.064993 * d) * RAD;
  const F = norm360(93.272 + 13.22935 * d) * RAD;
  const lambda = norm360(L0 + 6.289 * Math.sin(M));
  const beta = 5.128 * Math.sin(F);
  return { ...eclipticToEquatorial(lambda * RAD, beta * RAD), lambda };
}

export function moonPhase(date) {
  const sun = sunPosition(date);
  const moon = moonPosition(date);
  const elongation = norm360(moon.lambda - sun.lambda); // 0 new, 180 full
  const illumination = (1 - Math.cos(elongation * RAD)) / 2;
  const waxing = elongation < 180;
  const names = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
  ];
  const name = names[Math.round(elongation / 45) % 8];
  return { elongation, illumination, waxing, name };
}

// Equatorial (deg) -> horizontal (deg). az measured from north through east.
export function toHorizontal(raDeg, decDeg, date, lat, lon) {
  const H = (localSiderealTime(date, lon) - raDeg) * RAD;
  const dec = decDeg * RAD;
  const phi = lat * RAD;
  const alt = Math.asin(Math.sin(dec) * Math.sin(phi) + Math.cos(dec) * Math.cos(phi) * Math.cos(H));
  const az = Math.atan2(
    -Math.sin(H) * Math.cos(dec),
    Math.sin(dec) * Math.cos(phi) - Math.cos(dec) * Math.sin(phi) * Math.cos(H)
  );
  return { alt: alt / RAD, az: norm360(az / RAD) };
}

// Unit vector on the celestial sphere, equatorial frame (z = north celestial pole)
export function equatorialVector(raDeg, decDeg, out = [0, 0, 0]) {
  const ra = raDeg * RAD;
  const dec = decDeg * RAD;
  out[0] = Math.cos(dec) * Math.cos(ra);
  out[1] = Math.cos(dec) * Math.sin(ra);
  out[2] = Math.sin(dec);
  return out;
}

// Row-major 3x3 rotating equatorial vectors into world space (x = east, y = up, z = south)
export function equatorialToWorld(date, lat, lon) {
  const lst = localSiderealTime(date, lon) * RAD;
  const phi = lat * RAD;
  const east = [-Math.sin(lst), Math.cos(lst), 0];
  const up = [Math.cos(phi) * Math.cos(lst), Math.cos(phi) * Math.sin(lst), Math.sin(phi)];
  const south = [Math.sin(phi) * Math.cos(lst), Math.sin(phi) * Math.sin(lst), -Math.cos(phi)];
  return [...east, ...up, ...south];
}

// World-space direction for a horizontal coordinate
export function horizontalVector(altDeg, azDeg) {
  const alt = altDeg * RAD;
  const az = azDeg * RAD;
  return [Math.cos(alt) * Math.sin(az), Math.sin(alt), -Math.cos(alt) * Math.cos(az)];
}

// Galactic (l, b) -> equatorial unit vector, J2000
const G = [
  [-0.0548755604, -0.8734370902, -0.4838350155],
  [0.4941094279, -0.44482963, 0.7469822445],
  [-0.867666149, -0.1980763734, 0.4559837762]
];
export function galacticToEquatorialVector(lDeg, bDeg) {
  const l = lDeg * RAD;
  const b = bDeg * RAD;
  const g = [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)];
  return [
    G[0][0] * g[0] + G[1][0] * g[1] + G[2][0] * g[2],
    G[0][1] * g[0] + G[1][1] * g[1] + G[2][1] * g[2],
    G[0][2] * g[0] + G[1][2] * g[1] + G[2][2] * g[2]
  ];
}

// B-V colour index -> RGB (0-1), approximate blackbody tint
export function bvToRgb(bv) {
  const t = Math.max(-0.4, Math.min(2, bv));
  let r, g, b;
  if (t < 0) { r = 0.62 + 0.9 * (t + 0.4); g = 0.72 + 0.6 * (t + 0.4); b = 1; }
  else if (t < 0.4) { r = 0.98 + 0.05 * t; g = 0.96 - 0.02 * t; b = 1 - 0.3 * t; }
  else if (t < 1.0) { r = 1; g = 0.95 - 0.2 * (t - 0.4); b = 0.88 - 0.55 * (t - 0.4); }
  else { r = 1; g = 0.83 - 0.18 * (t - 1); b = 0.55 - 0.25 * (t - 1); }
  return [Math.min(1, r), Math.min(1, g), Math.max(0.3, Math.min(1, b))];
}
