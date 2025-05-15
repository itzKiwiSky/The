import k from "./Engine";
import "./Loader";
//@ts-ignore
import.meta.glob("./Scenes/*.ts", { eager: true });

const uuid = k.getData("clientID", crypto.randomUUID().toString());

k.add([
    k.pos(5, k.height() - 20),
    k.text("ClientID: " + uuid, {
        size: 18,
        align: "left",
        width: k.width()
    }),
    k.stay(),
    k.opacity(0.35),
    k.z(-Math.max()),
]);

k.onLoad(() => k.go("playscene"));