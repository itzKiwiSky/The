import k from "../Engine";

export default class FileController 
{
    public static async getJSON(): Promise<File> 
    {
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.style.display = "none";

        inputElement.accept = ".json";
        inputElement.click();

        return new Promise((resolve) => {
            inputElement.onchange = () => {
                resolve(inputElement.files[0]);
            };
            inputElement.oncancel = () => {
                resolve(null);
            };
        });
    }

    static async receiveFile(): Promise<File> 
    {
        let inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.style.display = "none";

        inputElement.accept = ".ogg,.wav,.mp3";
        inputElement.click();

        return new Promise((resolve) => {
            inputElement.onchange = () => {
                resolve(inputElement.files[0]);
                inputElement = null;
            };
            inputElement.oncancel = () => {
                resolve(null);
                inputElement = null;
            };
        });
    }

    static download(filename: string, data: string)
    {
        const pom = document.createElement('a');
        pom.style.display = "none";
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));

        pom.setAttribute('download', filename);
        document.body.appendChild(pom);
        pom.click();
        document.body.removeChild(pom);
    }
}