import os, numpy as np, heapq, time

def load_maze(fp):
    with open(fp) as f: lines = f.readlines()
    return np.array([list(map(int,l.split())) for l in lines if l.strip()])

DIRS = [(0,1),(1,0),(0,-1),(-1,0)]

def gbfs(maze):
    rows,cols = maze.shape
    start,end = (1,0),(rows-2,cols-1)
    
    # Manhattan distance
    h = lambda r,c: abs(r-end[0])+abs(c-end[1])
    
    import itertools
    counter = itertools.count()
    heap = [(h(*start), next(counter), start[0], start[1], [start])]
    vis = set()
    
    while heap:
        _, _, r, c, path = heapq.heappop(heap)
        
        if (r,c) == end:
            return path
            
        if (r,c) in vis: continue
        vis.add((r,c))
        
        for dr, dc in DIRS:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and maze[nr,nc]==0 and (nr,nc) not in vis:
                heapq.heappush(heap, (h(nr,nc), next(counter), nr, nc, path+[(nr,nc)]))
                
    return None

def bfs(maze):
    rows,cols = maze.shape
    start,end = (1,0),(rows-2,cols-1)
    from collections import deque
    q = deque([(start, [start])])
    v = set([start])
    while q:
        (r,c), p = q.popleft()
        if (r,c)==end: return p
        for dr,dc in DIRS:
            nr,nc=r+dr,c+dc
            if 0<=nr<rows and 0<=nc<cols and maze[nr,nc]==0 and (nr,nc) not in v:
                v.add((nr,nc))
                q.append(((nr,nc), p+[(nr,nc)]))
    return None

files = sorted([f for f in os.listdir('imperfect_maze') if f.endswith('.txt')])[:100]
import pandas as pd
from tqdm import tqdm

total_gbfs = 0
total_bfs = 0
diffs = 0

start_time = time.time()
for fn in files:
    m = load_maze(os.path.join('imperfect_maze', fn))
    pb = bfs(m)
    pg = gbfs(m)
    if pb and pg:
        total_bfs += len(pb)
        total_gbfs += len(pg)
        if len(pb) != len(pg): diffs += 1
        
print(f"Time taken for 100 mazes: {time.time() - start_time:.2f}s")
print(f"Diff count: {diffs}/100")
print(f"Avg BFS: {total_bfs/100}")
print(f"Avg GBFS: {total_gbfs/100}")
