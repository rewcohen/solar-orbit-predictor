# Solar Orbit Predictor 🌌

A beautiful, interactive 3D visualization of our solar system featuring real-time orbital calculations, planetary rings, orbiting moons, and dynamic camera controls.

![Solar Orbit Predictor](https://img.shields.io/badge/version-1.1.0-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue) ![Three.js](https://img.shields.io/badge/Three.js-React--Three--Fiber-green)

## 🚀 Features

### Real-Time 3D Visualization
- **Accurate Keplerian Orbital Mathematics** - Planets follow realistic orbital paths using NASA's astronomical data
- **Interactive 3D Camera** - Orbit, pan, and zoom controls with dynamic planet-focused positioning
- **Smooth Animations** - 60fps performance with configurable time speeds (-10x to +10x)
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile devices

### Planetary Features
- **All Major Planets** - Mercury through Neptune with authentic colors and relative sizes
- **Planetary Ring Systems** - Detailed rings for Saturn, Jupiter, Uranus, and Neptune
- **Major Planetary Moons** - Orbiting moons including Jupiter's Galilean moons, Saturn's major satellites, and more
- **Improved Inner Planet Visibility** - Extended orbits and optimized sizing for Mercury visibility against the Sun

### Time Controls
- **Interactive Timeline** - Date/time picker for any moment in astronomical history
- **Playback Controls** - Play, pause, step forward/backward functionality
- **Speed Adjustment** - Variable time acceleration for detailed or fast-motion viewing

## 🎯 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/solar-orbit-predictor.git
cd solar-orbit-predictor

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open in your browser at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
# Create optimized production build
npm run build

# The build artifacts will be stored in the `build/` directory
```

## 🎮 Usage

### Basic Navigation
- **Orbit**: Click and drag to rotate the view
- **Zoom**: Mouse wheel to zoom in/out
- **Pan**: Right-click and drag to pan (or touch gesture)

### Planet Selection
- **Click any planet** to focus the camera on it and see its orbital details
- **Click the Sun** to return to the overview perspective

### Time Controls
- **Date Picker**: Select any date to jump to that moment in time
- **Playback**: Use play/pause to control animation
- **Speed**: Adjust the time multiplier for faster/slower orbital motion
- **Step**: Move forward/backward in time by one-hour increments

### What You'll See
- **Saturn's Rings**: Beautiful ring system with proper transparency and colors
- **Jupiter's Moons**: Io, Europa, Ganymede, and Callisto orbiting Jupiter
- **Saturn's Moons**: Titan, Rhea, Iapetus, and others around Saturn
- **Mercury Visibility**: Now clearly visible against the Sun's background
- **Orbital Paths**: Colored ellipses showing each planet's orbital trajectory
- **Real-time Labels**: Planet names and moon labels that follow their movement

## 🔬 Technical Details

### Mathematical Accuracy
- **Kepler's Laws** - Precise orbital calculations using the Newton-Raphson method
- **Astronomical Data** - Based on J2000 epoch data from NASA astronomical catalogs
- **Real-time Positioning** - Planets positioned accurately for any date/time

### Performance Optimized
- **Memoized Calculations** - Expensive orbital math cached for smooth animation
- **Efficient Rendering** - React Three Fiber optimized for 60fps performance
- **Component Architecture** - Modular design for maintainability and performance

### Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Modern mobile browsers with WebGL support

## 📖 Documentation

For detailed technical documentation including:
- Complete API reference
- Mathematical implementation details
- Development guidelines
- Contributing instructions

See [documentation.md](./documentation.md)

## 🔧 Project Structure
```
solar-orbit-predictor/
├── src/
│   ├── types.ts              # TypeScript interfaces
│   ├── planetData.ts         # Planetary orbital data
│   ├── moonData.ts           # Moon and ring data
│   ├── orbitalMath.ts        # Keplerian calculations
│   ├── SolarSystem.tsx       # Main 3D visualization
│   ├── TimeControls.tsx      # Time control interface
│   └── ...
├── documentation.md          # Complete technical docs
├── package.json
└── README.md                 # This file
```

## 🎓 Educational Value

This application demonstrates:
- **Keplerian Orbital Mechanics** - How planets move according to gravitational laws
- **Scale and Distance** - Relative sizes and distances in our solar system
- **Time and Motion** - How celestial bodies move over astronomical time scales
- **Modern Web Development** - React, TypeScript, and 3D web technologies

Perfect for students, educators, and astronomy enthusiasts!

## 🛠️ Technologies Used

- **React 18** - Modern user interface framework
- **TypeScript** - Type-safe JavaScript development
- **Three.js/React Three Fiber** - 3D rendering and visualization
- **React Three Drei** - Useful 3D components and helpers
- **CSS Grid/Flexbox** - Modern responsive layouts

## 🤝 Contributing

Contributions welcome! Please read the [Contributing Guidelines](./documentation.md#contributing--maintenance) in the documentation.

### Development Setup
```bash
# Install dependencies
npm install

# Start development server with hot reloading
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is open source. See [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- **NASA Astronomical Almanac** - For accurate orbital element data
- **React Three Fiber Community** - For excellent 3D React tools
- **Astronomy Enthusiasts** - For their passion and knowledge that inspired this project

---

**Made with ❤️ for astronomy lovers and science enthusiasts**

*Ever wonder how the planets are positioned right now? This app shows you - in real-time!*
