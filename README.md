# Maze Solver Visualizer

A web-based, real-time visualization tool for exploring how different pathfinding algorithms navigate through perfect and imperfect mazes. 

I built this project to experiment with graph algorithms and see how they behave in different scenarios. It currently includes a dataset of over 3000 pre-generated mazes and supports side-by-side algorithm comparisons.

## Features

- **Multiple Algorithms**: Implementations for Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Algorithm, A* Search, Greedy Best-First Search, and Wall Follower (Left-hand rule).
- **Algorithm Comparison**: Run two different algorithms side-by-side on the same maze to compare their efficiency in real-time.
- **Custom Dataset**: Includes over 3000 packed mazes (perfect and imperfect).
- **Interactive Canvas**: Pan and zoom across large mazes (up to 145x145) using a custom HTML5 canvas renderer.
- **Real-time Stats**: Tracks operations, path length, explored nodes, queue size, and execution speed natively.
- **Cyberpunk UI**: A dark, neon-themed interface built from scratch without heavy UI frameworks.

## Project Structure

- `src/` - The core web application (HTML, CSS, vanilla JavaScript).
- `data/` - Contains the raw and processed maze datasets. The processed dataset is packed and base64-encoded to reduce overhead.
- `models/` - Jupyter notebooks and evaluation scripts used to test algorithms before integrating them into the web app.
- `scripts/` - Python utilities for processing text-based maze files into the JSON/Base64 format consumed by the frontend.

## How to Run

Because the application is built entirely with Vanilla JS, HTML, and CSS without any build steps or backend servers, it can be run directly in your browser.

1. Clone the repository.
2. Navigate to the `src/` directory.
3. Open `index.html` in any modern web browser.

Alternatively, you can serve it via a simple local server if you prefer:
```bash
cd src
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

## Generating New Mazes

If you want to add your own mazes to the dataset:
1. Place your raw `.txt` maze files inside `data/raw/perfect_maze/` or `data/raw/imperfect_maze/`.
2. Run the processing script to pack them:
```bash
python scripts/embed_mazes.py
```
3. The script will automatically update `data/processed/maze_data.js`, and the changes will be reflected in the visualizer.

## License

MIT
