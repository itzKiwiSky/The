import k from "../../Engine";

export default class SaveController
{
    public slotName: string;
    private savedata: any = {};

    constructor(slotname: string)
    {
        k.setData(slotname.toString(), JSON.stringify(this.savedata).toString());
    };

    public addValue(key: string, value: any)
    {
        this.savedata[key] = value;
    }
}