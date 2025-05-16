import k from "../../Engine";
import { registers } from "../../Scenes/LevelSelectScene";

export default function displayMessage(title: string, message: string)
{
    registers.isMessageDisplaying = true;

    const messageDisplay = k.add([
        k.rect(k.width(), k.height()),
        k.color(k.BLACK),
        k.opacity(0.5),
        k.z(-Math.max())
    ]);

    messageDisplay.add([
        k.pos(0, 96),
        k.text(title, {
            size: 52,
            width: k.width(),
            align: "center"
        })
    ]);

    const messageContent = messageDisplay.add([
        k.pos(0, 0),
        k.text(message, {
            size: 32,
            width: k.width(),
            align: "center"
        })
    ]);

    messageDisplay.add([
        k.pos(0, k.height() - 200),
        k.text(`Press (ACCEPT) to close this message`, {
            size: 28,
            width: k.width(),
            align: "center"
        })
    ]);
    
    messageContent.pos.y = k.center().y;

    messageDisplay.onButtonPress("accept", () => {
        messageDisplay.fadeOut(0.75).onEnd(() => {
            messageDisplay.destroy();
            registers.isMessageDisplaying = false;
        });
    });

    return messageDisplay;
}