// Moon and ring data for planets with satellites

export interface Moon {
  name: string;
  semiMajorAxis: number; // km from planet center
  eccentricity: number;
  inclination: number; // degrees
  radius: number; // km
  color: string;
  orbitalPeriod: number; // days
  meanAnomaly: number; // degrees
}

export interface Rings {
  innerRadius: number; // planet radii
  outerRadius: number; // planet radii
  opacity: number;
  color: string;
}

// Planet-specific moon data (simplified - major moons only)
export const PLANET_MOONS: { [planetName: string]: Moon[] } = {
  'Jupiter': [
    { name: 'Io', semiMajorAxis: 421700, eccentricity: 0.0041, inclination: 0.050, radius: 1821.6, color: '#FFFFCC', orbitalPeriod: 1.77, meanAnomaly: 0 },
    { name: 'Europa', semiMajorAxis: 670900, eccentricity: 0.009, inclination: 0.470, radius: 1560.8, color: '#E6E6FA', orbitalPeriod: 3.55, meanAnomaly: 120 },
    { name: 'Ganymede', semiMajorAxis: 1070400, eccentricity: 0.0013, inclination: 0.204, radius: 2634.1, color: '#D3D3D3', orbitalPeriod: 7.16, meanAnomaly: 240 },
    { name: 'Callisto', semiMajorAxis: 1882700, eccentricity: 0.0074, inclination: 0.205, radius: 2410.3, color: '#8B7355', orbitalPeriod: 16.69, meanAnomaly: 180 }
  ],
  'Saturn': [
    { name: 'Mimas', semiMajorAxis: 185539, eccentricity: 0.0196, inclination: 1.572, radius: 198.2, color: '#C0C0C0', orbitalPeriod: 0.94, meanAnomaly: 0 },
    { name: 'Enceladus', semiMajorAxis: 238037, eccentricity: 0.0047, inclination: 0.009, radius: 252.1, color: '#F5F5F5', orbitalPeriod: 1.37, meanAnomaly: 120 },
    { name: 'Tethys', semiMajorAxis: 294672, eccentricity: 0.0001, inclination: 1.091, radius: 533.0, color: '#E0E0E0', orbitalPeriod: 1.89, meanAnomaly: 240 },
    { name: 'Dione', semiMajorAxis: 377420, eccentricity: 0.0022, inclination: 0.019, radius: 561.4, color: '#DCDCDC', orbitalPeriod: 2.74, meanAnomaly: 180 },
    { name: 'Rhea', semiMajorAxis: 527068, eccentricity: 0.0013, inclination: 0.345, radius: 763.8, color: '#F0F0F0', orbitalPeriod: 4.52, meanAnomaly: 300 },
    { name: 'Titan', semiMajorAxis: 1221869, eccentricity: 0.0288, inclination: 0.348, radius: 2575.5, color: '#D2691E', orbitalPeriod: 15.95, meanAnomaly: 60 },
    { name: 'Iapetus', semiMajorAxis: 3560820, eccentricity: 0.0283, inclination: 7.489, radius: 734.5, color: '#8B4513', orbitalPeriod: 79.33, meanAnomaly: 0 }
  ],
  'Uranus': [
    { name: 'Miranda', semiMajorAxis: 129900, eccentricity: 0.0013, inclination: 4.232, radius: 235.8, color: '#DEB887', orbitalPeriod: 1.41, meanAnomaly: 0 },
    { name: 'Ariel', semiMajorAxis: 191020, eccentricity: 0.0012, inclination: 0.041, radius: 578.9, color: '#F0E68C', orbitalPeriod: 2.52, meanAnomaly: 120 },
    { name: 'Umbriel', semiMajorAxis: 266300, eccentricity: 0.0039, inclination: 0.128, radius: 584.7, color: '#696969', orbitalPeriod: 4.14, meanAnomaly: 240 },
    { name: 'Titania', semiMajorAxis: 436300, eccentricity: 0.0011, inclination: 0.079, radius: 788.4, color: '#DDA0DD', orbitalPeriod: 8.71, meanAnomaly: 180 },
    { name: 'Oberon', semiMajorAxis: 583500, eccentricity: 0.0014, inclination: 0.068, radius: 761.4, color: '#8B4513', orbitalPeriod: 13.46, meanAnomaly: 300 }
  ],
  'Neptune': [
    { name: 'Triton', semiMajorAxis: 354759, eccentricity: 0.000016, inclination: 156.885, radius: 1353.4, color: '#4682B4', orbitalPeriod: 5.88, meanAnomaly: 0 }
  ]
};

// Ring systems for applicable planets
export const PLANET_RINGS: { [planetName: string]: Rings[] } = {
  'Saturn': [
    { innerRadius: 1.1, outerRadius: 1.25, opacity: 0.8, color: '#DAA520' }, // Main rings
    { innerRadius: 1.25, outerRadius: 1.5, opacity: 0.6, color: '#F4A460' }  // Outer rings
  ],
  'Jupiter': [
    { innerRadius: 1.8, outerRadius: 2.0, opacity: 0.3, color: '#F5DEB3' }   // Very faint
  ],
  'Uranus': [
    { innerRadius: 2.0, outerRadius: 2.2, opacity: 0.4, color: '#87CEEB' }   // Edge-on rings
  ],
  'Neptune': [
    { innerRadius: 2.5, outerRadius: 3.0, opacity: 0.2, color: '#4169E1' }   // Ring arcs
  ]
};
