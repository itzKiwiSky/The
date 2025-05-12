import { Vec2 } from "kaplay";
import k from "../Engine";
import { UIOrientation } from "../Plugins/KaplayUI";

export type SliderCompOpt = {
    position?: Vec2,
    size?: Vec2,
    label?: string,
    orientation?: UIOrientation
};

export default function newSlider(parent, opt: SliderCompOpt) {
    const position = opt.position || k.vec2();
    const size = opt.size || k.vec2();
    const label = opt.label || "";
    const orientation = opt.orientation || "horizontal";

    if (orientation === "horizontal") {
        size.x = Math.max(100, size.x);
        size.y = Math.max(20, size.y)
    }
    else {
        size.x = Math.max(20, size.x);
        size.y = Math.max(100, size.y)
    }

    const dimensions = k.formatText({ text: label, size: 20 })
    const slider = parent.add([
        k.rect(size.x, size.y + dimensions.height),
        k.pos(position),
        k.fixed(),
        k.area(),
        k.color(k.WHITE),
        k.outline(1, k.WHITE)
    ]);
    let y = 0;
    if (label && label != "") {
        slider.add([
            k.text(label, {
                size: 20
            }),
            k.pos(0, 10),
            k.fixed(),
            k.anchor("left"),
            k.color(k.WHITE)
        ])
        y += dimensions.height;
    }
    const gutter = slider.add([
        orientation === "horizontal" ?
            k.sprite("button", { width: slider.width - 8, height: 4 }) :
            k.sprite("button", { width: 4, height: slider.height - 8 }),
        orientation === "horizontal" ?
            k.pos(4, y + 8) : k.pos(8, y + 4),
    ]);
    const thumb = slider.add([
        orientation === "horizontal" ?
            k.sprite("button", { width: 10, height: slider.height - 4 }) :
            k.sprite("button", { width: slider.width - 4, height: 10, frame: 1 },),
        k.pos(2, y + 2),
        k.area(),
        k.fixed(),
        k.ui({ type: "sliderthumb", orientation })
    ]);
    // Proxy so we can use slider directly
    slider.use({
        id: "slider",
        get thumb() { return thumb },
        get gutter() { return gutter },
        get value() { return thumb.value; },
        set value(value) { thumb.value = value },
        onValueChanged(cb) { thumb.onValueChanged(cb) },
    });

    thumb.onFocus(() => { slider.outline.color = k.BLACK; });
    thumb.onBlur(() => { slider.outline.color = k.WHITE; });

    return slider
}