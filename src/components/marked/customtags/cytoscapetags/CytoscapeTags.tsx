import CScape from './cscape';
import MarkedAzureSDK from '../../MarkedAzureSDK';
import Diagram from '../mxgraphtags/diagram';
import GraphAnalysis from "./GraphAnalysis"


class CytoscapeTags {
    static registerCondition() {
        MarkedAzureSDK.register('processflow', (element: Element, container_id: string) => {
            return CytoscapeTags.parse(element, container_id);
        });
    }

    static async parse(element: Element, newElement_id: string): Promise<HTMLElement | null> {
        try {
            const cScape = new CScape();
            const cy = cScape.init(newElement_id, element);


            const gAnalysis = new GraphAnalysis();
            const diagram = new Diagram();
            var container_dgm = document.createElement('div');
            container_dgm.id = `${newElement_id}_dgm`;

            await Promise.all([
               await gAnalysis.analyse(cy)
            ]);
            //await cy;
            diagram.processflowFromCytoscape(cy, container_dgm)


            return container_dgm;
        }
        catch {
            return null;
        }
    }
}

export default CytoscapeTags;