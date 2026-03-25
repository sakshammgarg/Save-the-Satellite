# Keep the Satellite Alive

A browser-based 3D satellite simulation game built with Three.js.

## Features
- 3D Earth rendering with multi-layer textures (land, clouds, city lights, atmosphere).
- Orbiting satellite with manual maneuvering controls (WASD + Q/E).
- Space debris appears and attempts to collide with the satellite.
- Particle effects and sound feedback for debris hits and mission events.
- High score persistence via `localStorage`.
- Debug log panel with `L` key toggle.
- Solar exposure state (Sunlit or Earth Shadow).
- Moon added to the scene (model derived from `threejs-earth` add-moon branch).
- Manual camera controls (drag rotate + wheel zoom) with fallback if OrbitControls fails.

## File structure
```
index.html
style.css
README.md

public/
  textures/
    00_earthmap1k.jpg
    01_earthbump1k.jpg
    02_earthspec1k.jpg
    03_earthlights1k.jpg
    04_earthcloudmap.jpg
    05_earthcloudmaptrans.jpg
    stars/circle.png

src/
  main.js
  scene.js
  systems.js
  faults.js
  debris.js
  particles.js
  sound.js
  scoreboard.js
  ui.js
  getFresnelMat.js
  getStarfield.js
```

## How to run
1. Make sure you have a local web server to avoid CORS issues (e.g. Python's HTTP server). 
2. From project root run:
   ```bash
   python3 -m http.server 8000
   ```
3. Open a browser to: `http://localhost:8000`

## Controls
- Drag mouse on canvas to rotate view
- Scroll wheel to zoom
- `W` / `S` / `A` / `D` for satellite micro-maneuvers
- `Q` / `E` for up / down adjustment
- `L` to toggle debug log overlay
- `Restart game` button appears on mission failure

## Notes
- The satellite automatically orbits Earth, and debris uses guided homing behavior.
- If your system lacks Moon textures (`06_moonmap4k.jpg`, `07_moonbump4k.jpg`), the Moon renders in simple gray.
