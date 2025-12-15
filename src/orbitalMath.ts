import { Planet, OrbitalPosition, SpaceTime } from './types';
import * as THREE from 'three';

// Convert degrees to radians
const degToRad = (degrees: number): number => {
  const result = degrees * Math.PI / 180;
  if (isNaN(result) || !isFinite(result)) {
    console.error('[DEBUG] degToRad: Invalid input or result', { input: degrees, result });
    return 0;
  }
  return result;
};

// Convert radians to degrees
const radToDeg = (radians: number): number => {
  const result = radians * 180 / Math.PI;
  if (isNaN(result) || !isFinite(result)) {
    console.error('[DEBUG] radToDeg: Invalid input or result', { input: radians, result });
    return 0;
  }
  return result;
};

// Convert date to Julian Day Number (JDN)
export const dateToJulianDay = (date: Date): number => {
  try {
    console.log('[DEBUG] dateToJulianDay called with:', date);

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('[DEBUG] dateToJulianDay: Invalid date object', date);
      return 2451545.0; // J2000 epoch fallback
    }

    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;

    let jd = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Add fractional day
    const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    jd += hours / 24 - 0.5;

    if (isNaN(jd) || !isFinite(jd)) {
      console.error('[DEBUG] dateToJulianDay: Invalid Julian Day calculated', { date: date.toISOString(), jd });
      return 2451545.0; // J2000 epoch fallback
    }

    console.log('[DEBUG] dateToJulianDay result:', { input: date.toISOString(), julianDay: jd });
    return jd;
  } catch (error) {
    console.error('[DEBUG] dateToJulianDay: Exception thrown', error);
    return 2451545.0; // J2000 epoch fallback
  }
};

// Calculate the number of centuries since J2000.0
const centuriesSinceJ2000 = (julianDay: number): number => {
  return (julianDay - 2451545.0) / 36525;
};

// Solve Kepler's equation using Newton-Raphson method
const solveKepler = (M: number, e: number, tolerance: number = 1e-8): number => {
  let E = M; // Initial guess
  let delta;

  do {
    delta = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += delta;
  } while (Math.abs(delta) > tolerance);

  return E;
};

// Calculate planet position using Keplerian elements
export const calculatePlanetPosition = (planet: Planet, spaceTime: SpaceTime): OrbitalPosition => {
  try {
    console.log('[DEBUG] calculatePlanetPosition called for:', planet.name, 'at:', spaceTime.date.toISOString());

    // Special handling for Sun - always at origin
    if (planet.semiMajorAxis === 0) {
      console.log('[DEBUG] calculatePlanetPosition: Sun position at origin');
      return { x: 0, y: 0, z: 0 };
    }

    // Validate inputs
    if (!planet || typeof planet !== 'object') {
      console.error('[DEBUG] calculatePlanetPosition: Invalid planet object', planet);
      return { x: 0, y: 0, z: 0 };
    }

    if (!spaceTime || isNaN(spaceTime.julianDay)) {
      console.error('[DEBUG] calculatePlanetPosition: Invalid spaceTime', spaceTime);
      return { x: 0, y: 0, z: 0 };
    }

    const T = centuriesSinceJ2000(spaceTime.julianDay);

    // Mean anomaly correction (simplified - real calculations would use proper perturbations)
    let M = planet.meanAnomaly + 360 * (spaceTime.julianDay - 2451545.0) / planet.orbitalPeriod;
    M = M % 360; // Normalize to 0-360 degrees

    if (isNaN(M) || !isFinite(M)) {
      console.error('[DEBUG] calculatePlanetPosition: Invalid mean anomaly M', { planet: planet.name, M, meanAnomaly: planet.meanAnomaly, julianDay: spaceTime.julianDay, orbitalPeriod: planet.orbitalPeriod });
    }

    // Solve Kepler's equation for eccentric anomaly E
    const E = solveKepler(degToRad(M), planet.eccentricity);

    if (isNaN(E) || !isFinite(E)) {
      console.error('[DEBUG] calculatePlanetPosition: Invalid eccentric anomaly E', { planet: planet.name, E, M, eccentricity: planet.eccentricity });
    }

    // Distance from Sun (r)
    const r = planet.semiMajorAxis * (1 - planet.eccentricity * Math.cos(E));

    if (isNaN(r) || !isFinite(r) || r < 0) {
      console.error('[DEBUG] calculatePlanetPosition: Invalid distance r', { planet: planet.name, r, semiMajorAxis: planet.semiMajorAxis, eccentricity: planet.eccentricity, E });
    }

    // True anomaly (ν)
    const nu = 2 * Math.atan(Math.sqrt((1 + planet.eccentricity) / (1 - planet.eccentricity)) * Math.tan(E / 2));

    if (isNaN(nu) || !isFinite(nu)) {
      console.error('[DEBUG] calculatePlanetPosition: Invalid true anomaly nu', { planet: planet.name, nu, eccentricity: planet.eccentricity, E });
    }

    // Argument of latitude (ω + ν)
    const argumentOfLatitude = degToRad(planet.argumentOfPeriapsis) + nu;

    if (isNaN(argumentOfLatitude) || !isFinite(argumentOfLatitude)) {
      console.error('[DEBUG] calculatePlanetPosition: Invalid argument of latitude', { planet: planet.name, argumentOfLatitude, argumentOfPeriapsis: planet.argumentOfPeriapsis, nu });
    }

    // Calculate position in orbital plane
    const sinOmega = Math.sin(degToRad(planet.longitudeOfAscendingNode));
    const cosOmega = Math.cos(degToRad(planet.longitudeOfAscendingNode));
    const sinI = Math.sin(degToRad(planet.inclination));
    const cosI = Math.cos(degToRad(planet.inclination));

    const sinU = Math.sin(argumentOfLatitude);
    const cosU = Math.cos(argumentOfLatitude);

    // Position in 3D space (heliocentric coordinates)
    const x = r * (cosOmega * cosU - sinOmega * sinU * cosI);
    const y = r * (sinOmega * cosU + cosOmega * sinU * cosI);
    const z = r * sinU * sinI;

    const result = { x, y, z };

    // Check for invalid results
    if (isNaN(x) || isNaN(y) || isNaN(z) || !isFinite(x) || !isFinite(y) || !isFinite(z)) {
      console.error('[DEBUG] calculatePlanetPosition: Invalid position calculated', {
        planet: planet.name,
        position: result,
        params: { r, sinOmega, cosOmega, sinI, cosI, sinU, cosU }
      });
      return { x: 0, y: 0, z: 0 };
    }

    console.log('[DEBUG] calculatePlanetPosition result for', planet.name, ':', result);
    return result;
  } catch (error) {
    console.error('[DEBUG] calculatePlanetPosition: Exception thrown', error, { planet, spaceTime });
    return { x: 0, y: 0, z: 0 };
  }
};

// Convert 3D orbital position to 2D screen coordinates
export const orbitalToScreenCoordinates = (
  orbitalPos: OrbitalPosition,
  centerX: number,
  centerY: number,
  scale: number,
  projectionAngle: number = 0 // degrees
): { x: number; y: number } => {
  try {
    console.log('[DEBUG] orbitalToScreenCoordinates called with:', {
      orbitalPos,
      centerX,
      centerY,
      scale,
      projectionAngle
    });

    // Validate inputs
    if (!orbitalPos || typeof orbitalPos !== 'object' ||
        typeof orbitalPos.x !== 'number' || typeof orbitalPos.y !== 'number' || typeof orbitalPos.z !== 'number') {
      console.error('[DEBUG] orbitalToScreenCoordinates: Invalid orbital position', orbitalPos);
      return { x: centerX || 400, y: centerY || 300 }; // Safe fallback
    }

    if (isNaN(centerX) || isNaN(centerY) || isNaN(scale)) {
      console.error('[DEBUG] orbitalToScreenCoordinates: Invalid transform parameters', { centerX, centerY, scale });
      return { x: 400, y: 300 }; // Safe fallback
    }

    // Simple projection (could be enhanced with proper astronomical projections)
    const cosAngle = Math.cos(degToRad(projectionAngle));
    const sinAngle = Math.sin(degToRad(projectionAngle));

    if (isNaN(cosAngle) || isNaN(sinAngle)) {
      console.error('[DEBUG] orbitalToScreenCoordinates: Invalid projection angle', projectionAngle);
      return { x: centerX, y: centerY };
    }

    const projectedX = orbitalPos.x * cosAngle - orbitalPos.y * sinAngle;
    const projectedY = orbitalPos.z;

    const screenX = centerX + projectedX * scale;
    const screenY = centerY + projectedY * scale;

    const result = { x: screenX, y: screenY };

    // Check for invalid results
    if (isNaN(screenX) || isNaN(screenY) || !isFinite(screenX) || !isFinite(screenY)) {
      console.error('[DEBUG] orbitalToScreenCoordinates: Invalid screen coordinates calculated', {
        input: { orbitalPos, centerX, centerY, scale, projectionAngle },
        result,
        intermediate: { projectedX, projectedY, cosAngle, sinAngle }
      });
      return { x: centerX, y: centerY };
    }

    console.log('[DEBUG] orbitalToScreenCoordinates result:', result);
    return result;
  } catch (error) {
    console.error('[DEBUG] orbitalToScreenCoordinates: Exception thrown', error, {
      orbitalPos, centerX, centerY, scale, projectionAngle
    });
    return { x: 400, y: 300 }; // Safe fallback
  }
};

// Calculate orbital ellipse parameters for visualization
export const getOrbitalEllipse = (planet: Planet): {
  a: number; // semi-major axis
  b: number; // semi-minor axis
  inclination: number; // in radians
  longitudeOfNode: number; // in radians
  argumentOfPeriapsis: number; // in radians
} => {
  const a = planet.semiMajorAxis; // Semi-major axis in AU
  const b = a * Math.sqrt(1 - planet.eccentricity * planet.eccentricity); // Semi-minor axis

  return {
    a,
    b,
    inclination: planet.inclination * Math.PI / 180,
    longitudeOfNode: planet.longitudeOfAscendingNode * Math.PI / 180,
    argumentOfPeriapsis: planet.argumentOfPeriapsis * Math.PI / 180
  };
};

// Generate points for elliptic orbital path
export const generateOrbitalPath = (planet: Planet, segments: number = 64): THREE.Vector3[] => {
  const ellipse = getOrbitalEllipse(planet);
  const points: THREE.Vector3[] = [];

  // Generate points around the ellipse in the orbital plane
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;

    // Position in orbital plane (before rotation)
    const x = ellipse.a * Math.cos(angle);
    const y = ellipse.b * Math.sin(angle);
    const z = 0;

    // Apply argument of periapsis rotation around Z axis
    const cosW = Math.cos(ellipse.argumentOfPeriapsis);
    const sinW = Math.sin(ellipse.argumentOfPeriapsis);

    const xRotated = x * cosW - y * sinW;
    const yRotated = x * sinW + y * cosW;

    // Apply inclination rotation around X axis
    const cosI = Math.cos(ellipse.inclination);
    const sinI = Math.sin(ellipse.inclination);

    const xFinal = xRotated;
    const yFinal = yRotated * cosI;
    const zFinal = yRotated * sinI;

    // Apply longitude of ascending node rotation around Z axis
    const cosOmega = Math.cos(ellipse.longitudeOfNode);
    const sinOmega = Math.sin(ellipse.longitudeOfNode);

    const xNode = xFinal * cosOmega - yFinal * sinOmega;
    const yNode = xFinal * sinOmega + yFinal * cosOmega;
    const zNode = zFinal;

    points.push(new THREE.Vector3(xNode, yNode, zNode));
  }

  return points;
};

// Calculate perihelion position (closest point to sun)
export const calculatePerihelionPosition = (planet: Planet): THREE.Vector3 => {
  const point = new THREE.Vector3(planet.semiMajorAxis * (1 - planet.eccentricity), 0, 0);

  const ellipse = getOrbitalEllipse(planet);

  // Apply rotations in same order as generateOrbitalPath
  // 1. Argument of periapsis
  const cosW = Math.cos(ellipse.argumentOfPeriapsis);
  const sinW = Math.sin(ellipse.argumentOfPeriapsis);

  const x1 = point.x * cosW - point.y * sinW;

  // 2. Inclination
  const cosI = Math.cos(ellipse.inclination);
  const sinI = Math.sin(ellipse.inclination);

  const y2 = point.y * cosI;
  const z2 = point.y * sinI;

  // 3. Longitude of ascending node
  const cosOmega = Math.cos(ellipse.longitudeOfNode);
  const sinOmega = Math.sin(ellipse.longitudeOfNode);

  const xFinal = x1 * cosOmega - y2 * sinOmega;
  const yFinal = x1 * sinOmega + y2 * cosOmega;

  return new THREE.Vector3(xFinal, yFinal, z2);
};
