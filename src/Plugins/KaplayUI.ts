import { KAPLAYCtx, Comp, GameObj, Vec2, KEventController } from "kaplay";

type UiType = "custom" | "button" | "radio" | "checkbox" | "sliderthumb" | "dragitem";
type UiElementCompOpt = {
    type?: UiType;
    group?: string;
    checked?: boolean;
    proxy?: GameObj;
    bringToFront?: boolean;
    orientation?: UIOrientation;
};
export type UIOrientation = "horizontal" | "vertical";
interface UiElementComp extends Comp {
    onPressed(action: () => void): KEventController;
    onReleased(action: () => void): KEventController;
    onChecked(action: (checked: boolean) => void): KEventController;
    onFocus(action: () => void): KEventController;
    onBlur(action: () => void): KEventController;
    onAction(action: () => void): KEventController;
    onValueChanged(action: (value: number) => void): KEventController;
    isPressed(): boolean;
    isChecked(): boolean;
    setChecked(checked: boolean): void;
    setFocus(): void;
    value: number;
    type: UiType;
}
export type LayoutType = "row" | "column" | "grid" | "flex";
export type LayoutElementCompOpt = {
    type?: LayoutType;
    padding?: number;
    spacing?: number;
    columns?: number;
    maxWidth?: number;
};
interface LayoutElementComp extends Comp {
    doLayout(): Vec2;
    type: LayoutType;
    padding: Vec2;
    spacing: Vec2;
    columns?: number;
    maxWidth: number;
}

export default function kaplayUi(k: KAPLAYCtx) {

    function getFocus(): GameObj | undefined {
        let focus
        k.get("focus", { recursive: true }).forEach(uiElement => {
            focus = uiElement
        })
        return focus
    }

    k.onKeyPress("enter", () => {
        const focus = getFocus()
        if (focus) {
            focus.tag("pressed")
            focus.trigger("pressed")
        }
    });

    k.onKeyRelease("enter", () => {
        const focus = getFocus()
        if (focus /*&& focus.is("pressed")*/) { // TODO: why isn't it pressed?
            focus.untag("pressed")
            if (focus.is("button")) {
                focus.trigger("action")
            }
            focus.trigger("released")
        }
    });

    k.onKeyPress("tab", () => {
        const focus = getFocus()
        const uiElements = k.get("canfocus", { recursive: true })
        if (focus) {
            const index = uiElements.indexOf(focus)
            const direction = k.isKeyDown("shift") ? -1 : 1
            if (index >= 0) {
                let nextFocus = uiElements[(index + direction) % uiElements.length]
                nextFocus.setFocus()
                return
            }
        }
        uiElements[0].setFocus()
    })

    k.onKeyRelease("left", () => {
        const focus = getFocus()
        if (focus && focus.type === "sliderthumb") {
            focus.value = Math.max(focus.value - (k.isKeyDown("shift") ? 0.01 : 0.1), 0)
            focus.trigger("valueChanged", focus.value)
        }
    });

    k.onKeyRelease("right", () => {
        const focus = getFocus()
        if (focus && focus.type === "sliderthumb") {
            focus.value = Math.min(focus.value + (k.isKeyDown("shift") ? 0.01 : 0.1), 1)
            focus.trigger("valueChanged", focus.value)
        }
    });

    return {
        ui(opt: UiElementCompOpt): UiElementComp {
            const _type: UiType = opt.type || "custom";
            if (_type === "radio" && !opt.group) {
                throw new Error("Radiobuttons need a group");
            }
            const _orientation: UIOrientation = opt.orientation || "horizontal";
            const _group = opt.group || null
            const _proxy = opt.proxy || null
            return {
                id: "ui",
                require: ["area"],
                add(this: GameObj) {
                    // Initialization
                    this.tag(_type)
                    this.tag("canfocus")
                    switch (_type) {
                        // @ts-ignore
                        case "radio":
                            if (_group) {
                                this.tag(_group)
                            }
                        // fallthrough
                        case "checkbox":
                            if (opt.checked) {
                                this.setChecked(true)
                            }
                            break;
                        case "sliderthumb":
                            break;
                    }
                    this.onClick(() => {
                        this.tag("pressed");
                        this.setFocus();
                        this.trigger("pressed");
                    });
                    this.onUpdate(() => {
                        if (this.is("pressed")) {
                            if (!k.isMouseDown()) {
                                this.untag("pressed");
                                if (_type === "button") {
                                    if (this.isHovering()) {
                                        this.trigger("action");
                                    }
                                }
                                else if (_type === "checkbox") {
                                    this.setChecked(!this.isChecked());
                                }
                                else if (_type === "radio") {
                                    if (!this.isChecked()) {
                                        k.get(["radio", _group!], { recursive: true }).forEach((radio: GameObj) => {
                                            if (radio !== this) {
                                                radio.setChecked(false);
                                            }
                                        })
                                        this.setChecked(true);
                                    }
                                }
                                this.trigger("released");
                            }
                            else {
                                if (_type === "sliderthumb") {
                                    const leftLimit = 2;
                                    const rightLimit = _orientation == "horizontal" ?
                                        this.parent?.width - this.width - 2 :
                                        this.parent?.height - this.height - 2;
                                    let pos = k.mousePos();
                                    let dpos = k.mouseDeltaPos();
                                    let ppos = pos.sub(dpos);
                                    const inv = this.parent!.transform.invert();
                                    pos = inv.multVec2(pos);
                                    ppos = inv.multVec2(ppos);
                                    const npos = this.pos.add(pos).sub(ppos);
                                    if (_orientation == "horizontal") {
                                        this.pos.x = k.clamp(npos.x, leftLimit, rightLimit);
                                    }
                                    else {
                                        this.pos.y = k.clamp(npos.y, leftLimit, rightLimit);
                                    }
                                    this.trigger("valueChanged", this.value);
                                }
                                else if (_type === "dragitem") {
                                    const item = _proxy || this
                                    if (opt.bringToFront && item.parent!.children[item.parent!.children.length] != item) {
                                        item.parent!.readd(item);
                                    }
                                    let pos = k.mousePos();
                                    let dpos = k.mouseDeltaPos();
                                    let ppos = pos.sub(dpos);
                                    const inv = item.parent?.transform.invert();
                                    pos = inv!.multVec2(pos);
                                    ppos = inv!.multVec2(ppos);
                                    item.pos = item.pos.add(pos).sub(ppos);
                                }
                            }
                        }
                    })
                },
                onPressed(this: GameObj, action: any) {
                    return this.on("pressed", action);
                },
                onReleased(this: GameObj, action: any) {
                    return this.on("released", action);
                },
                onChecked(this: GameObj, action: any) {
                    return this.on("checked", () => {
                        action(this.isChecked());
                    })
                },
                onFocus(this: GameObj, action: any) {
                    return this.on("focus", action);
                },
                onBlur(this: GameObj, action: any) {
                    return this.on("blur", action);
                },
                onAction(this: GameObj, action: any) {
                    return this.on("action", action);
                },
                onValueChanged(this: GameObj, action: any) {
                    return this.on("valueChanged", action);
                },
                isPressed(this: GameObj) {
                    return this.is("pressed");
                },
                isChecked(this: GameObj) {
                    return this.is("checked");
                },
                setChecked(this: GameObj, checked: boolean) {
                    if (checked) {
                        this.tag("checked");
                    }
                    else {
                        this.untag("checked");
                    }
                    this.trigger("checked", checked);
                },
                setFocus(this: GameObj) {
                    k.get("focus", { recursive: true }).forEach((uiElement: GameObj) => {
                        if (uiElement !== this) {
                            uiElement.untag("focus");
                            uiElement.trigger("blur");
                        }
                    })
                    this.tag("focus");
                    this.trigger("focus");
                },
                get value() {
                    const uiElement: GameObj = this as unknown as GameObj
                    switch (_type) {
                        case "checkbox":
                        case "radio":
                            return this.isChecked() ? 1 : 0;
                        case "sliderthumb":
                            return _orientation == "horizontal" ?
                                (uiElement.pos.x - 2) / (uiElement.parent!.width - uiElement.width - 4) :
                                (uiElement.pos.y - 2) / (uiElement.parent!.height - uiElement.height - 4);
                    }
                    return 0
                },
                set value(value: number) {
                    const uiElement: GameObj = this as unknown as GameObj
                    switch (_type) {
                        case "checkbox":
                        case "radio":
                            this.setChecked(value != 0);
                            break;
                        case "sliderthumb":
                            if (_orientation == "horizontal") {
                                uiElement.pos.x = value * (uiElement.parent!.width - uiElement.width - 4) + 2;
                            }
                            else {
                                uiElement.pos.y = value * (uiElement.parent!.height - uiElement.height - 4) + 2;
                            }
                    }
                },
                get type() {
                    return _type
                },
            }
        },
        layout(opt: LayoutElementCompOpt): LayoutElementComp {
            let _type = opt.type || "row"
            let _padding = k.vec2(opt.padding ?? 0)
            let _spacing = k.vec2(opt.spacing ?? 0)
            let _columns = opt.columns
            let _maxWidth = opt.maxWidth ?? Infinity
            return {
                add(this: GameObj) {
                    // Initialization
                    this.tag(_type)
                    this.doLayout()
                },
                doLayout(this: GameObj) {
                    switch (_type) {
                        case "row":
                            {
                                let pos = _padding
                                let height = 0
                                this.children.forEach((child: GameObj) => {
                                    child.pos = pos
                                    pos = pos.add(child.width + _spacing.x, 0)
                                    height = Math.max(height, child.height)
                                })
                                return k.vec2(pos.x - _spacing.x + _padding.x, height + _padding.y * 2)
                            }
                        case "column":
                            {
                                let pos = _padding
                                let width = 0
                                this.children.forEach((child: GameObj) => {
                                    child.pos = pos
                                    pos = pos.add(0, child.height + _spacing.y)
                                    width = Math.max(width, child.width)
                                })
                                return k.vec2(width + _padding.x * 2, pos.y - _spacing.y + _padding.y)
                            }
                        case "grid":
                            {
                                // Fix vertical position, collect column width for second pass
                                let pos = k.vec2(_padding)
                                let column = 0
                                let row = 0
                                let columnWidth: number[] = []
                                let rowHeight: number[] = []
                                this.children.forEach((child: GameObj) => {
                                    child.pos = k.vec2(pos)
                                    columnWidth[column] = Math.max(columnWidth[column] || 0, child.width)
                                    rowHeight[row] = Math.max(rowHeight[row] || 0, child.height)
                                    column++
                                    if (column === _columns) {
                                        pos.y += rowHeight[row] + _spacing.y;
                                        column = 0;
                                        row++;
                                    }
                                })
                                // Fix horizontal position
                                let x = k.vec2(_padding).x
                                column = 0
                                this.children.forEach((child: GameObj) => {
                                    child.pos.x = x
                                    x += columnWidth[column] + _spacing.x
                                    column++
                                    if (column === _columns) {
                                        x = _spacing.x
                                        column = 0
                                    }
                                })
                                return k.vec2(
                                    _padding.x * 2 + _spacing.x * (columnWidth.length - 1) + columnWidth.reduce((sum, w) => sum + w, 0),
                                    _padding.y * 2 + _spacing.y * (rowHeight.length - 1) + rowHeight.reduce((sum, h) => sum + h, 0))
                            }
                        case "flex":
                            {
                                let pos = k.vec2(_padding)
                                let column = 0
                                let width = 0
                                let maxHeight = 0
                                this.children.forEach((child: GameObj) => {
                                    child.pos = k.vec2(pos)
                                    column++
                                    if (column > 0 && child.pos.x + child.width > _maxWidth) {
                                        // Push last child a row down since there is not enough space
                                        child.pos = k.vec2(_padding.x, pos.y + maxHeight + _spacing.y)
                                        pos.x = _padding.x + child.width + _spacing.x
                                        pos.y += maxHeight + _spacing.y
                                        column = 1
                                        maxHeight = child.height
                                        width = Math.max(width, pos.x)
                                    }
                                    else {
                                        // Just append to the right since we need at least one item per row
                                        maxHeight = Math.max(maxHeight, child.height)
                                        pos.x += child.width + _spacing.x
                                        width = Math.max(width, pos.x)
                                    }
                                })
                                return k.vec2(width, pos.y + _padding.y + maxHeight)
                            }
                    }
                },
                get type() {
                    return _type
                },
                set type(type: LayoutType) {
                    _type = type
                    this.doLayout()
                },
                get padding(): Vec2 {
                    return _padding
                },
                set padding(padding: Vec2) {
                    _padding = k.vec2(padding)
                    this.doLayout()
                },
                get spacing(): Vec2 {
                    return _spacing
                },
                set spacing(spacing: Vec2) {
                    _spacing = k.vec2(spacing)
                    this.doLayout()
                },
                get columns(): number | undefined {
                    return _columns
                },
                set columns(columns: number) {
                    _columns = columns
                    this.doLayout()
                },
                get maxWidth(): number {
                    return _maxWidth
                },
                set maxWidth(maxWidth: number) {
                    _maxWidth = maxWidth
                    this.doLayout()
                }
            }
        }
    };
}