import { marked } from "marked";
import { useEffect, useState } from "react";
import { useExtnStore } from "../../zustand/store";

function useProductSOPs() {
  const [processflows, setProcessflows] = useState(null);
  const {
    htmlContents,
    project,
    repository,
    refreshSOPDBData,
    userSOPs,
    getFileContent,
  } = useExtnStore();

  // Iterate over all SOPs and get comntents
  // mock SOP

  const mockSOPs = () => {
    const sops = [];
    const sop1 = "<processflow name='QMS Document Structure'> </processflow>";
    sops.push(sop1);
    const sop2 =
      "<processflow name='Product Development Phases' order='0'> </processflow>";
    sops.push(sop2);
    const sop3 =
      "<processflow name='Design Controls' order='1'> </processflow>";
    sops.push(sop3);

    return sops;
  };

  const iterateSOPs = (sops) => {
    const sopsProcessFlow = [];
    for (let i = 0; i < sops.length; i++) {
      const md = sops[i].content;
      const parsedHtmlString = marked(md);

      const parser = new DOMParser();
      const doc = parser.parseFromString(parsedHtmlString, "text/html");

      const processflowElements = doc.getElementsByTagName("processflow");
      console.log(processflowElements);
      let order = null;
      if (processflowElements.length === 0) {
        console.log("Error! no processflow in the SOP!");
        //return null;
        //TODO: MAnage this error
      } else if (processflowElements.length > 1) {
        console.log("Error! more than 1 processflow in the SOP!");
        //return null;
        //TODO: MAnage this error
      } else {
        order = processflowElements[0].getAttribute("order"); // order is phase related
      }

      let orderInt = -1;
      if (order !== null) {
        orderInt = parseInt(order);
      }

      sopsProcessFlow.push({
        order: orderInt,
        processflowElement: processflowElements[0],
        sop: sops[i],
      });
    }

    sopsProcessFlow.sort(customSort);
    setProcessflows(sopsProcessFlow);
    //console.log(sopsProcessFlow);
  };

  // Custom comparator function for sorting
  function customSort(a, b) {
    // Handle the case when 'order' is -1
    if (a.order === -1) {
      return 1; // Move 'a' after 'b'
    } else if (b.order === -1) {
      return -1; // Move 'b' after 'a'
    } else {
      // Sort by 'order' value
      return a.order - b.order;
    }
  }

  const sopsWithOrder = async (sops) => {
    // sops = mockSOPs();
    iterateSOPs(sops);
  };

  async function loadFileContent(userSOPs) {
    const dataPromise = await userSOPs?.map(async (sop) => {
      const content = await getFileContent(
        repository.id,
        `/qms/${sop.type}/data.html`,
        sop.name
      );
      return { ...sop, content };
    });
    const data = await Promise.all(dataPromise);
    console.log(data);

    return data;
  }

  return { processflows, sopsWithOrder, loadFileContent };
}

export default useProductSOPs;
