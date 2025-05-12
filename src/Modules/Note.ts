import k from "../Engine";
import { editorState, getStrumTime, posYFromStrum } from "../Scenes/EditorScene";

export default function createNote(colorID: number, x: number, strumTime: number)
{
    const keys = [ "A", "S", "D", "F", "H", "J", "K", "L" ];

    const note = k.add([
        k.pos(x, posYFromStrum(strumTime)),
        k.sprite("tiles", {
            frame: colorID
        }),
        k.area(),
        k.anchor("center"),
        k.offscreen(),

        {
            time: strumTime,
            colorID: colorID,
            hit: false,
            getRepresentation()
            {
                return {
                    x: x,
                    y: posYFromStrum(strumTime),
                    time: strumTime,
                    noteid: colorID,
                };
            }
        }
    ]);

    note.onDraw(() => {
        k.drawText({
            text: keys[note.colorID],
            size: 48,
            font: "happy-o",
            pos: k.vec2(-note.width / 2 + 16, -note.height / 2 + 10),
            align: "center",
            color: k.WHITE,
        })
    });

    editorState.notesObjects.push(note);

    return note;
}