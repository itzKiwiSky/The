import k from "../Engine";
import background from "../Modules/Misc/Background";
import PopupController from "../Modules/Selector/PopupController";

k.scene("levelselect", () => {
    background(
        new k.Color(201, 115, 115),
        new k.Color(166, 85, 95)
    );
    
    k.init();

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
        k.pos(k.width() - 220, k.center().y),
        k.rect(360, 512, {
            radius: 24
        }),
        k.color(k.BLACK),
        k.opacity(0.5),
        k.anchor("center"),
    ]);

    scoreboard.onUpdate(() => {
        if (PopupController.currentSelected > 0)
        {
            scoreboard.pos.x = k.lerp(scoreboard.pos.x, k.width() - 220, 0.1);
            return;
        }

        scoreboard.pos.x = k.lerp(scoreboard.pos.x, k.width() + 220, 0.1);

    });

    PopupController.addPopup({
        name: "Import chart",
        author: "",
        difficulty: 0,
        length: k.center().x,
        sharpness: 64,
        height: 128,
        difficultyLine: false,
        popupColor: k.rgb(74, 48, 82),
    });

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
        if (key == "enter")
            PopupController.updateClick();
    });

    k.onScroll((v) => {
        //k.debug.log(v);\
        if (v.y > 0)
            PopupController.updateScroll(1);
        if (v.y < 0)
            PopupController.updateScroll(-1);
    })
});