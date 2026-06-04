// --- PARTICLE BACKGROUND ---
const bgCanvas = document.getElementById('particles-bg');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];

function initParticles() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  particles = [];
  const colors = ['#00f0ff', '#8b5cf6', '#ec4899'];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * 0.3 + 0.1
    });
  }
}

function animateParticles() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  particles.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = bgCanvas.width;
    if (p.x > bgCanvas.width) p.x = 0;
    if (p.y < 0) p.y = bgCanvas.height;
    if (p.y > bgCanvas.height) p.y = 0;
    
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = p.c;
    bgCtx.globalAlpha = p.a;
    bgCtx.fill();
  });
  bgCtx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();

// --- APP STATE & LOGIC ---
const appState = {
  grid: null,
  mazeName: '',
  mazeType: '',
  mazeDim: 0,
  
  algo1: 'bfs',
  algo2: 'gbfs',
  compareMode: false,
  
  running: false,
  paused: false,
  speed: 5,
  
  sim1: { result: null, step: 0, startTs: 0, lastFrameTs: 0, timeSec: 0, done: false },
  sim2: { result: null, step: 0, startTs: 0, lastFrameTs: 0, timeSec: 0, done: false },
  
  reqId: null
};

const ren1 = new MazeRenderer('maze-canvas-1');
const ren2 = new MazeRenderer('maze-canvas-2');

// UI Elements
const els = {
  srcRadio: document.querySelectorAll('input[name="source"]'),
  srcDatasetCtrl: document.getElementById('source-dataset-ctrl'),
  srcGenCtrl: document.getElementById('source-generate-ctrl'),
  srcFileCtrl: document.getElementById('source-file-ctrl'),
  datasetSel: document.getElementById('dataset-select'),
  datasetSearch: document.getElementById('dataset-search'),
  dimSlider: document.getElementById('dim-slider'),
  dimVal: document.getElementById('dim-val'),
  btnGen: document.getElementById('btn-generate'),
  fileIn: document.getElementById('file-input'),
  
  algoBtns1: document.querySelectorAll('#algo-btns-1 button'),
  algoBtns2: document.querySelectorAll('#algo-btns-2 button'),
  compareToggle: document.getElementById('compare-mode-toggle'),
  algo2Container: document.getElementById('algo-2-container'),
  wrapper2: document.getElementById('canvas-wrapper-2'),
  stats2: document.getElementById('stats-2'),
  
  btnPlay: document.getElementById('btn-play'),
  btnPause: document.getElementById('btn-pause'),
  btnStop: document.getElementById('btn-stop'),
  btnSkip: document.getElementById('btn-skip'),
  speedSlider: document.getElementById('speed-slider'),
  speedVal: document.getElementById('speed-val'),
  speedBtns: document.querySelectorAll('.speed-btn')
};

function initUI() {
  // Source toggle
  els.srcRadio.forEach(r => r.addEventListener('change', (e) => {
    els.srcDatasetCtrl.style.display = e.target.value === 'dataset' ? 'block' : 'none';
    els.srcGenCtrl.style.display = e.target.value === 'generate' ? 'block' : 'none';
    els.srcFileCtrl.style.display = e.target.value === 'file' ? 'block' : 'none';
  }));

  // Dataset populate
  setTimeout(() => {
    if (typeof MAZE_DB !== 'undefined' && MAZE_DB.length > 0) {
      const renderSelect = (filterStr = '') => {
        const lowerFilter = filterStr.toLowerCase();
        let optionsHtml = '';
        let count = 0;
        for (let i = 0; i < MAZE_DB.length; i++) {
          const m = MAZE_DB[i];
          if (m.n.toLowerCase().includes(lowerFilter)) {
            optionsHtml += `<option value="${i}">${m.n} [${m.t==='p'?'Perfect':'Imperfect'}, dim:${m.d}]</option>`;
            count++;
          }
        }
        if (count === 0) optionsHtml = '<option value="">No matches found</option>';
        els.datasetSel.innerHTML = optionsHtml;
      };
      
      renderSelect();
      els.datasetSearch.addEventListener('input', e => renderSelect(e.target.value));
      
      loadFromDataset();
    } else {
      els.datasetSel.innerHTML = '<option>No dataset found (maze_data.js missing)</option>';
    }
  }, 500);

  els.datasetSel.addEventListener('change', loadFromDataset);
  
  // Generator
  els.dimSlider.addEventListener('input', e => els.dimVal.innerText = e.target.value);
  els.btnGen.addEventListener('click', () => {
    const dim = parseInt(els.dimSlider.value);
    const isPerf = document.querySelector('input[name="gen-type"]:checked').value === 'p';
    appState.grid = isPerf ? generatePerfectMaze(dim) : generateImperfectMaze(dim);
    appState.mazeName = 'Random Generated';
    appState.mazeType = isPerf ? 'perfect' : 'imperfect';
    appState.mazeDim = dim;
    resetSim();
  });

  // File Load
  els.fileIn.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const txt = ev.target.result;
      const lines = txt.split('\n').map(l => l.trim()).filter(l => l);
      appState.grid = lines.map(l => l.split(' ').map(Number));
      appState.mazeName = file.name;
      appState.mazeType = 'unknown';
      appState.mazeDim = Math.floor((lines.length - 1) / 2);
      resetSim();
    };
    reader.readAsText(file);
  });

  // Algorithms
  updateAlgoDesc('algo-desc-1', appState.algo1);
  updateAlgoDesc('algo-desc-2', appState.algo2);
  
  els.algoBtns1.forEach(b => b.addEventListener('click', e => {
    els.algoBtns1.forEach(x => x.classList.remove('active'));
    e.target.classList.add('active');
    appState.algo1 = e.target.dataset.algo;
    updateAlgoDesc('algo-desc-1', appState.algo1);
    document.getElementById('overlay-1').innerText = ALGO_INFO[appState.algo1].name;
    if(appState.grid) resetSim();
  }));
  
  els.algoBtns2.forEach(b => b.addEventListener('click', e => {
    els.algoBtns2.forEach(x => x.classList.remove('active'));
    e.target.classList.add('active');
    appState.algo2 = e.target.dataset.algo;
    updateAlgoDesc('algo-desc-2', appState.algo2);
    document.getElementById('overlay-2').innerText = ALGO_INFO[appState.algo2].name;
    if(appState.grid && appState.compareMode) resetSim();
  }));

  els.compareToggle.addEventListener('change', e => {
    appState.compareMode = e.target.checked;
    els.algo2Container.style.display = appState.compareMode ? 'block' : 'none';
    els.wrapper2.style.display = appState.compareMode ? 'flex' : 'none';
    els.stats2.style.display = appState.compareMode ? 'flex' : 'none';
    if(appState.grid) resetSim();
  });

  // Speed
  const updateSpeed = (val) => {
    appState.speed = val;
    let str = val;
    if(val == 99999) str = 'MAX';
    else if(val < 1000) str = 'x' + (val/5);
    els.speedVal.innerText = str;
    els.speedBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.val) === val));
    els.speedSlider.value = Math.log10(val) * 25; // approx reverse
  };
  els.speedBtns.forEach(b => b.addEventListener('click', e => updateSpeed(parseInt(e.target.dataset.val))));
  els.speedSlider.addEventListener('input', e => {
    const val = Math.floor(Math.pow(10, e.target.value / 25));
    updateSpeed(val);
  });

  // Playback
  els.btnPlay.addEventListener('click', startSim);
  els.btnPause.addEventListener('click', pauseSim);
  els.btnStop.addEventListener('click', resetSim);
  els.btnSkip.addEventListener('click', skipSim);
}

function decodeMaze(entry) {
  const bin = atob(entry.m);
  const grid = [];
  let bi = 0;
  for (let r = 0; r < entry.r; r++) {
    const row = [];
    for (let c = 0; c < entry.c; c++) {
      row.push((bin.charCodeAt(bi >> 3) >> (7 - (bi & 7))) & 1);
      bi++;
    }
    grid.push(row);
  }
  return grid;
}

function loadFromDataset() {
  const idx = els.datasetSel.value;
  if (idx === "") return;
  const entry = MAZE_DB[idx];
  appState.grid = decodeMaze(entry);
  appState.mazeName = entry.n;
  appState.mazeType = entry.t === 'p' ? 'perfect' : 'imperfect';
  appState.mazeDim = entry.d;
  resetSim();
}

function prepSimState(sim, algo, grid) {
  const rows = grid.length, cols = grid[0].length;
  sim.result = SOLVERS[algo](grid, [1,0], [rows-2, cols-1]);
  sim.step = 0;
  sim.timeSec = 0;
  sim.done = false;
  sim.ops = countOperations(sim.result.path);
}

function resetSim() {
  if(appState.reqId) cancelAnimationFrame(appState.reqId);
  appState.running = false;
  appState.paused = false;
  
  document.getElementById('overlay-1').innerText = ALGO_INFO[appState.algo1].name;
  document.getElementById('overlay-2').innerText = ALGO_INFO[appState.algo2].name;
  
  ren1.init(appState.grid);
  prepSimState(appState.sim1, appState.algo1, appState.grid);
  
  if (appState.compareMode) {
    ren2.init(appState.grid);
    prepSimState(appState.sim2, appState.algo2, appState.grid);
  }
  updateStatsUI();
}

function startSim() {
  if(!appState.grid) return;
  if(appState.sim1.done && (!appState.compareMode || appState.sim2.done)) resetSim();
  
  appState.running = true;
  appState.paused = false;
  const now = performance.now();
  appState.sim1.lastFrameTs = now;
  appState.sim2.lastFrameTs = now;
  if(appState.sim1.step === 0) appState.sim1.startTs = now;
  if(appState.sim2.step === 0) appState.sim2.startTs = now;
  
  appState.reqId = requestAnimationFrame(animate);
}

function pauseSim() {
  appState.paused = true;
}

function skipSim() {
  if(!appState.grid) return;
  appState.speed = 999999;
  if(!appState.running) startSim();
}

function advanceSim(sim, ren, timestamp) {
  if (sim.done) return;
  
  const dt = timestamp - sim.lastFrameTs;
  sim.timeSec += dt / 1000;
  sim.lastFrameTs = timestamp;
  
  let stepDone = 0;
  for (let i = 0; i < appState.speed && sim.step < sim.result.explored.length; i++) {
    sim.step++;
    stepDone++;
    ren.drawExploredCell(sim.result.explored[sim.step - 1], sim.step, sim.result.explored.length);
  }
  
  if(sim.step > 0) ren.drawBot(sim.result.explored[sim.step - 1]);
  
  sim.currSpeed = Math.floor(stepDone / (dt / 1000)) || 0;
  
  if (sim.step >= sim.result.explored.length) {
    sim.done = true;
    sim.currSpeed = 0;
    if(sim.result.found) ren.drawPath(sim.result.path);
  }
}

function animate(timestamp) {
  if (appState.running && !appState.paused) {
    advanceSim(appState.sim1, ren1, timestamp);
    if (appState.compareMode) advanceSim(appState.sim2, ren2, timestamp);
    
    updateStatsUI();
    
    if (appState.sim1.done && (!appState.compareMode || appState.sim2.done)) {
      appState.running = false;
    }
  }
  if (appState.running) appState.reqId = requestAnimationFrame(animate);
}

function updateStatsUI() {
  if(!appState.grid) return;
  const totalEmpty = appState.grid.flat().filter(x=>x===0).length;
  const r = appState.grid.length, c = appState.grid[0].length;
  
  const updatePanel = (idPrefix, sim) => {
    document.getElementById(`${idPrefix}-maze`).innerText = `${appState.mazeName} [${appState.mazeType}] ${r}x${c}`;
    
    const pct = (sim.step / totalEmpty * 100).toFixed(1);
    document.getElementById(`${idPrefix}-explored`).innerText = `${sim.step} / ${totalEmpty} (${pct}%)`;
    document.getElementById(`${idPrefix}-prog-fill`).style.width = `${pct}%`;
    
    if (sim.done) {
      const pathLen = sim.result.found ? sim.result.path.length : 0;
      document.getElementById(`${idPrefix}-path`).innerText = sim.result.found ? `${pathLen} steps` : 'NOT FOUND';
      document.getElementById(`${idPrefix}-path`).className = 'stat-value ' + (sim.result.found ? 'good' : 'highlight');
      document.getElementById(`${idPrefix}-ops`).innerText = sim.result.found ? `Str:${sim.ops.straight} L:${sim.ops.left} R:${sim.ops.right} U:${sim.ops.uturn}` : '-';
    } else {
      document.getElementById(`${idPrefix}-path`).innerText = '-';
      document.getElementById(`${idPrefix}-ops`).innerText = '-';
      document.getElementById(`${idPrefix}-path`).className = 'stat-value';
    }
    
    document.getElementById(`${idPrefix}-time`).innerText = sim.timeSec.toFixed(3) + 's';
    document.getElementById(`${idPrefix}-queue`).innerText = sim.result.frontierSizes[sim.step] || 0;
    document.getElementById(`${idPrefix}-speed`).innerText = (sim.currSpeed || 0) + ' steps/s';
  };

  updatePanel('s1', appState.sim1);
  if (appState.compareMode) updatePanel('s2', appState.sim2);
}

window.addEventListener('load', initUI);
window.addEventListener('resize', () => {
  if(appState.grid) {
    ren1.init(appState.grid);
    if(appState.compareMode) ren2.init(appState.grid);
  }
});

