# Maze Solver Visualizer

![Maze Solver UI Demo](assets/demo.png)
> **Note**: *Please replace `assets/demo.png` with an actual screenshot of your Cyberpunk UI.*

A web-based, real-time visualization tool for exploring how different pathfinding algorithms navigate through perfect and imperfect mazes. 

I built this project to experiment with graph algorithms and see how they behave in different scenarios. It currently includes a dataset of over 3000 pre-generated mazes and supports side-by-side algorithm comparisons.

## 🌟 Features

- **Multiple Algorithms**: Implementations for Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Algorithm, A* Search, Greedy Best-First Search, and Wall Follower.
- **Algorithm Comparison**: Run two different algorithms side-by-side on the same maze to compare their efficiency in real-time.
- **Custom Dataset**: Includes over 3000 packed mazes (perfect and imperfect).
- **Interactive Canvas**: Pan and zoom across large mazes (up to 145x145) using a custom HTML5 canvas renderer.
- **Cyberpunk UI**: A dark, neon-themed interface built from scratch without heavy UI frameworks.

## 📂 Project Structure

```text
maze-generation-and-solving-tests/
├── data/                  # Contains raw and processed datasets
│   ├── processed/         # Packed base64-encoded mazes (e.g., maze_data.js)
│   └── raw/               # Raw text files for perfect/imperfect mazes
├── models/                # Jupyter Notebooks for testing algorithms offline
├── scripts/               # Python utility scripts
│   └── embed_mazes.py     # Script to pack raw .txt mazes into JS base64 format
├── src/                   # Core web application (Vanilla JS/HTML/CSS)
│   ├── index.html         # Main entry point with Cyberpunk UI
│   ├── style.css          # Styling for the interactive canvas and dashboard
│   └── ...                # JavaScript logic for parsing and pathfinding
├── maze_data_sample.js    # A sample data file in the root
└── README.md              # Project documentation
```

## 🧠 Algorithm Complexity

Here is a quick breakdown of the algorithms implemented and compared within this visualizer:

| Algorithm | Time Complexity | Space Complexity | Description |
|-----------|-----------------|------------------|-------------|
| **BFS** | $O(V + E)$ | $O(V)$ | Explores all neighbors layer by layer. Guarantees shortest path in unweighted graphs. |
| **DFS** | $O(V + E)$ | $O(V)$ | Dives deep into a path before backtracking. Does not guarantee shortest path. |
| **Dijkstra** | $O(E \log V)$ | $O(V)$ | Finds shortest path in weighted graphs using a priority queue. |
| **A* Search** | $O(E \log V)$ | $O(V)$ | Uses heuristics (e.g., Manhattan distance) to find the shortest path efficiently. |
| **Greedy** | $O(E \log V)$ | $O(V)$ | Picks the path that looks closest to the goal. Fast, but not always optimal. |
| **Wall Follower**| $O(V)$ | $O(1)$ | Follows the right/left wall. Only works for simply connected mazes. |

*(Note: $V$ = number of vertices/cells, $E$ = number of edges/paths)*

## 💻 Code Architecture

The pathfinding logic is isolated from the canvas renderer to ensure clean execution. Here is a snippet demonstrating how an algorithm is initialized:

<p align="center">
  <a href="https://carbon.now.sh/">
    <img src="assets/code_snippet.png" alt="Algorithm Initialization Code">
  </a>
</p>
> **Note**: *Please use a tool like [Carbon](https://carbon.now.sh/) to generate a beautiful snippet of your core logic, save it as `assets/code_snippet.png`.*

## 🚀 How to Run

Because the application is built entirely with Vanilla JS, HTML, and CSS, it can be run directly in your browser without build steps.

1. Clone the repository.
2. Navigate to the `src/` directory.
3. Open `index.html` in any modern web browser.

Alternatively, serve it via Python:
```bash
cd src
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## 🛠 Generating New Mazes

If you want to add your own mazes to the dataset:
1. Place your raw `.txt` maze files inside `data/raw/perfect_maze/` or `data/raw/imperfect_maze/`.
2. Run the processing script to pack them:
```bash
python scripts/embed_mazes.py
```
3. The script will automatically update `data/processed/maze_data.js`, and the changes will be reflected in the visualizer.

## 📄 License

MIT
