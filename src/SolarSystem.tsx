import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Planet, OrbitalPosition, SpaceTime } from './types.ts';
import { calculatePlanetPosition, generateOrbitalPath } from './orbitalMath.ts';
import { calculateRelativePlanetPositions } from './planetaryMath.ts';
import { debugLogger } from './debug.ts';
import { PLANET_MOONS, PLANET_RINGS, Moon, Rings } from './moonData.ts';

interface SolarSystemProps {
  planets: Planet[];
  spaceTime: SpaceTime;
  width: number;
  height: number;
  zoomLevel?: number;
  selectedPlanet?: Planet | null;
  onPlanetSelect?: (planet: Planet | null) => void;
  panX?: number;
  panY?: number;
  onPanChange?: (panX: number, panY: number) => void;
}

interface Planet3DProps {
  planet: Planet;
  position: OrbitalPosition;
  isSun?: boolean;
  onClick?: () => void;
}

const Planet3D: React.FC<Planet3DProps> = ({ planet, position, isSun = false, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Planet size scaling (rocky planets made smaller for visibility)
  const isRockyPlanet = ['Mercury', 'Venus', 'Earth', 'Mars'].includes(planet.name);
  const planetSize = isSun ? 0.3 : isRockyPlanet ? 0.08 : Math.max(0.2, Math.log10(planet.semiMajorAxis) * 0.5);

  // Planet color (Sun is always gold, planets keep their colors)
  const color = isSun ? '#FFD700' : planet.color;

  // Slow rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]} rotation={[0, 0, 0]} onClick={onClick}>
      <sphereGeometry args={[planetSize, 32, 16]} />
      <meshPhongMaterial
        color={color}
        emissive={isSun ? color : "#000000"}
        emissiveIntensity={isSun ? 0.2 : 0}
      />
      {/* Planet label */}
      <Html position={[0, planetSize + 0.5, 0]} center>
        <div style={{
          color: isSun ? '#FFA500' : '#ffffff',
          fontSize: isSun ? '14px' : '10px',
          fontWeight: 'bold',
          textShadow: '0 0 4px rgba(0,0,0,0.8)',
          pointerEvents: 'auto'
        }}>
          {planet.name}
        </div>
      </Html>
    </mesh>
  );
};

// Ring3D component for planetary ring systems
const Ring3D: React.FC<{
  planetName: string;
  planetPosition: OrbitalPosition;
  planetSize: number;
  rings: Rings[];
}> = ({ planetName, planetPosition, planetSize, rings }) => {
  return (
    <group position={[planetPosition.x, planetPosition.y, planetPosition.z]}>
      {rings.map((ring, index) => (
        <mesh key={`${planetName}-ring-${index}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.innerRadius * planetSize, ring.outerRadius * planetSize, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Moon3D component for individual moons
const Moon3D: React.FC<{
  moon: Moon;
  planetPosition: OrbitalPosition;
  planetName: string;
  spaceTime: SpaceTime;
}> = ({ moon, planetPosition, planetName, spaceTime }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate moon position relative to planet
  const moonAngle = ((spaceTime.julianDay % moon.orbitalPeriod) / moon.orbitalPeriod) * 2 * Math.PI + (moon.meanAnomaly * Math.PI / 180);
  const moonDistance = moon.semiMajorAxis / 500000; // Scale down to match visual scale

  const moonX = planetPosition.x + moonDistance * Math.cos(moonAngle);
  const moonY = planetPosition.y;
  const moonZ = planetPosition.z + moonDistance * Math.sin(moonAngle);

  // Moon size scaled relative to planet
  const moonSize = Math.max(0.005, Math.log10(moon.radius / 1000) * 0.01);

  // Slow rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[moonX, moonY, moonZ]}>
      <sphereGeometry args={[moonSize, 16, 8]} />
      <meshPhongMaterial color={moon.color} />
      {/* Moon label (small) */}
      <Html position={[0, moonSize + 0.1, 0]} center>
        <div style={{
          color: '#cccccc',
          fontSize: '6px',
          fontWeight: 'bold',
          textShadow: '0 0 2px rgba(0,0,0,0.8)',
          pointerEvents: 'auto'
        }}>
          {moon.name}
        </div>
      </Html>
    </mesh>
  );
};

const SolarSystemScene: React.FC<{
  planets: Planet[];
  spaceTime: SpaceTime;
  selectedPlanet?: Planet | null;
  onPlanetSelect?: (planet: Planet | null) => void;
}> = ({ planets, spaceTime, selectedPlanet, onPlanetSelect }) => {
  const { camera } = useThree();

  // Always use Sun-centered coordinates for planet positions
  const planetPositions = useMemo(() => {
    debugLogger.info('[SOLAR_3D] Calculating 3D planet positions for', planets.length, 'planets (Sun-centered)');
    return planets.map(planet => ({
      planet,
      position: calculatePlanetPosition(planet, spaceTime)
    }));
  }, [planets, spaceTime]);

  // Orbital paths always use Sun-centered coordinates (same as planet positions now)
  const sunCenteredOrbitPositions = planetPositions;

  return (
    <>
      {/* Three-point lighting for realistic planet appearance */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 0, 0]} intensity={0.5} />

      {/* Background star field */}
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Orbital paths as 3D ellipses with proper orbital mechanics */}
      {sunCenteredOrbitPositions.map(({ planet, position }) => {
        if (planet.name === 'Sun') return null;

        const orbitalPathPoints = generateOrbitalPath(planet, 64);

        return (
          <group key={`orbit-group-${planet.name}`}>
            {/* Elliptical orbital path */}
            <Line
              points={orbitalPathPoints}
              color={planet.color}
              lineWidth={1}
              opacity={0.4}
              transparent
            />
          </group>
        );
      })}

      {/* 3D Planets */}
      {planetPositions.map(({ planet, position }) => {
        const isRockyPlanet = ['Mercury', 'Venus', 'Earth', 'Mars'].includes(planet.name);
        const planetSize = isRockyPlanet ? 0.08 : Math.max(0.2, Math.log10(planet.semiMajorAxis) * 0.5);

        return (
          <group key={`${planet.name}-group`}>
            {/* Planet */}
            <Planet3D
              planet={planet}
              position={position}
              isSun={false}
              onClick={() => planet.name !== 'Sun' ? onPlanetSelect?.(selectedPlanet?.name === planet.name ? null : planet) : undefined}
            />

            {/* Planetary Rings */}
            {PLANET_RINGS[planet.name] && (
              <Ring3D
                planetName={planet.name}
                planetPosition={position}
                planetSize={planetSize}
                rings={PLANET_RINGS[planet.name]}
              />
            )}

            {/* Moons */}
            {PLANET_MOONS[planet.name] && PLANET_MOONS[planet.name].map((moon: Moon) => (
              <Moon3D
                key={`${planet.name}-${moon.name}`}
                moon={moon}
                planetPosition={position}
                planetName={planet.name}
                spaceTime={spaceTime}
              />
            ))}
          </group>
        );
      })}

      {/* Sun - always rendered at origin since we use Sun-centered coordinates */}
      <Planet3D
        key="sun"
        planet={{
          name: 'Sun',
          semiMajorAxis: 0,
          eccentricity: 0,
          inclination: 0,
          longitudeOfAscendingNode: 0,
          argumentOfPeriapsis: 0,
          meanAnomaly: 0,
          orbitalPeriod: 0,
          radius: 696340,
          color: '#FFD700'
        }}
        position={{ x: 0, y: 0, z: 0 }}
        isSun={true}
        onClick={() => onPlanetSelect?.(null)} // Clicking Sun deselects
      />
    </>
  );
};

export const SolarSystem: React.FC<SolarSystemProps> = (props) => {
  debugLogger.info('[SOLAR_3D] SolarSystem component rendering with:', {
    planetCount: props.planets?.length || 0,
    selectedPlanet: props.selectedPlanet?.name
  });

  // Planet-specific camera offset distances to make sun appear large for inner planets
  const getCameraOffset = (planet: Planet): number => {
    const offsets: { [key: string]: number } = {
      'Mercury': 2.2,   // Very close - Sun appears massive
      'Venus': 2.5,     // Very close - Sun appears massive
      'Earth': 2.8,     // Very close - Sun appears massive
      'Mars': 3.2,      // Close - Sun appears very large
      'Jupiter': 6.0,   // Medium - Good orbital context
      'Saturn': 7.0,    // Medium - Good orbital context
      'Uranus': 10.0,   // Distant - Show full orbit scale
      'Neptune': 12.0   // Distant - Show full orbit scale
    };

    return offsets[planet.name] || 8.0; // Default fallback
  };

  // Function to calculate camera position based on selected planet
  const calculateCameraPosition = (planet: Planet | null, spaceTime: SpaceTime) => {
    if (!planet) {
      return new THREE.Vector3(30, 15, 30); // Default solar system overview
    }

    // Get selected planet's position
    const planetPosition = calculatePlanetPosition(planet, spaceTime);

    // Calculate direction from planet to Sun (origin)
    const sunDirection = new THREE.Vector3(-planetPosition.x, -planetPosition.y, -planetPosition.z);
    sunDirection.normalize();

    // Use planet-specific camera offset to make sun appear appropriately sized
    // Inner planets get much closer camera positions so sun appears large
    const cameraOffset = getCameraOffset(planet);
    const cameraX = planetPosition.x + sunDirection.x * cameraOffset;
    const cameraY = planetPosition.y + sunDirection.y * cameraOffset;
    const cameraZ = planetPosition.z + sunDirection.z * cameraOffset;

    debugLogger.info('[SOLAR_3D] Camera positioned at distance', cameraOffset, 'AU for', planet.name);

    return new THREE.Vector3(cameraX, cameraY, cameraZ);
  };

  // Create a ref for OrbitControls to coordinate with camera controller
  const orbitControlsRef = useRef<any>();

  return (
    <div style={{
      width: props.width,
      height: props.height,
      background: '#000011'
    }}>
      <Canvas
        camera={{
          position: [30, 15, 30], // Initial camera position
          fov: 60
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <SolarSystemScene {...props} />
        <CameraController
          selectedPlanet={props.selectedPlanet || null}
          spaceTime={props.spaceTime}
          calculateCameraPosition={calculateCameraPosition}
          orbitControlsRef={orbitControlsRef}
        />
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={150}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
};

// Separate component to handle camera updates
const CameraController: React.FC<{
  selectedPlanet: Planet | null;
  spaceTime: SpaceTime;
  calculateCameraPosition: (planet: Planet | null, spaceTime: SpaceTime) => THREE.Vector3;
  orbitControlsRef: React.RefObject<any>;
}> = ({ selectedPlanet, spaceTime, calculateCameraPosition, orbitControlsRef }) => {
  const { camera } = useThree();
  const targetPosition = React.useRef<THREE.Vector3>(new THREE.Vector3(30, 15, 30)); // Default position
  const isTransitioning = React.useRef(false);

  // Smooth camera transition using useFrame
  useFrame((state, delta) => {
    if (camera && isTransitioning.current) {
      const currentPos = camera.position.clone();
      const targetPos = targetPosition.current;

      // Smooth interpolation with damping
      const lerpFactor = Math.min(delta * 3, 1); // Smooth transition over ~0.3 seconds
      currentPos.lerp(targetPos, lerpFactor);

      camera.position.copy(currentPos);

      // Check if we're close enough to stop transitioning
      if (currentPos.distanceTo(targetPos) < 0.1) {
        camera.position.copy(targetPos);
        isTransitioning.current = false;

        // Re-enable orbit controls after transition completes
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
        }
      }

      camera.lookAt(0, 0, 0); // Always look at the Sun at origin
    }
  });

  // Update target position only when selected planet changes
  React.useEffect(() => {
    if (camera) {
      const newTargetPosition = calculateCameraPosition(selectedPlanet, spaceTime);
      targetPosition.current.copy(newTargetPosition);

      // Check if controls are currently active or we're transitioning
      const shouldSmooth = isTransitioning.current || (orbitControlsRef.current && !orbitControlsRef.current.enabled);

      if (shouldSmooth) {
        // Start smooth transition
        isTransitioning.current = true;
        // Temporarily disable orbit controls during transition
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false;
        }
      } else {
        // Direct move for immediate selections
        camera.position.copy(newTargetPosition);
        camera.lookAt(0, 0, 0);
      }
    }
  }, [selectedPlanet]); // Only depend on selectedPlanet changes

  return null; // This component doesn't render anything
};
