import { Color, GameObj } from "kaplay";
import k from "../../Engine";

export default class PopupController
{
    static popups: Array<GameObj> = [];
    static difficultyColors: Array<Color> = [
        k.rgb(255, 195, 242),
        k.rgb(174, 226, 255),
        k.rgb(91, 166, 117),
        k.rgb(171, 221, 100),
        k.rgb(252, 239, 141),
        k.rgb(255, 184, 121),
        k.rgb(234, 98, 98),
        k.rgb(163, 40, 88),
        k.rgb(57, 9, 71),
        k.rgb(78, 24, 124),
        k.rgb(31, 16, 42),
    ];

    public static currentSelected: number = 0;
    public static scroll: number = 0;

    public static addPopup({
        name = "name",
        author = " author",
        difficulty = 2,
        length = 256,
        sharpness = 64,
        height = 96,
        popupColor = k.WHITE,
        fontSize = 40,
        lineWidth = 96,
        difficultyLine = true,
        action = () => {}
    } = {})
    {
        const popupBox = k.add([
            k.pos(0, 0),
            k.polygon([
                k.vec2(0, 0),
                k.vec2(length, 0),
                k.vec2(length - sharpness, height),
                k.vec2(0, height),
            ]),
            k.color(popupColor),
            k.outline(6, k.BLACK, 1),
            k.z(10),

            {
                name: name,
                author: author,
                difficulty: difficulty,
                selected: false,
                height: height,
                difficultyLine: difficultyLine,
                action: action
            },
        ]);

        if (difficultyLine)
        {
            const lineCol = popupBox.add([
                k.polygon([
                    k.vec2(length - lineWidth, 0),
                    k.vec2(length, 0),
                    k.vec2(length - sharpness , height),
                    k.vec2((length - sharpness) - lineWidth, height),
                ]),
                k.outline(6, k.BLACK, 1),
                k.color(this.difficultyColors[k.clamp(popupBox.difficulty - 1, 0, 9)]),
                k.z(11),

                "lineDifficulty"
            ]);
        }
        
        popupBox.add([
            k.pos(0, 6),
            k.text(popupBox.name, {
                size: fontSize,
                width: (length - (sharpness + lineWidth)) + fontSize,
                align: "right",
            }),
            k.z(12),
        ]);

        popupBox.add([
            k.pos(0, fontSize + Math.round(fontSize / 1.6)),
            k.text(popupBox.author, {
                size: Math.round(fontSize / 1.5),
                width: (length - (sharpness + lineWidth)) + Math.round(fontSize / 1.7) / 4,
                align: "right",
            }),
            k.z(13),
        ]);
        this.popups.push(popupBox);
        return popupBox
    }

    public static updateScroll(dir: -1 | 1): void
    {
        this.scroll += dir;
        this.scroll = k.clamp(this.scroll, 0, this.popups.length - 1);
    }

    public static updatePopups(): void
    {
        this.popups.forEach((popup, i, a) => {
            const dist = i - this.scroll;
            const y = k.center().y + dist * popup.height * 1.3;
            const selected = Math.round(this.scroll) === i;
            this.currentSelected = Math.round(this.scroll);

            popup.outline.color = selected === true ? k.WHITE : k.BLACK;

            if (popup.difficultyLine)
                this.popups[i].children[0].outline.color = selected === true ? k.WHITE : k.BLACK;

            popup.pos.y = k.lerp(popup.pos.y, y, 0.067);
            popup.pos.x = selected === true ? k.lerp(popup.pos.x, dist + k.wave(150, 180, k.time() * 2.2), 0.067) : k.lerp(popup.pos.x, dist, 0.067);
        });
    }
    
    public static updateClick(): void
    {
        this.popups[Math.round(this.scroll)].selected = true;
        this.popups[Math.round(this.scroll)].action();
    }
}