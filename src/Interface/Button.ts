import k from "../Engine";

export default function newButton(parent, { 
    position = k.vec2(), 
    sprite = "", 
    frame = 0, 
    layout = { padding: [4, 2] }, 
    color = k.WHITE,
    outline = null,
    text = {
        label: "",
        color: k.WHITE,
        textsize: 20,
    }
} = {}) 
{

    const dimensions = k.formatText({ text: text.label, size: text.textsize ?? 20 })
    let width = dimensions.width + 16 + layout.padding[0] * 2
    let height = dimensions.height + layout.padding[1] * 2
    const button = parent.add([
        k.rect(width, height),
        k.pos(position),
        k.fixed(),
        k.area(),
        k.color(color),
        k.ui({ type: "button" })
    ]);

    if (outline != null)
        button.use([ k.outline(1, outline) ]);

    const buttonBg = button.add([
        k.sprite("button", { width: width - 2, height: height - 2 }),
        k.fixed(),
        k.pos(1, 1)
    ]);
    // Icon
    let icon;
    if (sprite) 
    {
        icon = button.add([
            k.pos(0, layout.padding[1] + dimensions.height),
            k.sprite(sprite, { frame: frame }),
            k.fixed(),
            k.anchor("top")
        ])
        width = Math.max(width, icon.width)
        height += icon.height
        icon.pos.x = width / 2;
    }
    // Label
    const textlabel = button.add([
        k.text(text.label, {
            size: text.textsize,
        }),
        k.pos(width / 2, (dimensions.height + layout.padding[1] * 2) / 2 + 1 + (icon ? icon.height : 0)),
        k.anchor("center"),
        k.fixed(),
        k.color(text.color)
    ]);

    // Resize button and bg
    button.width = width
    button.height = height
    buttonBg.width = width - 2
    buttonBg.height = height - 2

    button.onPressed(() => { 
        button.children[0].use(k.sprite("button", { width: width - 2, height: height - 2 }));
        button.children[0].frame = 1;
    });
    button.onReleased(() => { 
        button.children[0].use(k.sprite("button", { width: width - 2, height: height - 2 }));
        button.children[0].frame = 0;
    });
    button.onFocus(() => { 
        if (button.outline)
            button.outline.color = k.BLACK; 
    });
    button.onBlur(() => { 
        if (button.outline)
            button.outline.color = k.WHITE; 
    });

    button.setText = (text: string) => {
        const dimensions = k.formatText({ text: textlabel.text, size: textlabel.textSize ?? 20 })
        let width = dimensions.width + 16 + layout.padding[0] * 2
        let height = dimensions.height + layout.padding[1] * 2

        textlabel.text = text;

        button.width = width
        button.height = height
        buttonBg.width = width - 2
        buttonBg.height = height - 2
    };

    return button
}