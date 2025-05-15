import k from "../../Engine";

export default class SaveController<T extends object = any>
{
    private static dbName: string = "saveControl";
    private static storeName: string = "save";
    private static version: number = 1;

    public static currentSlot: string = "default";
    public static saveData: any = {};

    private static async getDB(): Promise<IDBDatabase> 
    {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.storeName))
                    db.createObjectStore(this.storeName, { keyPath: "id" });
            }

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    public static useSlot(name: string)
    {
        this.currentSlot = name;
    }

    public static async save(): Promise<void>
    {
        const db = await this.getDB();
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.put({ id: this.currentSlot, data: this.saveData });
        return new Promise((res, rej) => {
            tx.oncomplete = () => res();
            tx.onerror = () => rej(tx.error);
        });
    }

    public static async load(): Promise<any | undefined> 
    {
        const db = await this.getDB();
        return new Promise((res, rej) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.get(this.currentSlot);
            request.onsuccess = () => {
                const result = request.result;
                this.saveData = result?.data || {} as any;
                res(this.saveData);
            };
            request.onerror = () => rej(request.error);
        });
    }

    static async delete(): Promise<void> {
        const db = await this.getDB();
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.delete(this.currentSlot);
        this.saveData = {} as any;
        return new Promise((res, rej) => {
            tx.oncomplete = () => res();
            tx.onerror = () => rej(tx.error);
        });
    }
}