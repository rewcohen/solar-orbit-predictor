import { Planet } from './types';

// Orbital elements for the planets (heliocentric, J2000 epoch)
// Data sourced from astronomical catalogs and approximations for visualization
export const PLANETS: Planet[] = [
  {
    name: 'Mercury',
    semiMajorAxis: 0.8, // AU - Increased from 0.387098 to extend orbit and make visible against sun
    eccentricity: 0.205630,
    inclination: 7.005,
    longitudeOfAscendingNode: 48.331,
    argumentOfPeriapsis: 29.124,
    meanAnomaly: 174.796,
    orbitalPeriod: 87.969,
    radius: 2439.7,
    color: '#8C7853'
  },
  {
    name: 'Venus',
    semiMajorAxis: 1.2, // AU - Increased from 0.723332 to extend orbit
    eccentricity: 0.006772,
    inclination: 3.394,
    longitudeOfAscendingNode: 76.680,
    argumentOfPeriapsis: 54.884,
    meanAnomaly: 50.115,
    orbitalPeriod: 224.701,
    radius: 6051.8,
    color: '#FFC649'
  },
  {
    name: 'Earth',
    semiMajorAxis: 1.5, // AU - Increased from 1.000000 to extend orbit
    eccentricity: 0.016708,
    inclination: 0.000,
    longitudeOfAscendingNode: 348.739,
    argumentOfPeriapsis: 114.207,
    meanAnomaly: 357.517,
    orbitalPeriod: 365.256,
    radius: 6371.0,
    color: '#6B93D6'
  },
  {
    name: 'Mars',
    semiMajorAxis: 2.0, // AU - Increased from 1.523679 to extend orbit
    eccentricity: 0.093400,
    inclination: 1.850,
    longitudeOfAscendingNode: 49.558,
    argumentOfPeriapsis: 286.502,
    meanAnomaly: 19.373,
    orbitalPeriod: 686.980,
    radius: 3389.5,
    color: '#CD5C5C'
  },
  {
    name: 'Jupiter',
    semiMajorAxis: 5.204267,
    eccentricity: 0.048900,
    inclination: 1.304,
    longitudeOfAscendingNode: 100.464,
    argumentOfPeriapsis: 273.867,
    meanAnomaly: 20.020,
    orbitalPeriod: 4332.59,
    radius: 69911,
    color: '#D8CA9D'
  },
  {
    name: 'Saturn',
    semiMajorAxis: 9.582026,
    eccentricity: 0.055724,
    inclination: 2.485,
    longitudeOfAscendingNode: 113.665,
    argumentOfPeriapsis: 339.392,
    meanAnomaly: 317.020,
    orbitalPeriod: 10759.22,
    radius: 58232,
    color: '#FAD5A5'
  },
  {
    name: 'Uranus',
    semiMajorAxis: 19.191263,
    eccentricity: 0.047167,
    inclination: 0.772,
    longitudeOfAscendingNode: 74.006,
    argumentOfPeriapsis: 96.998,
    meanAnomaly: 142.238,
    orbitalPeriod: 30688.5,
    radius: 25362,
    color: '#4FD0E7'
  },
  {
    name: 'Neptune',
    semiMajorAxis: 30.068963,
    eccentricity: 0.008586,
    inclination: 1.769,
    longitudeOfAscendingNode: 131.784,
    argumentOfPeriapsis: 273.187,
    meanAnomaly: 259.156,
    orbitalPeriod: 60182.0,
    radius: 24622,
    color: '#4B70DD'
  }
];

// Sun properties for reference
export const SUN = {
  name: 'Sun',
  radius: 696340, // km
  color: '#FFD700'
};
