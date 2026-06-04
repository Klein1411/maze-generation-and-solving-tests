// --- MAZE GENERATOR ---
function generatePerfectMaze(dim) {
  const rows = 2 * dim + 1, cols = 2 * dim + 1;
  const grid = Array.from({length: rows}, () => new Array(cols).fill(1));
  const visited = Array.from({length: dim}, () => new Array(dim).fill(false));
  const stack = [[0, 0]];
  visited[0][0] = true;
  grid[1][1] = 0;
  
  const cellDirs = [[0,1],[1,0],[0,-1],[-1,0]];
  
  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    const neighbors = [];
    for (const [dr, dc] of cellDirs) {
      const nr = cr + dr, nc = cc + dc;
      if (nr >= 0 && nr < dim && nc >= 0 && nc < dim && !visited[nr][nc]) {
        neighbors.push([nr, nc, dr, dc]);
      }
    }
    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nr, nc, dr, dc] = neighbors[Math.floor(Math.random() * neighbors.length)];
      visited[nr][nc] = true;
      grid[1 + cr * 2 + dr][1 + cc * 2 + dc] = 0;
      grid[1 + nr * 2][1 + nc * 2] = 0;
      stack.push([nr, nc]);
    }
  }
  grid[1][0] = 0;
  grid[rows - 2][cols - 1] = 0;
  return grid;
}

function generateImperfectMaze(dim) {
  const grid = generatePerfectMaze(dim);
  const rows = grid.length, cols = grid[0].length;
  const wallsToRemove = Math.floor(dim * dim * 0.15);
  let removed = 0, attempts = 0;
  while (removed < wallsToRemove && attempts < wallsToRemove * 10) {
    const r = 2 + Math.floor(Math.random() * (rows - 4));
    const c = 2 + Math.floor(Math.random() * (cols - 4));
    if (grid[r][c] === 1) {
      grid[r][c] = 0;
      removed++;
    }
    attempts++;
  }
  return grid;
}

