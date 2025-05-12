import k from "./Engine";
import "./Loader";
//@ts-ignore
import.meta.glob("./Scenes/*.ts", { eager: true });

k.onLoad(() => k.go("levelselect"));