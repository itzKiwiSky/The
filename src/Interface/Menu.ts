import { GameObj, PosComp } from "kaplay";
import k from "../Engine";

export type MenuHideOption = "destroy" | "hide";

export default function newMenu(parent: GameObj<PosComp>, 
    { 
        position = k.vec2(), 
        label = "", 
        items = [""], 
        hideOption = "destroy",
        textcolor = k.WHITE,
    } = {}) {
    position = parent.toWorld(position)
    const menu = k.add([
        k.pos(position),
        k.rect(200, 200),
        k.color(k.WHITE),
        k.outline(1, k.BLACK),
        k.area(),
        k.layout({ type: "column", padding: 5, spacing: 5 }),
        {
            onValueChanged(cb) {
                this.on("valueChanged", cb)
            },
            hide() {
                switch (hideOption) {
                    case "destroy":
                        this.destroy();
                        break;
                    case "hide":
                        this.visible = false;
                        break;
                }
            }
        }
    ]);
    for (const item of items) {
        const dimensions = k.formatText({ text: item, size: 20 })
        const menuItem = menu.add([
            k.rect(menu.width - 8, dimensions.height),
            k.pos(0, 0),
            k.area(),
            k.color(k.WHITE),
            k.ui({ type: "button" })
        ]);
        const menuItemChild = menuItem.add([
            k.pos(4, 10),
            k.anchor("left"),
            k.color(textcolor)
        ]);

        if (typeof item == "string")
            menuItemChild.use(k.text(item, { size: 20 }));
        else 
        menuItemChild.use(item);

        menuItem.onHover(() => { menuItem.color = k.rgb(80, 80, 255); });
        menuItem.onHoverEnd(() => { menuItem.color = k.WHITE; });
        menuItem.onAction(() => {
            menu.trigger("valueChanged", item);
            menu.hide()
        });
    }
    const size = menu.doLayout();
    [menu.width, menu.height] = [size.x, size.y]
    menu.onMouseDown(() => {
        if (!menu.isHovering()) {
            menu.hide();
        }
    })
    return menu;
}