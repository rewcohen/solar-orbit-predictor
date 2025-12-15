import React, { useState } from 'react';
import { Planet } from './types.ts';
import './TimeControls.css';

// Sun object for dropdown
const SUN = {
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
};

interface SpeedPreset {
  label: string;
  yearsPerSecond: number;
}

interface TimeControlsProps {
  currentDate: Date;
  isPlaying: boolean;
  playSpeed: number;
  zoomLevel: number;
  selectedPlanet: Planet | null;
  planets: Planet[];
  animationSpeedLabel: string;
  speedPresets: SpeedPreset[];
  isFollowingPlanet?: boolean;
  onToggleFollowing?: () => void;
  onDateChange: (date: Date) => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onResetToNow: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPlanetSelect: (planet: Planet | null) => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  currentDate,
  isPlaying,
  playSpeed,
  zoomLevel,
  selectedPlanet,
  planets,
  animationSpeedLabel,
  speedPresets,
  isFollowingPlanet = false,
  onToggleFollowing = () => {},
  onDateChange,
  onPlayPause,
  onSpeedChange,
  onStepForward,
  onStepBackward,
  onResetToNow,
  onZoomIn,
  onZoomOut,
  onPlanetSelect
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate);
    }
  };

  const handleSpeedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    if (!isNaN(speed) && speed >= -10 && speed <= 10) {
      onSpeedChange(speed);
    }
  };

  return (
    <div className="time-controls">
      {/* Current Date/Time Display - Permanent Digital Ticker */}
      <div className="datetime-display">
        <div className="current-time">
          {formatDateTime(currentDate)}
          {isPlaying && (
            <span className="animation-speed-display">
              {' '}| {animationSpeedLabel}
            </span>
          )}
        </div>
        {!isPlaying && (
          <button
            className="date-picker-toggle"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            title="Pick specific date/time"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Date/Time Picker - Only show when not playing */}
      {!isPlaying && isDatePickerOpen && (
        <div className="datetime-picker">
          <input
            type="datetime-local"
            value={currentDate.toISOString().slice(0, 16)}
            onChange={handleDateInputChange}
            className="datetime-input"
          />
          <button
            onClick={onResetToNow}
            className="reset-button"
          >
            Reset to Now
          </button>
        </div>
      )}

      {/* Celestial Body Selection Dropdown */}
      <div className="planet-selector">
        <label>Select Celestial Body</label>
        <select
          value={selectedPlanet?.name || 'none'}
          onChange={(e) => {
            const selectedName = e.target.value;
            if (selectedName === 'none') {
              onPlanetSelect(null);
            } else if (selectedName === 'Sun') {
              onPlanetSelect(SUN);
            } else {
              // Find the planet in the planets array
              const planet = planets.find(p => p.name === selectedName);
              if (planet) {
                onPlanetSelect(planet);
              }
            }
          }}
          className="planet-dropdown"
        >
          <option value="none">- None Selected -</option>
          <option value="Sun">☀️ Sun</option>
          <option value="Mercury">☿️ Mercury</option>
          <option value="Venus">♀️ Venus</option>
          <option value="Earth">🜨 Earth</option>
          <option value="Mars">♂️ Mars</option>
          <option value="Jupiter">♃ Jupiter</option>
          <option value="Saturn">♄ Saturn</option>
          <option value="Uranus">⛢ Uranus</option>
          <option value="Neptune">♆ Neptune</option>
        </select>
      </div>

      {/* Playback Controls */}
      <div className="playback-controls">
        {!isPlaying && (
          <>
            <button
              onClick={onStepBackward}
              className="step-button"
              title="Step backward 1 hour"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 18l-6-6 6-6v12z"/>
              </svg>
            </button>
            <button
              onClick={onStepForward}
              className="step-button"
              title="Step forward 1 hour"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18l6-6-6-6v12z"/>
              </svg>
            </button>
          </>
        )}

        <button
          onClick={onPlayPause}
          className="play-pause-button"
          title={isPlaying ? "Pause animation" : "Start animation"}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Speed Control - Simplified reverse orbit */}
      {speedPresets.length > 0 && (
        <div className="speed-control">
          <div className="speed-presets">
            {speedPresets.map((preset, index) => (
              <button
                key={index}
                className={`speed-preset-button ${playSpeed === index ? 'active' : ''}`}
                onClick={() => onSpeedChange(index)}
                title={preset.label}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                  <path d="M12 5V1l7 6-7 6V7c-4.42 0-8 3.58-8 8s3.58 8 8 8v2c-5.52 0-10-4.48-10-10S6.48 5 12 5z"/>
                </svg>
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="zoom-control">
        <label>Zoom: {zoomLevel.toFixed(1)}x</label>
        <div className="zoom-buttons">
          <button
            onClick={onZoomOut}
            className="zoom-button"
            title="Zoom out"
            disabled={zoomLevel <= 0.1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              <path d="M7 9.5h5v1H7z"/>
            </svg>
          </button>
          <button
            onClick={onZoomIn}
            className="zoom-button"
            title="Zoom in"
            disabled={zoomLevel >= 5}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Selected Planet Info */}
      {selectedPlanet && (
        <div className="selected-planet-info">
          <h3>Selected: {selectedPlanet.name}</h3>
          <div className="planet-details">
            <p>Semi-major Axis: {selectedPlanet.semiMajorAxis.toFixed(3)} AU</p>
            <p>Eccentricity: {selectedPlanet.eccentricity.toFixed(4)}</p>
            <p>Orbital Period: {selectedPlanet.orbitalPeriod.toFixed(1)} days</p>
            <p>Radius: {selectedPlanet.radius.toLocaleString()} km</p>
          </div>
          <div className="planet-follow-controls">
            <button
              onClick={onToggleFollowing}
              className={`follow-toggle-button ${isFollowingPlanet ? 'following' : ''}`}
              title={isFollowingPlanet ? 'Stop following this planet' : 'Follow this planet during animation'}
            >
              {isFollowingPlanet ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.48S3.52 6.83 3 11v1H1v4h4v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h4v-4h-2v-1z"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => onPlanetSelect(null)}
              className="deselect-button"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
