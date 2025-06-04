class PuzzleSolver {
    constructor(initialState) {
      this.initialState = initialState;
      this.goalState = this.createGoalState();
    }
  
    createGoalState() {
      let goal = [];
      for (let i = 0; i < 15; i++) goal.push(i + 1);
      goal.push(0);
      return goal;
    }
  
    manhattanDistance(state) {
      let distance = 0;
      for (let i = 0; i < 16; i++) {
        if (state[i] !== 0) {
          let correctIndex = state[i] - 1;
          let currentRow = Math.floor(i / 4);
          let currentCol = i % 4;
          let correctRow = Math.floor(correctIndex / 4);
          let correctCol = correctIndex % 4;
          distance += Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);
        }
      }
      return distance;
    }
  
    getNeighbors(state) {
      let neighbors = [];
      let zeroIndex = state.indexOf(0);
      let row = Math.floor(zeroIndex / 4);
      let col = zeroIndex % 4;
      
      const moves = {
        up: zeroIndex - 4,
        down: zeroIndex + 4,
        left: zeroIndex - 1,
        right: zeroIndex + 1,
      };
  
      for (let move in moves) {
        if (this.isValidMove(move, row, col)) {
          let newState = [...state];
          [newState[zeroIndex], newState[moves[move]]] = [newState[moves[move]], newState[zeroIndex]];
          neighbors.push({ state: newState, move });
        }
      }
      return neighbors;
    }
  
    isValidMove(move, row, col) {
      return (
        (move === "up" && row > 0) ||
        (move === "down" && row < 3) ||
        (move === "left" && col > 0) ||
        (move === "right" && col < 3)
      );
    }
  
    solve() {
      let openSet = [{ state: this.initialState, g: 0, h: this.manhattanDistance(this.initialState), path: [] }];
      let visited = new Set();
  
      while (openSet.length > 0) {
        openSet.sort((a, b) => a.g + a.h - (b.g + b.h));
        let current = openSet.shift();
  
        if (JSON.stringify(current.state) === JSON.stringify(this.goalState)) {
          return { moves: current.g, path: current.path };
        }
  
        visited.add(JSON.stringify(current.state));
  
        for (let { state: neighborState, move } of this.getNeighbors(current.state)) {
          if (!visited.has(JSON.stringify(neighborState))) {
            openSet.push({
              state: neighborState,
              g: current.g + 1,
              h: this.manhattanDistance(neighborState),
              path: [...current.path, move],
            });
          }
        }
      }
  
      return { moves: -1, path: [] };
    }
  }
  
  export default PuzzleSolver;
  