// --- ALGORITHM DATA ---
export const ALGO_INFO = {
  bfs: {
    name: 'Breadth-First Search', tag: 'UNINFORMED',
    desc: 'Explores all neighbors at current depth before moving deeper. Uses a FIFO queue.',
    pros: 'Guarantees shortest path', cons: 'High memory usage, explores many cells',
    time: 'O(V + E)', space: 'O(V)'
  },
  dfs: {
    name: 'Depth-First Search', tag: 'UNINFORMED',
    desc: 'Explores as far as possible along each branch before backtracking. Uses a LIFO stack.',
    pros: 'Low memory usage', cons: 'Does not guarantee shortest path',
    time: 'O(V + E)', space: 'O(V)'
  },
  dijkstra: {
    name: "Dijkstra's Algorithm", tag: 'WEIGHTED',
    desc: 'Finds shortest path using a priority queue ordered by cumulative cost.',
    pros: 'Guarantees shortest path', cons: 'Slower than BFS for uniform weights',
    time: 'O((V+E) log V)', space: 'O(V)'
  },
  gbfs: {
    name: 'Greedy Best-First Search', tag: 'INFORMED',
    desc: 'Uses Manhattan distance heuristic to always expand the node closest to the goal.',
    pros: 'Very fast in open spaces', cons: 'Does not guarantee shortest path, can be misled',
    time: 'O(V log V)', space: 'O(V)'
  },
  astar: {
    name: 'A* Search', tag: 'INFORMED',
    desc: 'Combines actual cost (g) with Manhattan distance heuristic (h).',
    pros: 'Guarantees shortest path, smarter than BFS', cons: 'Higher memory than GBFS',
    time: 'O((V+E) log V)', space: 'O(V)'
  },
  wall: {
    name: 'Wall Follower', tag: 'RULE-BASED',
    desc: 'Follows the right-hand wall. Simple physical strategy.',
    pros: 'Very simple, no memory needed', cons: 'Only works on perfect mazes, loops on imperfect',
    time: 'O(V)', space: 'O(1)'
  }
};

export function updateAlgoDesc(targetId, algoId) {
  const info = ALGO_INFO[algoId];
  const html = `
    <strong>${info.name}</strong> <span class="tag">${info.tag}</span><br>
    <div style="margin: 5px 0;">${info.desc}</div>
    <div style="color:var(--neon-green)">[+] ${info.pros}</div>
    <div style="color:var(--neon-red)">[-] ${info.cons}</div>
    <div style="margin-top: 5px; color:var(--neon-yellow)">Time: ${info.time} | Space: ${info.space}</div>
  `;
  document.getElementById(targetId).innerHTML = html;
}

