class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1]) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList[vertex2]) {
      this.addVertex(vertex2);
    }
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }

  dfs(start, visited = new Set()) {
    visited.add(start);
    this.adjacencyList[start].forEach(neighbor => {
      if (!visited.has(neighbor)) {
        this.dfs(neighbor, visited);
      }
    });
    return visited;
  }

  bfs(start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    while (queue.length) {
      const vertex = queue.shift();
      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      });
    }
    return visited;
  }
}

export default Graph;
