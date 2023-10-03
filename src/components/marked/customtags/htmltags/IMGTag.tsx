import MarkedAzureSDK from "../../MarkedAzureSDK";
import { GetBranchFile } from "./GetBranchFile";

class IMGTag {
    static registerCondition() {
        console.log("Calling register");
        MarkedAzureSDK.register('img', (element: Element, container_id: string) => {
            return IMGTag.parse(element, container_id);
        });
    }

    static async parse(element: Element, container_id: string): Promise<HTMLElement | null> {
        return new Promise((resolve, reject) => {
            if (element instanceof HTMLImageElement) {
                console.log("IMG is an instance of HTMLImageElement");

                const srcParts = element.src.split('/');
                if (srcParts.length < 1){
                    console.error("Errorr in image path", srcParts);
                    resolve(null);
                }
                const fileName = srcParts.pop(); // Gets the file name

                console.log(fileName);
                // Create a new Image object
                const dynamicImage = new Image();

                // Fetch the image file asynchronously
                GetBranchFile.getFile("QMSProject", "qms/sop/1b96be58-ec2c-4221-83ac-233e634177a4/main", "qms/sop/sop-109-iii--lllsldf/uploads/" + fileName)
                    .then(imgFile => {
                        const uint8Array = new Uint8Array(imgFile);
                        const dataURL = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, uint8Array))}`;

                        // Set the source (src) of the dynamic image
                        dynamicImage.src = dataURL;

                        // Once the dynamic image has loaded, resolve the promise with the HTMLImageElement
                        dynamicImage.onload = function () {
                            element.src = dynamicImage.src;
                            resolve(element);
                        };

                        // If there's an error loading the image, reject the promise with null
                        dynamicImage.onerror = function () {
                            console.error("Error loading the image.");
                            resolve(null);
                        };
                    })
                    .catch(error => {
                        console.error("Error fetching the image:", error);
                        resolve(null);
                    });
            } else {
                // If the element is not an HTMLImageElement, resolve the promise with null
                resolve(null);
            }
        });
    }
}

export default IMGTag;