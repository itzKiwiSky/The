import k from "../Engine";
import background from "../Modules/Misc/Background";
import PopupController from "../Modules/Selector/PopupController";

k.scene("levelselect", () => {
    background(
        new k.Color(201, 115, 115),
        new k.Color(166, 85, 95)
    );
    
    k.init();
    k.logString("Oh hi");
    k.logWarn("Oh hi");
    k.logError("Oh hi");

    k.addCommand("say_hi", () => {
        k.logString("Oh hi!");
    });

    const titleText = k.add([
        k.pos(0, 16),
        k.text("Level selection", {
            size: 60,
            align: "center",
            letterSpacing: 0.05,
            width: k.width(),
        }),
        k.z(100),
    ]);

    const scoreboard = k.add([

    ]);

    for(let i = 0; i < 10; i++)
    {
        PopupController.addPopup({
            name: "Rat river",
            author: "Lemkuuja",
            difficulty: k.randi(1, 10),
            length: k.center().x,
            sharpness: 64,
            height: 128,
            popupColor: k.rgb(242, 174, 153),
        });
    }

    k.onUpdate(() => {
        PopupController.updatePopups();
    });

    k.onKeyPress((key) => {
        if (key == "down")
            PopupController.updateScroll(1);
        if (key == "up")
            PopupController.updateScroll(-1);
    });

    k.onScroll((v) => {
        //k.debug.log(v);\
        if (v.y > 0)
            PopupController.updateScroll(1);
        if (v.y < 0)
            PopupController.updateScroll(-1);
    })
});