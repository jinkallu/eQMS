import FILOQueue from "./FILOQueue";

export default class FieldChar {
    private filoQueue: FILOQueue<{ type: string; instruction: string }>;

    constructor() {
        this.filoQueue = new FILOQueue<{ type: string; instruction: string }>();
    }

    processFieldChar(fieldXML) {
        const fldCharType = fieldXML.getAttribute('w:fldCharType')
        console.log(fldCharType);
        switch(fldCharType){

            case "begin":
                this.filoQueue.enqueue({type: fldCharType, instruction: ""});
            break;

            case "end":
                const field = this.filoQueue.dequeue();
                console.log(field);

                //this.filoQueue.enqueue({type: fldCharType, instruction: ""});
            break;
        }
    }

    processInstrText(instrText){
        if(this.filoQueue.isEmpty()){
            console.log("Error! Instruction without begin")
            return;
        }
        const instruction = instrText.innerHTML;
        this.filoQueue.updateLastObject({instruction: instruction});
        console.log(instrText);
    }

    isProcessing(){
        return !this.filoQueue.isEmpty();
    }
}
