const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

let nodes = [];
let edges = [];
let nodeId = 1;

// 랜덤한 위치에 노드 추가
function addNode() {
  const x = Math.random() * (canvas.width - 40) + 20;
  const y = Math.random() * (canvas.height - 40) + 20;
  nodes.push({ id: nodeId++, x, y });
  drawGraph();
}

// 엣지 그리기
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  for (let node of nodes) {
    const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
    if (distance < 20) {
      // 엣지의 첫 노드일 때
      if (!edges.length || edges[edges.length - 1].length === 2) {
        edges.push([node.id]);
      // 엣지의 끝 노드일 때
      } else {
        const lastNode = edges[edges.length - 1][0];
        // 중복 방지: 동일한 엣지가 이미 존재하는지 확인
        if (!edges.some((edge) =>
            (edge[0] === lastNode && edge[1] === node.id) ||
            (edge[1] === lastNode && edge[0] === node.id)
        )) {
          edges[edges.length - 1].push(node.id);
        } else {
          // 중복된 엣지일 경우, 새로운 추가를 시도하지 않음
          edges.pop(); // 이전에 잘못 추가된 빈 배열 제거
        }
      }
      drawGraph();
      return;
    }
  }
});

// 그래프 그리기
function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 엣지 그리기
  for (let edge of edges) {
    if (edge.length === 2) {
      const node1 = nodes.find((n) => n.id === edge[0]);
      const node2 = nodes.find((n) => n.id === edge[1]);
      if (node1 && node2) {
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.stroke();
      }
    }
  }

  // 노드 그리기
  for (let node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'lightblue';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(node.id, node.x - 5, node.y + 5);
  }
}

// 그래프 리셋
function resetGraph() {
  nodes = [];
  edges = [];
  nodeId = 1;
  drawGraph();
  document.getElementById('output').textContent = '';
}

// 오일러서킷 1번 조건 확인
function hasEulerCircuit() {
  const degree = {};
  for (let node of nodes) {
    degree[node.id] = 0;
  }
  for (let edge of edges) {
    if (edge.length === 2) {
      degree[edge[0]]++;
      degree[edge[1]]++;
    }
  }
  // 모든 노드의 degree가 짝수면 True, 아니면 False
  return Object.values(degree).every((deg) => deg % 2 === 0);
}

// Find Euler Circuit
function findEulerCircuit() {
  // 오일러 서킷의 조건을 만족하지 않을 때
  if (!hasEulerCircuit()) {
    document.getElementById('output').textContent =
      'No Euler Circuit exists. All vertices must have even degree!';
    return;
  }

  const graph = {};
  nodes.forEach((node) => (graph[node.id] = []));
  edges.forEach(([u, v]) => {
    graph[u].push(v);
    graph[v].push(u);
  });

  const stack = [];
  const circuit = [];
  const visited_nodes = new Set(); // 2번 조건을 확인하기 위한 리스트
  //초기값은 첫 번째 노드
  let current = nodes[0].id;
  visited_nodes.add(current)

  // 스택에 노드가 남아있거나, 현재 노드가 이동할 엣지가 있는 경우 반복
  while (stack.length || graph[current].length) {
    if (!graph[current].length) { //현재 노드에 엣지가 없으면
      circuit.push(current); //서킷에 현재 노드 저장
      current = stack.pop(); //스택에서 이전 노드 꺼내오기
    } else { //현재 노드에 다음 엣지가 있으면
      stack.push(current); //스택에 현재 노드 넣기
      const next = graph[current].pop(); //다음으로 갈 노드 선택 (graph[current]의 마지막 노드 꺼내기)
      graph[next] = graph[next].filter((n) => n !== current); //다음 노드의 현재 노드로 가는 엣지도 없애줘야 함
      current = next;
      visited_nodes.add(current)
    }
  }
  circuit.push(current);

  //2번 조건 만족 여부
  if (visited_nodes.size === nodes.length) {
      document.getElementById('output').textContent =
        'Euler Circuit: ' + circuit.join(' → ');
    }
  else {
    document.getElementById('output').textContent =
      'No Euler Circuit exists. A graph must be a single connected component!';
    return;
  }

  }

