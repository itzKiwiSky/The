import { Vec2, Game, GameObj, Comp, PosComp, AreaComp } from "kaplay";
import k from "../Engine";


export type WindowCompOpt = {
    position?: Vec2,
    size?: Vec2,
    windowBorder?: string
}

export interface WindowComp extends Comp {
    titlebar: GameObj;
    panel: GameObj;
    title: string;
}

export default function newWindow(title: string, opt: WindowCompOpt): GameObj<PosComp | AreaComp | WindowComp> {
    const dimensions = k.formatText({ text: title, size: 20 });
    const position = opt.position || k.vec2();
    const size = opt.size || k.vec2();
    const windowBorder = opt.windowBorder || "button";

    const window = k.add([
        k.pos(position),
        k.sprite(windowBorder, { width: size.x + 4, height: 2 + 25 + 2 + size.y + 2 }),
        k.area()
    ]) as any;

    const titlebar = window.add([
        k.pos(2, 2),
        k.rect(size.x + 4, 25),
        k.area(),
        k.color(80, 80, 255),
        k.ui({ type: "dragitem", proxy: window, bringToFront: true })
    ]);

    const label = titlebar.add([
        k.pos(4, 14),
        k.text(title, {
            size: 20
        }),
        k.anchor("left")
    ])

    const panel = window.add([
        k.pos(2, 2 + 25 + 2),
        k.rect(size.x, size.y),
        k.color(k.WHITE),
        k.opacity(1.0),
        k.layout({ type: "column", padding: 5, spacing: 5, columns: 2, maxWidth: 170 })
    ]);

    window.use({
        id: "window",
        get titlebar() { return titlebar },
        get panel() { return panel },
        get title() { return label.text; },
        set title(value) { label.text = value; }
    });

    return window;
}