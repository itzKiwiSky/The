import k from "../Engine"
import newMenu from "./Menu"


export default function newDropdown(parent, { 
    position = k.vec2(), 
    label = "", 
    group = "", 
    width = 0, 
    options = [""], 
    selected = "",
    textcolor = k.WHITE,
    outline = null,
} = {}) 
{
    const dimensions = k.formatText({ text: label, size: 20 })
    const dropdown = parent.add([
        k.rect(100, 24 + dimensions.height),
        k.pos(position),
        k.area(),
        k.color(k.WHITE),
    ]);

    if (outline)
        dropdown.use(k.outline(outline));

    let y = 0
    if (label && label != "") {
        dropdown.add([
            k.text(label, {
                size: 20
            }),
            k.pos(0, 10),
            k.anchor("left"),
            k.color(k.BLACK)
        ])
        y += dimensions.height;
    }
    const button = dropdown.add([
        k.sprite("button", { width: dropdown.width, height: 24 }),
        k.pos(0, y + 2),
        k.area(),
        k.ui({ type: "button" })
    ])
    const selectedText = button.add([
        k.text(selected, {
            size: 20
        }),
        k.pos(4, 9),
        k.anchor("left"),
        k.color(textcolor)
    ])
    button.add([
        k.text("▼", {
            size: 20
        }),
        k.pos(button.width - 4, 10),
        k.anchor("right"),
        k.color(textcolor)
    ]);

    dropdown.updateOptions = (items: any[]) => {
        const menu = newMenu(button, { position: k.vec2(0, 24), items: items });
    
    }

    button.onAction(() => {
        const menu = newMenu(button, { position: k.vec2(0, 24), items: options })
        menu.onValueChanged(value => { selectedText.text = value; });
    })

    return dropdown;
}