import k from "./Engine";
import "./Loader";
//@ts-ignore
import.meta.glob("./Scenes/*.ts", { eager: true });

k.add([
    k.pos(5, k.height() - 20),
    k.text("ClientID: " + crypto.randomUUID().toString(), {
        size: 18,
        align: "left",
        width: k.width()
    }),
    k.stay(),
    k.opacity(0.35),
    k.z(99999999),
]);

k.onLoad(() => k.go("levelselect"));