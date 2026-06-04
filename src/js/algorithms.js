// --- DATA STRUCTURES & MIN HEAP ---
class MinHeap {
  constructor() { this.data = []; }
  push(item) { this.data.push(item); this._up(this.data.length - 1); }
  pop() {
    if(this.data.length === 0) return null;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) { this.data[0] = last; this._down(0); }
    return top;
  }
  get size() { return this.data.length; }
  _up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p][0] <= this.data[i][0]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  _down(i) {
    const n = this.data.length;
    while (true) {
      let min = i, l = 2*i+1, r = 2*i+2;
      if (l < n && this.data[l][0] < this.data[min][0]) min = l;
      if (r < n && this.data[r][0] < this.data[min][0]) min = r;
      if (min === i) break;
      [this.data[min], this.data[i]] = [this.data[i], this.data[min]];
      i = min;
    }
  }
}

// --- ALGORITHMS ---
function buildPath(parent, start, end, cols) {
  const path = [];
  let key = end[0] * cols + end[1];
  const sk = start[0] * cols + start[1];
  while (key !== sk) {
    path.push([Math.floor(key / cols), key % cols]);
    key = parent[key];
    if (key === -1) return [];
  }
  path.push(start);
  path.reverse();
  return path;
}

function solveBFS(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [start];
  const visited = new Uint8Array(rows * cols);
  const parent = new Int32Array(rows * cols).fill(-1);
  visited[start[0] * cols + start[1]] = 1;
  const explored = [], frontierSizes = [];
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];
  let head = 0;
  
  while (head < queue.length) {
    frontierSizes.push(queue.length - head);
    const [r, c] = queue[head++];
    explored.push([r, c]);
    if (r === end[0] && c === end[1]) {
      return { explored, path: buildPath(parent, start, end, cols), frontierSizes, found: true };
    }
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        const nk = nr * cols + nc;
        if (!visited[nk]) {
          visited[nk] = 1;
          parent[nk] = r * cols + c;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return { explored, path: [], frontierSizes, found: false };
}

function solveDFS(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const stack = [start];
  const visited = new Uint8Array(rows * cols);
  const parent = new Int32Array(rows * cols).fill(-1);
  visited[start[0] * cols + start[1]] = 1;
  const explored = [], frontierSizes = [];
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];
  
  while (stack.length > 0) {
    frontierSizes.push(stack.length);
    const [r, c] = stack.pop();
    explored.push([r, c]);
    if (r === end[0] && c === end[1]) {
      return { explored, path: buildPath(parent, start, end, cols), frontierSizes, found: true };
    }
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        const nk = nr * cols + nc;
        if (!visited[nk]) {
          visited[nk] = 1;
          parent[nk] = r * cols + c;
          stack.push([nr, nc]);
        }
      }
    }
  }
  return { explored, path: [], frontierSizes, found: false };
}

function solveDijkstra(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const heap = new MinHeap(); // [cost, r, c]
  heap.push([0, start[0], start[1]]);
  const cost = new Int32Array(rows * cols).fill(9999999);
  const parent = new Int32Array(rows * cols).fill(-1);
  const sk = start[0] * cols + start[1];
  cost[sk] = 0;
  const explored = [], frontierSizes = [];
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];
  
  while (heap.size > 0) {
    frontierSizes.push(heap.size);
    const [cst, r, c] = heap.pop();
    const k = r * cols + c;
    if (cst > cost[k]) continue;
    explored.push([r, c]);
    
    if (r === end[0] && c === end[1]) {
      return { explored, path: buildPath(parent, start, end, cols), frontierSizes, found: true };
    }
    
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        const nk = nr * cols + nc;
        if (cst + 1 < cost[nk]) {
          cost[nk] = cst + 1;
          parent[nk] = k;
          heap.push([cst + 1, nr, nc]);
        }
      }
    }
  }
  return { explored, path: [], frontierSizes, found: false };
}

function solveGBFS(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const heap = new MinHeap(); // [h, r, c]
  const h0 = Math.abs(start[0]-end[0]) + Math.abs(start[1]-end[1]);
  heap.push([h0, start[0], start[1]]);
  const visited = new Uint8Array(rows * cols);
  const parent = new Int32Array(rows * cols).fill(-1);
  visited[start[0] * cols + start[1]] = 1;
  const explored = [], frontierSizes = [];
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];
  
  while (heap.size > 0) {
    frontierSizes.push(heap.size);
    const [_, r, c] = heap.pop();
    explored.push([r, c]);
    
    if (r === end[0] && c === end[1]) {
      return { explored, path: buildPath(parent, start, end, cols), frontierSizes, found: true };
    }
    
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        const nk = nr * cols + nc;
        if (!visited[nk]) {
          visited[nk] = 1;
          parent[nk] = r * cols + c;
          const h = Math.abs(nr-end[0]) + Math.abs(nc-end[1]);
          heap.push([h, nr, nc]);
        }
      }
    }
  }
  return { explored, path: [], frontierSizes, found: false };
}

function solveAStar(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const heap = new MinHeap(); // [f, g, r, c]
  const h0 = Math.abs(start[0]-end[0]) + Math.abs(start[1]-end[1]);
  heap.push([h0, 0, start[0], start[1]]);
  const cost = new Int32Array(rows * cols).fill(9999999);
  const parent = new Int32Array(rows * cols).fill(-1);
  const sk = start[0] * cols + start[1];
  cost[sk] = 0;
  const explored = [], frontierSizes = [];
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];
  
  while (heap.size > 0) {
    frontierSizes.push(heap.size);
    const [f, g, r, c] = heap.pop();
    const k = r * cols + c;
    if (g > cost[k]) continue;
    explored.push([r, c]);
    
    if (r === end[0] && c === end[1]) {
      return { explored, path: buildPath(parent, start, end, cols), frontierSizes, found: true };
    }
    
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        const nk = nr * cols + nc;
        if (g + 1 < cost[nk]) {
          cost[nk] = g + 1;
          parent[nk] = k;
          const h = Math.abs(nr-end[0]) + Math.abs(nc-end[1]);
          heap.push([g + 1 + h, g + 1, nr, nc]);
        }
      }
    }
  }
  return { explored, path: [], frontierSizes, found: false };
}

function solveWallFollower(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const explored = [], frontierSizes = [];
  const path = [start];
  let r = start[0], c = start[1];
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]]; // R, D, L, U
  let d = 0; // face right initially
  
  const maxSteps = rows * cols * 4;
  let steps = 0;
  
  while (r !== end[0] || c !== end[1]) {
    if (steps++ > maxSteps) break;
    explored.push([r, c]);
    frontierSizes.push(1);
    
    // Try right, straight, left, back
    const turns = [1, 0, -1, 2];
    let moved = false;
    
    for (const t of turns) {
      const nd = (d + t + 4) % 4;
      const nr = r + DIRS[nd][0], nc = c + DIRS[nd][1];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        r = nr; c = nc; d = nd;
        path.push([r, c]);
        moved = true;
        break;
      }
    }
    if (!moved) break; // trapped
  }
  
  explored.push([r, c]);
  const found = (r === end[0] && c === end[1]);
  
  // Simplify path (remove loops) for final display
  const simplePath = [];
  const inPath = new Set();
  for (const p of path) {
    const k = p[0] + ',' + p[1];
    if (inPath.has(k)) {
      while (simplePath.length > 0) {
        const last = simplePath.pop();
        inPath.delete(last[0]+','+last[1]);
        if (last[0] === p[0] && last[1] === p[1]) {
          simplePath.push(last);
          inPath.add(k);
          break;
        }
      }
    } else {
      simplePath.push(p);
      inPath.add(k);
    }
  }
  
  return { explored, path: found ? simplePath : [], frontierSizes, found };
}

export const SOLVERS = {
  bfs: solveBFS, dfs: solveDFS, dijkstra: solveDijkstra, 
  gbfs: solveGBFS, astar: solveAStar, wall: solveWallFollower
};

export function countOperations(path) {
  const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];
  const ops = { straight: 0, left: 0, right: 0, uturn: 0 };
  if (path.length < 2) return ops;
  ops.straight = 1;
  for (let i = 2; i < path.length; i++) {
    const pdr = path[i-1][0] - path[i-2][0], pdc = path[i-1][1] - path[i-2][1];
    const cdr = path[i][0] - path[i-1][0], cdc = path[i][1] - path[i-1][1];
    const pi = DIRS.findIndex(d => d[0]===pdr && d[1]===pdc);
    const ci = DIRS.findIndex(d => d[0]===cdr && d[1]===cdc);
    const diff = ((ci - pi) % 4 + 4) % 4;
    if (diff === 0) ops.straight++;
    else if (diff === 1) ops.right++;
    else if (diff === 3) ops.left++;
    else if (diff === 2) ops.uturn++;
  }
  return ops;
}

