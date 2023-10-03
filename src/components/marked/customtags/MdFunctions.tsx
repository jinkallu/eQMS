
class MdFunctions {
    private static callbacks: { parentId: string, callback: (pId: string) => any }[] = [];

    static register(parentId: string, callback: (pId: string) => any) {
      MdFunctions.callbacks.push({ parentId, callback });
    }

    static implmentEvents(parentId: string){
        for (const item of MdFunctions.callbacks) {
            if (item.parentId === parentId){
                console.log(parentId);
                item.callback(parentId);
            }
        }
    }
    
    /*static handleFileSelect(event) {
        console.log("File selected", event);
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result as string;
                event.target.parentElement.appendChild(imgElement);
            };

            reader.readAsDataURL(file);
        }
        else{
            console.log("File read error");
        }
    }

    static registerEvents(parentid: string) {
        const parentElement = document.getElementById(parentid);
        const fileInputElements = parentElement.querySelectorAll('input[type="file"]');
        fileInputElements.forEach((fileInputElement) => {
            fileInputElement.addEventListener('change', MdFunctions.handleFileSelect);
        });
    }*/
}

export default MdFunctions;