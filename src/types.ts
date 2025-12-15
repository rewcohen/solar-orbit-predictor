// Planet orbital parameters (heliocentric, J2000 epoch)
export interface Planet {
  name: string;
  semiMajorAxis: number; // AU (Astronomical Units)
  eccentricity: number;
  inclination: number; // degrees
  longitudeOfAscendingNode: number; // degrees
  argumentOfPeriapsis: number; // degrees
  meanAnomaly: number; // degrees (at epoch J2000)
  orbitalPeriod: number; // Earth days
  radius: number; // km
  color: string;
}

// Position in orbital coordinates
export interface OrbitalPosition {
  x: number;
  y: number;
  z: number;
}

// Position in 2D screen coordinates
export interface ScreenPosition {
  x: number;
  y: number;
}

// Date/Time representation
export interface SpaceTime {
  date: Date;
  julianDay: number;
}
