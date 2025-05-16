import * as JSZip from "jszip";
import k from "../Engine";
import FileController from "../Modules/FileController";
import background from "../Modules/Misc/Background";
import PopupController from "../Modules/Selector/PopupController";
import displayMessage from "../Modules/Misc/MessageController";

export const registers = {
    isMessageDisplaying: false,
}

k.scene("levelselect", () => {
    background(
        new k.Color(201, 115, 115),
        new k.Color(166, 85, 95)
    );

    displayMessage("Oh Hi!", "Idk how useful this could be :3");
    
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

    const popupImport = PopupController.addPopup({
        name: "Import chart",
        author: "",
        difficulty: 0,
        length: k.center().x,
        sharpness: 64,
        height: 128,
        difficultyLine: false,
        popupColor: k.rgb(74, 48, 82),
    });

    popupImport.action = async () => {
        const zipdata = await FileController.receiveFile("chart");
        if (zipdata === null)
        {
            displayMessage("Ops! Error Open out >:(", "An error occurred during the the level import\n please try again later")
            return;
        }

        const chartdata = await JSZip.loadAsync(zipdata);
        
        for (const [filename, filedata] of Object.entries(chartdata.files))
        {
            //console.log(filedata.);
        }
    };

    k.onUpdate(() => {
        PopupController.updatePopups();
    });

    k.onKeyPress((key) => {
        if (registers.isMessageDisplaying == true)
            return;

        if (key == "down")
            PopupController.updateScroll(1);
        if (key == "up")
            PopupController.updateScroll(-1);
        if (key == "enter")
            PopupController.updateClick();
    });

    k.onScroll((v) => {
        if (registers.isMessageDisplaying == true)
            return;

        if (v.y > 0)
            PopupController.updateScroll(1);
        if (v.y < 0)
            PopupController.updateScroll(-1);
    })
});