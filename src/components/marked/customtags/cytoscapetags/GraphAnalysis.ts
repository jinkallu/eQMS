import TemplateOps from "./TemplateOps";
class GraphAnalysis {

    editTemplateExists() {

    }

    mainTemplateExists() {

    }

    async templateExists(template: string) {
        console.log(template);
        const exists = await TemplateOps.templateExists("QMSProject", "qms/sops/bb1eaf31-48fc-4deb-986e-392252accd11/main", "qms/sops/SOPs/SOPs.md");
        /*exists.then(res => {
            console.log(res);
            return res;
        }).catch(error => {
            console.error("Error:", error);
            return false;
        });*/
        return exists;
    }

    async templateFieldExists(field_id: string) {
        //return new Promise((resolve, reject) => {
        const res = await TemplateOps.templateFieldExists("QMSProject", "qms/sops/bb1eaf31-48fc-4deb-986e-392252accd11/main", "qms/sops/SOPs/SOPs.md", field_id)
        /*.then(res => {
            resolve(res);
        })
        .catch(error => {
            reject(error);
        });*/
        //});
        return res;
    }

    sopExists() {

    }

    async checkCondition(condition: string) {
        const parts = condition.split(".");
        const field_id = parts[parts.length - 1];
        const res = await this.templateFieldExists(field_id);
        return res;

    }

    async iterateSteps(process) {
        for (const step of process.children()) {
            console.log(step.id());
            switch (step.data("type")) {
                case "template":
                    this.templateExists(step.data("label"));
                    break;

                case "condition":
                    //step.data("result", "res");
                    try {
                        const res = await this.checkCondition(step.data("label"));

                        //const data = {...step.data, result:res};
                        //step = {...step, data};
                        console.log(res);
                        step.data("result", res);
                    } catch (error) {
                        // Handle the error here
                        console.error('Error adding data to the node:', error);
                    }
            }

            await this.iterateSteps(step);
        };
    }

    async iterateProcessElements(processElements) {
        for (const process of processElements) {
            //console.log(process);
            //process.data("test", "t");
            await this.iterateSteps(process);
        }
    }

    printNodesAndEdges(processElements) {
        processElements.forEach(function (element) {
            if (element.isNode()) {
                // This element is a node
                console.log('Node ID:', element.id());
                // You can access node data using element.data()
            } else if (element.isEdge()) {
                // This element is an edge
                console.log('Edge ID:', element.id());
                // You can access edge data using element.data()
            }
        });

    }
    async findProcesses(cy: any) {
        var processElements = cy.filter(function (element) {
            return element.data('type') === 'process';
        });
        return processElements;
    }

    async analyse(cy: any) {
        var processElements = await this.findProcesses(cy);

        await this.iterateProcessElements(processElements);
        console.log(cy);
    }
}

export default GraphAnalysis;