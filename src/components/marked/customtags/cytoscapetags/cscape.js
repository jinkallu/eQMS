import cytoscape from "cytoscape";
//import cytoscape from "script-loader!cytoscape/dist/cytoscape";
//import 'script-loader!./cytoscape.js';
import dagre from "cytoscape-dagre";
cytoscape.use(dagre);

class CScape {
  init(newElement_id, element) {
    var container = document.createElement("div");
    container.id = newElement_id;
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.position = "relative";
    container.style.left = "0";
    container.style.top = "200px";

    try {
      const cy = cytoscape({
        container,
        elements: [],
        layout: { name: "dagre" }, // Use the layout of your choice
      });

      var edges = [];

      //const process = element.querySelector("processflow");
      const process_id = element.getAttribute("name");
      const process_label = process_id.replace(/_/g, " ");
      cy.add({
        group: "nodes",
        data: {
          id: process_id,
          label: process_label,
          type: "process",
        },
      });

      const steps = element.querySelectorAll("step");
      steps.forEach((step) => {
        let stepName = step.getAttribute("name");
        if (stepName === null) {
          stepName = "Error! Give proper step name";
          //throw new Error("This is an error message.");
        } else if (stepName.trim() === "") {
          stepName = "Error! Give proper step name";
        }

        cy.add({
          group: "nodes",
          data: {
            id: stepName,
            label: stepName.replace(/_/g, " "),
            type: "step",
            parent: process_id,
          },
        });

        const template = step.querySelector("template");
        if (template) {
          let template_name = template.getAttribute("name");
          if (template_name === null) {
            template_name = "Error! Give proper template name";
            //throw new Error("This is an error message.");
          } else if (template_name.trim() === "") {
            template_name = "Error! Give proper template name";
            //throw new Error("This is an error message.");
          }
          cy.add({
            group: "nodes",
            data: {
              id: `${stepName}_template`,
              label: template_name,
              type: "template",
              parent: process_id,
            },
          });

          cy.add([
            {
              group: "edges",
              data: {
                id: `edge_${stepName}_template`,
                source: stepName,
                target: `${stepName}_template`,
                parent: process_id,
              },
            },
          ]);
        }

        const condition = step.querySelector("connections");
        if (condition) {
          const condition_filed = condition.getAttribute("condition_field");
          cy.add({
            group: "nodes",
            data: {
              id: `${stepName}_condition`,
              label: condition_filed,
              type: "condition",
              parent: process_id,
            },
          });

          cy.add([
            {
              group: "edges",
              data: {
                id: `edge_${stepName}_${stepName}_condition`,
                source: stepName,
                target: `${stepName}_condition`,
                parent: process_id,
              },
            },
          ]);

          const connections = condition.querySelectorAll("connect");
          connections.forEach((connection) => {
            const nextNodeName = connection.getAttribute("to");
            const condition = connection.getAttribute("condition");
            const nextId = `edge_${stepName}_${condition}_${nextNodeName}`;
            const edge = {
              id: nextId,
              source: `${stepName}_condition`,
              target: nextNodeName,
              label: condition.replace(/_/g, " "),
              parent: process_id,
            };
            edges.push(edge);
          });
        } else {
          const nextElement = step.querySelector("connect");
          if (nextElement) {
            const nextNodeName = nextElement.getAttribute("to");
            const nextId = `edge_${stepName}_${nextNodeName}`;
            const edge = {
              id: nextId,
              source: stepName,
              target: nextNodeName,
              parent: process_id,
            };
            edges.push(edge);
          }
        }
      });
      edges.forEach((edge) => {
        cy.add([
          {
            group: "edges",
            data: {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              label: edge.label,
              parent: edge.process_id,
            },
          },
        ]);
      });

      cy.style()
        .selector("#edge1")
        .style({
          "line-color": "#ff0000", // red
          "target-arrow-color": "#ff0000", // red
          "target-arrow-shape": "triangle",
        })
        .update();

      /*const nexts = element.querySelectorAll("next");
            steps.forEach(step => {
                const stepName = step.getAttribute("name");
                if (stepName === null && stepName.trim() === '') {
                    stepName = "Error! Give proper step name";
                }

                cy.add([
                    { data: { id: 'edge1', source: 'node1', target: 'node2' } }
                ]);
            });*/

      //this.traverse(cy);

      return cy;
      //cy.layout().run();

      console.log("Cytoscape instance created successfully");
    } catch (error) {
      console.error("Error creating Cytoscape instance:", error);
      container.innerHTML = "";
      container.innerText = "Error in syntax!";
      return cy;
    }

    //console.log(cy);

    return container;
  }

  traverse(cy) {
    // Traverse nodes and edges
    cy.nodes().forEach((node) => {
      // You can access node data using node.data()

      // Traverse outgoing edges from the current node
      node
        .outgoers()
        .edges()
        .forEach((edge) => {});

      // Traverse incoming edges to the current node
      node
        .incomers()
        .edges()
        .forEach((edge) => {});

      // Traverse neighborhood (both nodes and edges) of the current node
      node.neighborhood().forEach((neighbour) => {});
    });
  }
}

export default CScape;
