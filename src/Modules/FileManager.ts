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

    public static async receiveFile(mode: "chart" | "audio" = "audio"): Promise<File> 
    {
        const modes = {
            ["chart"]: ".chart,.zip",
            ["audio"]: ".ogg,.wav,.mp3"
        };

        let inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.style.display = "none";

        if (modes[mode] == null)
            return;

        inputElement.accept = modes[mode];
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

    public static download(filename: string, data: string)
    {
        let pom = document.createElement('a');
        pom.style.display = "none";
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));

        pom.setAttribute('download', filename);
        document.body.appendChild(pom);
        pom.click();
        document.body.removeChild(pom);
        pom = null;
    }
}