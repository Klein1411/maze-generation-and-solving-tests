// --- RENDERER ---
class MazeRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.wrapper = this.canvas.parentElement;
    this.grid = null;
    this.cellSize = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastBot = null;

    this.scale = 1;
    this.tx = 0;
    this.ty = 0;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;

    this.wrapper.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = this.wrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoom = e.deltaY > 0 ? 0.9 : 1.1;
      this.tx = mouseX - (mouseX - this.tx) * zoom;
      this.ty = mouseY - (mouseY - this.ty) * zoom;
      this.scale *= zoom;
      this.updateTransform();
    });

    this.wrapper.addEventListener('mousedown', e => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.wrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.wrapper.style.cursor = 'default';
    });

    window.addEventListener('mousemove', e => {
      if (!this.isDragging) return;
      this.tx += e.clientX - this.lastX;
      this.ty += e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.updateTransform();
    });
  }

  updateTransform() {
    this.canvas.style.transformOrigin = '0 0';
    this.canvas.style.transform = `translate(${this.tx}px, ${this.ty}px) scale(${this.scale})`;
  }

  init(grid) {
    this.grid = grid;
    const rows = grid.length, cols = grid[0].length;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
    
    this.cellSize = Math.max(1, Math.floor(Math.min(this.canvas.width / cols, this.canvas.height / rows)));
    this.offsetX = Math.floor((this.canvas.width - cols * this.cellSize) / 2);
    this.offsetY = Math.floor((this.canvas.height - rows * this.cellSize) / 2);
    this.lastBot = null;
    
    this.scale = 1;
    this.tx = 0;
    this.ty = 0;
    this.updateTransform();

    this.drawBase();
  }

  drawBase() {
    const rows = this.grid.length, cols = this.grid[0].length;
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#0d0d2b';
    this.ctx.fillRect(this.offsetX, this.offsetY, cols * this.cellSize, rows * this.cellSize);
    
    this.ctx.fillStyle = '#00f0ff';
    if (this.cellSize > 3) {
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 2;
    }
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.grid[r][c] === 1) {
          this.ctx.fillRect(this.offsetX + c * this.cellSize, this.offsetY + r * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
    this.ctx.shadowBlur = 0;
    
    // Start / End
    this.ctx.fillStyle = '#00ff88';
    this.ctx.fillRect(this.offsetX + 0 * this.cellSize, this.offsetY + 1 * this.cellSize, this.cellSize, this.cellSize);
    this.ctx.fillStyle = '#ff6600';
    this.ctx.fillRect(this.offsetX + (cols-1) * this.cellSize, this.offsetY + (rows-2) * this.cellSize, this.cellSize, this.cellSize);
  }

  drawExploredCell(cell, index, total) {
    const [r, c] = cell;
    // Don't overwrite start/end
    if ((r===1 && c===0) || (r===this.grid.length-2 && c===this.grid[0].length-1)) return;
    
    const ratio = index / total;
    // color gradient: purple #8b5cf6 to pink #ec4899
    const rC = Math.floor(139 + (236 - 139) * ratio);
    const gC = Math.floor(92 + (72 - 92) * ratio);
    const bC = Math.floor(246 + (153 - 246) * ratio);
    
    this.ctx.fillStyle = `rgb(${rC}, ${gC}, ${bC})`;
    this.ctx.fillRect(this.offsetX + c * this.cellSize, this.offsetY + r * this.cellSize, this.cellSize, this.cellSize);
  }

  drawBot(cell) {
    if (!cell) return;
    if (this.lastBot) {
      // repaint last bot cell as explored to remove bot indicator
      // (assuming it was explored right before)
    }
    const [r, c] = cell;
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.shadowColor = '#fbbf24';
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(this.offsetX + c * this.cellSize, this.offsetY + r * this.cellSize, this.cellSize, this.cellSize);
    this.ctx.shadowBlur = 0;
    this.lastBot = cell;
  }

  drawPath(path) {
    this.ctx.fillStyle = '#ff0040';
    this.ctx.shadowColor = '#ff0040';
    this.ctx.shadowBlur = 8;
    for (const [r, c] of path) {
      if ((r===1 && c===0) || (r===this.grid.length-2 && c===this.grid[0].length-1)) continue;
      this.ctx.fillRect(this.offsetX + c * this.cellSize, this.offsetY + r * this.cellSize, this.cellSize, this.cellSize);
    }
    this.ctx.shadowBlur = 0;
  }
}

