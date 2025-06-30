import React, { useState } from 'react';
import '../styles/App.css';

const numRows = 12;
const numCols = 24;

// Функція створює сітку (grid) з урахуванням старту, фінішу та стін
function createGrid(start, end, walls) {
  const grid = [];
  for (let r = 0; r < numRows; r++) {
    const row = [];
    for (let c = 0; c < numCols; c++) {
      row.push({
        row: r,
        col: c,
        isStart: r === start.row && c === start.col, // Чи є ця клітинка стартом
        isEnd: r === end.row && c === end.col,       // Чи є ця клітинка фінішем
        isWall: walls.some(w => w.row === r && w.col === c), // Чи є ця клітинка стіною
        isPath: false,      // Чи є ця клітинка частиною знайденого шляху
        isVisited: false    // Чи була ця клітинка відвідана під час пошуку
      });
    }
    grid.push(row);
  }
  return grid;
}

// BFS (Пошук в ширину) для знаходження найкоротшого шляху
function bfs(grid, start, end, setGrid) {
  // Черга для зберігання шляхів (кожен елемент — шлях від старту до поточної клітинки)
  const queue = [[start]];
  // Масив для відмітки відвіданих клітинок
  const visited = Array(numRows).fill().map(() => Array(numCols).fill(false));
  visited[start.row][start.col] = true;
  while (queue.length) {
    const path = queue.shift(); // Беремо перший шлях з черги
    const { row, col } = path[path.length - 1]; // Остання клітинка в поточному шляху
    if (row === end.row && col === end.col) {
      // Якщо дійшли до фінішу — позначаємо шлях
      setGrid(g => g.map((r, i) => r.map((cell, j) => ({ ...cell, isPath: path.some(p => p.row === i && p.col === j) }))));
      return;
    }
    // Перевіряємо всіх сусідів (вправо, вниз, вліво, вгору)
    for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const nr = row + dr, nc = col + dc;
      // Перевіряємо, що сусід в межах сітки, не відвіданий і не стіна
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols && !visited[nr][nc] && !grid[nr][nc].isWall) {
        visited[nr][nc] = true;
        queue.push([...path, { row: nr, col: nc }]); // Додаємо новий шлях у чергу
        setGrid(g => g.map((r, i) => r.map((cell, j) => (i === nr && j === nc ? { ...cell, isVisited: true } : cell))));
      }
    }
  }
}

// DFS (Пошук в глибину) для знаходження шляху
function dfs(grid, start, end, setGrid) {
  // Стек для зберігання шляхів (кожен елемент — шлях від старту до поточної клітинки)
  const stack = [[start]];
  // Масив для відмітки відвіданих клітинок
  const visited = Array(numRows).fill().map(() => Array(numCols).fill(false));
  visited[start.row][start.col] = true;
  while (stack.length) {
    const path = stack.pop(); // Беремо останній шлях зі стеку
    const { row, col } = path[path.length - 1]; // Остання клітинка в поточному шляху
    if (row === end.row && col === end.col) {
      setGrid(g => g.map((r, i) => r.map((cell, j) => ({ ...cell, isPath: path.some(p => p.row === i && p.col === j) }))));
      return;
    }
    // Перевіряємо всіх сусідів (вправо, вниз, вліво, вгору)
    for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const nr = row + dr, nc = col + dc;
      // Перевіряємо, що сусід в межах сітки, не відвіданий і не стіна
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols && !visited[nr][nc] && !grid[nr][nc].isWall) {
        visited[nr][nc] = true;
        stack.push([...path, { row: nr, col: nc }]); // Додаємо новий шлях у стек
        setGrid(g => g.map((r, i) => r.map((cell, j) => (i === nr && j === nc ? { ...cell, isVisited: true } : cell))));
      }
    }
  }
}

const PathfindingVisualizer = () => {
  const [start, setStart] = useState({ row: 2, col: 2 });
  const [end, setEnd] = useState({ row: 9, col: 20 });
  const [walls, setWalls] = useState([]);
  const [grid, setGrid] = useState(() => createGrid(start, end, walls));
  const [mode, setMode] = useState('wall');
  const [algo, setAlgo] = useState('bfs');

  // Оновлення сітки при зміні стін, старту, фінішу
  React.useEffect(() => {
    setGrid(createGrid(start, end, walls));
  }, [start, end, walls]);

  // Клік по клітинці
  const handleCellClick = (row, col) => {
    if (mode === 'wall') {
      // Додаємо або видаляємо стіну
      if (walls.some(w => w.row === row && w.col === col)) {
        setWalls(walls.filter(w => !(w.row === row && w.col === col)));
      } else {
        setWalls([...walls, { row, col }]);
      }
    } else if (mode === 'start') {
      // Встановлюємо нову стартову позицію
      setStart({ row, col });
    } else if (mode === 'end') {
      // Встановлюємо нову фінішну позицію
      setEnd({ row, col });
    }
  };

  // Запуск алгоритму пошуку
  const handleRun = () => {
    // Скидаємо всі позначки шляху та відвіданих клітинок
    setGrid(g => g.map(row => row.map(cell => ({ ...cell, isVisited: false, isPath: false }))));
    setTimeout(() => {
      if (algo === 'bfs') bfs(grid, start, end, setGrid);
      else dfs(grid, start, end, setGrid);
    }, 50);
  };

  // Скидання всіх стін та шляху
  const handleReset = () => {
    setWalls([]);
    setGrid(createGrid(start, end, []));
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-12 text-[#b3d9ff] font-sans px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Pathfinding Visualization (BFS/DFS)</h2>
      <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
        <button onClick={() => setMode('wall')} className={`px-4 py-2 rounded font-bold border border-[#b3d9ff] text-lg ${mode === 'wall' ? 'bg-[#b3d9ff] text-[#222b3a]' : 'bg-transparent text-[#b3d9ff]'} transition-colors`}>
          Walls
        </button>
        <button onClick={() => setMode('start')} className={`px-4 py-2 rounded font-bold border border-[#b3d9ff] text-lg ${mode === 'start' ? 'bg-[#b3d9ff] text-[#222b3a]' : 'bg-transparent text-[#b3d9ff]'} transition-colors`}>
          Start
        </button>
        <button onClick={() => setMode('end')} className={`px-4 py-2 rounded font-bold border border-[#b3d9ff] text-lg ${mode === 'end' ? 'bg-[#b3d9ff] text-[#222b3a]' : 'bg-transparent text-[#b3d9ff]'} transition-colors`}>
          End
        </button>
        <select value={algo} onChange={e => setAlgo(e.target.value)} className="ml-4 px-3 py-2 rounded border border-[#b3d9ff] font-bold bg-transparent text-[#b3d9ff] text-lg focus:outline-none">
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
        </select>
        <button onClick={handleRun} className="ml-4 px-6 py-2 rounded font-bold bg-[#b3d9ff] text-[#222b3a] border-none cursor-pointer text-lg">Run</button>
        <button onClick={handleReset} className="px-6 py-2 rounded font-bold border border-[#b3d9ff] bg-transparent text-[#b3d9ff] cursor-pointer text-lg">Reset</button>
      </div>
      <div className={`grid justify-center rounded-lg p-4 bg-[#1b3440]/40`} style={{ gridTemplateColumns: `repeat(${numCols}, 28px)` }}>
        {grid.map((row, r) => row.map((cell, c) => (
          <div
            key={r + '-' + c}
            onClick={() => handleCellClick(r, c)}
            className={`w-7 h-7 rounded border transition-colors cursor-pointer
              ${cell.isStart ? 'border-2 border-[#4FC3F7] bg-[#4FC3F7]' :
                cell.isEnd ? 'border-2 border-[#FFB300] bg-[#FFB300]' :
                cell.isWall ? 'border border-[#b3d9ff] bg-[#b3d9ff]' :
                cell.isPath ? 'border border-[#b3d9ff] bg-[#43a047]' :
                cell.isVisited ? 'border border-[#b3d9ff] bg-[#b3d9ff44]' :
                'border border-[#b3d9ff] bg-transparent'}
            `}
            title={cell.isStart ? 'Start' : cell.isEnd ? 'End' : cell.isWall ? 'Wall' : ''}
          />
        ))) }
      </div>
    </div>
  );
};

export default PathfindingVisualizer; 