// Planetary coordinate system transformations
import { Planet, OrbitalPosition, SpaceTime } from './types';
import { calculatePlanetPosition } from './orbitalMath.ts';

// Calculate position of planet B relative to planet A (A becomes the origin)
export const calculateRelativePosition = (
  planetA: Planet,
  planetB: Planet,
  spaceTime: SpaceTime
): OrbitalPosition => {
  const posA = calculatePlanetPosition(planetA, spaceTime);
  const posB = calculatePlanetPosition(planetB, spaceTime);

  return {
    x: posB.x - posA.x,
    y: posB.y - posA.y,
    z: posB.z - posA.z
  };
};

// Calculate all planet positions relative to a center planet
export const calculateRelativePlanetPositions = (
  planets: Planet[],
  centerPlanet: Planet,
  spaceTime: SpaceTime
): { planet: Planet; position: OrbitalPosition }[] => {
  return planets
    .filter(planet => planet.name !== centerPlanet.name) // Exclude center planet
    .map(planet => ({
      planet,
      position: calculateRelativePosition(centerPlanet, planet, spaceTime)
    }));
};

export const findPlanetByName = (planets: Planet[], name: string): Planet | null => {
  return planets.find(planet => planet.name === name) || null;
};
