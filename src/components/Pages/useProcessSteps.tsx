import { useState } from "react";

const useProcessSteps = () => {
  const [stepTree, setStepTree] = useState(null);

  // find the step which has no parent (sourceid !== targetid)
  const initialStep = (edges) => {
    for (let i = 0; i < edges.length; i++) {
      const srcEdge = edges[i];
      for (let j = 0; j < edges.length; j++) {
        const tgtEdge = edges[j];
        if (srcEdge.source === tgtEdge.target) {
          continue;
        }
      }
      return srcEdge.source;
    }
  };

  const findStepWithId = (id, nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        return nodes[i];
      }
    }
  };

  const findStepsWithSrcNodeId = (srcId, nodes, edges) => {
    const edgesWithSrc = [];
    for (let i = 0; i < edges.length; i++) {
      if (srcId === edges[i].source) {
        edgesWithSrc.push(edges[i]);
      }
    }

    const nodesWithSrc = [];
    for (let i = 0; i < edgesWithSrc.length; i++) {
      const tgtId = edgesWithSrc[i].target;

      for (let j = 0; j < nodes.length; j++) {
        const nodeId = nodes[j].id;
        if (nodeId === tgtId) {
          nodesWithSrc.push(nodes[j]);
          break;
        }
      }
    }

    return nodesWithSrc;
  };

  const createTree = (step, parent) => {
    const tree = {
      name: step.id,
      // stepElm: stepElm,
      templateName: step.data.templateName,
      templateId: step.data.templateId,
      type: step.data.type,
      data: step.data,
      parent: parent,
      children: [],
    };
    return tree;
  };

  const traverse = (id, nodes, edges, tree) => {
    const srcNodes = findStepsWithSrcNodeId(id, nodes, edges);
    for (let i = 0; i < srcNodes.length; i++) {
      const childTree = createTree(srcNodes[i], tree);
      // remove looping, in the case of conditional jump to a previous step
      let parent = tree.parent;
      let isLoop = false;
      while (parent) {
        if (childTree.name === parent.name) {
          isLoop = true;
          break;
        }
        parent = parent.parent;
      }
      if (!isLoop) {
        const populatedChildTree = traverse(
          childTree.name,
          nodes,
          edges,
          childTree
        );
        tree.children.push(populatedChildTree);
      }
      else{
        tree.children.push(childTree);
      }
    }

    return tree;
  };

  const createStepTree = (nodes, edges, sopId) => {
    try {
      let initStepId = initialStep(edges);
      if (!initStepId) {
        if (nodes.length > 0) {
          initStepId = nodes[0].id;
        }
      }
      const step = findStepWithId(initStepId, nodes);
      const tree = createTree(step, null);
      const finalTree = traverse(tree.name, nodes, edges, tree);
      setStepTree({ sopId: sopId, steps: [finalTree] });
    } catch (e) {
      console.log(e);
      setStepTree({ sopId, steps: [] });
    }
  };

  return { stepTree, createStepTree };
};

export default useProcessSteps;
