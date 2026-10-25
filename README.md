# Vector Mechanics Lab

An interactive 2D physics sandbox for visualizing velocity vectors (v⃗), conservation of linear momentum, and collisions in an open sunset field.

![Screenshot](https://github.com/user-attachments/assets/92c3f9cb-27ec-4e67-9ddf-4a06854b5601)

**Live demo:** https://vectormechanicslab.netlify.app/

## Features

- **Slingshot aiming** – drag back on any rock to aim and release to launch it.
- **Live telemetry** – maximum speed, net system momentum and rock count.
- **Adjustable physics** – sliders for surface friction (μ) and coefficient of restitution (e).
- **Sunset ambience** – gradient sky, sun glow, dust trails and responsive scaling.

## Project structure

```
index.html          Markup and script loading order
css/styles.css      Layout and HUD styling
js/config.js        Tuning constants, initial layout and colour palette
js/rock.js          Rock body: integration, friction and wall bounces
js/physics.js       Pairwise collision response and system measurements
js/particles.js     Dust-trail particle emission and decay
js/renderer.js      Canvas drawing (scenery, rocks, vectors, aim guide)
js/slingshot.js     Mouse/touch drag-to-launch input
js/main.js          DOM wiring, settings and the animation loop
tests/              Node tests for the simulation logic
```

The browser scripts are plain (non-module) scripts so the app still runs when `index.html` is opened directly from disk.

## Running locally

```bash
git clone https://github.com/prince12xo/physics-NLM.git
cd physics-NLM
# Open index.html in any modern browser
```

## Development

Requires Node.js 18+.

```bash
npm install
npm run lint          # ESLint
npm run format:check  # Prettier
npm test              # simulation unit tests
npm run check         # all of the above
```
