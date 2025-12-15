import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SolarSystem } from './SolarSystem.tsx';
import { TimeControls } from './TimeControls.tsx';
import { PLANETS } from './planetData.ts';
import { dateToJulianDay, calculatePlanetPosition } from './orbitalMath.ts';
import { debugLogger } from './debug.ts';
import { SpaceTime, Planet } from './types.ts';
import './App.css';

function App() {
  debugLogger.info('App component initializing');

  // Performance monitoring
  React.useEffect(() => {
    debugLogger.info('App component mounted');

    return () => {
      debugLogger.info('App component unmounting');
    };
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 1 = 1yr/sec, 2 = 10yr/sec, 3 = 50yr/sec, 4 = 100yr/sec in animation mode
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = normal zoom
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const animationRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  const currentSpaceTime: SpaceTime = {
    date: currentDate,
    julianDay: dateToJulianDay(currentDate)
  };

  console.log('[DEBUG] App state initialized:', {
    currentDate: currentDate.toISOString(),
    isPlaying,
    playSpeed,
    zoomLevel,
    selectedPlanet: selectedPlanet?.name
  });

  // Speed presets for animation mode: simplified to just reverse orbit
  const speedPresets = [
    { label: 'Reverse Orbit', yearsPerSecond: -1 }
  ];

  const getCurrentAnimationSpeed = () => {
    try {
      if (playSpeed >= 0 && playSpeed < speedPresets.length) {
        return speedPresets[playSpeed].yearsPerSecond;
      }
      console.warn(`[DEBUG] Invalid playSpeed ${playSpeed} for animation speed, using fallback`);
      return 1; // fallback
    } catch (error) {
      console.error('[DEBUG] Error getting animation speed:', error);
      return 1;
    }
  };

  const getCurrentAnimationSpeedLabel = () => {
    try {
      if (playSpeed >= 0 && playSpeed < speedPresets.length) {
        return speedPresets[playSpeed].label;
      }
      console.warn(`[DEBUG] Invalid playSpeed ${playSpeed} for animation speed label, using fallback`);
      return '1yr/sec'; // fallback
    } catch (error) {
      console.error('[DEBUG] Error getting animation speed label:', error);
      return '1yr/sec';
    }
  };

  const updateTime = useCallback((deltaSeconds: number) => {
    if (isPlaying) {
      // When playing, advance by years per second based on playSpeed preset
      const yearsToAdvance = getCurrentAnimationSpeed() * deltaSeconds;
      const daysToAdvance = yearsToAdvance * 365.25;
      const msToAdvance = daysToAdvance * 24 * 60 * 60 * 1000;
      setCurrentDate(new Date(currentDate.getTime() + msToAdvance));
    } else {
      // When not playing, use the speed multiplier for manual stepping
      setCurrentDate(new Date(currentDate.getTime() + deltaSeconds * 1000 * playSpeed));
    }
  }, [currentDate, playSpeed, isPlaying, getCurrentAnimationSpeed]);

  // Animation loop using requestAnimationFrame for smooth performance
  useEffect(() => {
    console.log(`[DEBUG] Animation loop ${isPlaying ? 'starting' : 'stopping'}`);

    if (!isPlaying) return;

    let frameCount = 0;
    let totalDeltaTime = 0;
    let lastLogTime = Date.now();
    let lastDateTime = currentDate.getTime();

    const animate = (currentTime: number) => {
      try {
        const startTime = performance.now();

        if (lastFrameTimeRef.current === 0) {
          lastFrameTimeRef.current = currentTime;
          console.log('[DEBUG] Animation loop initialized at', currentTime);
          return animationRef.current = requestAnimationFrame(animate);
        }

        const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000; // Convert to seconds
        lastFrameTimeRef.current = currentTime;

        // Performance monitoring
        frameCount++;
        totalDeltaTime += deltaTime;

        if (isNaN(deltaTime) || deltaTime < 0 || deltaTime > 1) {
          console.warn('[DEBUG] Invalid deltaTime detected:', deltaTime, 'currentTime:', currentTime, 'lastFrameTime:', lastFrameTimeRef.current);
        } else {
          console.log(`[DEBUG] Frame ${frameCount}: deltaTime=${deltaTime.toFixed(4)}s, advancing time...`);
        }

        // Update time based on animation delta
        updateTime(deltaTime);

        // Log time advancement
        const currentDateTime = currentDate.getTime();
        const timeDiffMs = currentDateTime - lastDateTime;
        lastDateTime = currentDateTime;

        console.log(`[DEBUG] Time advanced by ${timeDiffMs}ms (${(timeDiffMs/(1000*60*60*24)).toFixed(2)} days)`);
        console.log(`[DEBUG] New date: ${currentDate.toISOString()}`);

        animationRef.current = requestAnimationFrame(animate);

        const endTime = performance.now();
        const frameTime = endTime - startTime;

        // Log performance stats every 2 seconds (increased frequency for visibility)
        if (Date.now() - lastLogTime > 2000) {
          const avgFPS = frameCount / ((Date.now() - lastLogTime) / 1000);
          const avgFrameTime = totalDeltaTime / frameCount;
          console.log('[DEBUG] Animation performance - Avg FPS:', avgFPS.toFixed(1), 'Avg deltaTime:', avgFrameTime.toFixed(4) + 's', 'Last frame time:', frameTime.toFixed(2) + 'ms');
          console.log('[DEBUG] Current animation speed setting:', playSpeed, '=', getCurrentAnimationSpeed());
          frameCount = 0;
          totalDeltaTime = 0;
          lastLogTime = Date.now();
        }

        if (frameTime > 16.67) { // 60fps threshold
          console.warn('[DEBUG] Frame time exceeded 60fps threshold:', frameTime.toFixed(2) + 'ms');
        }

      } catch (error) {
        console.error('[DEBUG] Error in animation loop:', error);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    console.log('[DEBUG] Animation started with initial requestAnimationFrame');

    return () => {
      console.log('[DEBUG] Animation loop cleanup');
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      lastFrameTimeRef.current = 0;
    };
  }, [isPlaying, updateTime, playSpeed, currentDate, getCurrentAnimationSpeed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaySpeed(speed);
  };

  const handleStepForward = () => {
    updateTime(3600); // 1 hour forward
  };

  const handleStepBackward = () => {
    updateTime(-3600); // 1 hour backward
  };

  const handleResetToNow = () => {
    setCurrentDate(new Date());
    setIsPlaying(false);
    setPlaySpeed(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.1));
  };

  const handlePlanetSelect = (planet: Planet | null) => {
    setSelectedPlanet(planet);
    console.log(`[DEBUG] Planet ${planet?.name || 'none'} selected for focus - Sun-centered coordinates maintained`);
  };



  return (
    <div className="app">
      <header className="app-header">
        <h1>🌌 Solar System Orbit Predictor</h1>
        <p className="app-subtitle">Explore planetary motions through space and time</p>
      </header>

      <div className="app-main">
        <div className="solar-system-container">
          <SolarSystem
            planets={PLANETS}
            spaceTime={currentSpaceTime}
            width={800}
            height={600}
            zoomLevel={zoomLevel}
            selectedPlanet={selectedPlanet}
            onPlanetSelect={handlePlanetSelect}
          />
        </div>

        <div className="controls-section">
          <h2>Time Controls</h2>
          <TimeControls
            currentDate={currentDate}
            isPlaying={isPlaying}
            playSpeed={playSpeed}
            zoomLevel={zoomLevel}
            selectedPlanet={selectedPlanet}
            planets={PLANETS}
            animationSpeedLabel={getCurrentAnimationSpeedLabel()}
            speedPresets={speedPresets}
            onDateChange={setCurrentDate}
            onPlayPause={handlePlayPause}
            onSpeedChange={handleSpeedChange}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onResetToNow={handleResetToNow}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onPlanetSelect={handlePlanetSelect}
          />
        </div>
      </div>

      <footer className="app-footer">
        <p>© 2025 Solar Orbit Predictor | Data: J2000 Epoch | Powered by Kepler's Laws</p>
      </footer>
    </div>
  );
}

export default App;
