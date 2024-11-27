# eulerian_circuit

===
# Conditions for establishing Eulerian Circuit 
1. All vertices must have even degree.
2. A graph must be a single connected component!

===
# Logic

1. Check Conditions.
2. DFS
   a. If there is an edge to move from the current node, push the current node to the stack and           move along the edge.
   b. Delete the traversed edge.
   c. If there are no edges to move, add the node to the circuit and pop from the stack
      (return to the previous node).
   d. Explore all the edges.
