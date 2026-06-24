# DeskFolio

A pocket-sized portfolio that opens like a book. Built as a tiny desk scene — a flip-through book on a spring, draggable/swappable stickers, and hand-drawn marker underlines that draw themselves on hover.

## Showcase

https://github.com/user-attachments/assets/809826f0-437d-4c35-ab77-4b2f633e8c2c

## Highlights

- **The book** opens and turns pages on a spring — drag a corner, tap a side, or use the arrow keys.
- **Desk stickers** are draggable, resizable, and swappable via a long-press radial menu.
- **Self-drawing scribble underlines** — each project name gets a real marker scribble that a "pen" traces along its own path on hover (the centerline is derived from the filled SVG shape, then drawn via `stroke-dashoffset` inside a mask).
- **Editable text** — the journal/about copy is editable in place.

## Tech

- React 19 + [motion.dev](https://motion.dev)
- Vite + TypeScript
- `web-haptics` for tactile feedback
- Assets: a mix of Freepik + hand-built SVGs

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
