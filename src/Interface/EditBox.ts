import { AreaComp, Color, ColorComp, FixedComp, FormattedText, GameObj, KEventController, PosComp, TextComp } from "kaplay";
import k from "../Engine";

export interface Edit {
    text: string;
    color: Color;
    cursor: number;
    selection?: string;
    inputtype?: string;
    select(start: number, length: number): string;
}

export interface EditChangeDelegate {
    canFocus(): boolean;
    editBegin(): void;
    canChange(edit: Edit, start: number, length: number, replacement: string): boolean;
    editEnd(): void;
}

// region edit
/**
 * Create an edit control
 * @param parent Parent to attach the edit control to
 * @param opt Options 
 * @returns The newly attached edit control
 */
export default function newEditBox(parent, { 
    position = k.vec2(), 
    label = "", 
    width = 0, 
    value = "", 
    size = 20, 
    font = undefined, 
    changeDelegate = undefined,
    inputtype = "text",
} = {}) {
    let selectionStart: number = value.length;
    let selectionLength: number = 0;
    let textDimensions: FormattedText = k.formatText({ text: value, size });
    let cursor = textDimensions.width;
    const edit = parent.add([
        k.rect(width || 150, 24),
        k.pos(position),
        k.area(),
        k.fixed(),
        k.color(k.WHITE),
        k.outline(1, k.WHITE),
        k.ui({ type: "custom" }),

        {
            isWithFocus: false,
        }
    ]);
    const text: GameObj<TextComp | ColorComp | AreaComp | PosComp | FixedComp> = edit.add([
        k.pos(2, 12),
        k.anchor("left"),
        k.fixed(),
        k.text(value, {
            size: size,
            font: font
        }),
        k.color(k.WHITE)
    ]);
    function updateCursor() {
        if (selectionStart < textDimensions.chars.length) {
            cursor = textDimensions.chars[selectionStart].pos.x - textDimensions.chars[selectionStart].width * textDimensions.chars[selectionStart].scale.x / 2;
        }
        else {
            cursor = textDimensions.width;
        }
    }
    let charEvent: KEventController | null = null;
    let drawEvent: KEventController | null = null;
    let keyEvent: KEventController | null = null;
    edit.onFocus(() => {
        edit.outline.color = k.BLUE;
        if (!charEvent) {
            charEvent = k.onCharInput(ch => {
                var str: string = text.text;
                if (selectionStart >= str.length) {
                    str = str + ch;
                }
                else if (selectionStart == 0) {
                    str = ch + str.substring(selectionStart + selectionLength);
                }
                else {
                    str = str.substring(0, selectionStart) + ch + str.substring(selectionStart + selectionLength);
                }
                text.text = str;
                selectionStart += ch.length;
                selectionLength = 0;
                textDimensions = k.formatText({ text: str, size });
                updateCursor();
            });
        }
        if (!drawEvent) {
            drawEvent = text.onDraw(() => {
                k.drawLine({
                    p1: k.vec2(cursor, -size / 2),
                    p2: k.vec2(cursor, size / 2),
                    color: k.BLACK,
                })
            });
        }
        if (!keyEvent) {
            keyEvent = text.onKeyPress(key => {
                let str = text.text
                switch (key) {
                    case "backspace":
                        if (selectionStart <= 0) {
                            return;
                        }
                        if (selectionLength == 0) {
                            str = str.slice(0, selectionStart - 1) + str.slice(selectionStart);
                        }
                        text.text = str;
                        selectionStart -= 1;
                        selectionLength = 0;
                        updateCursor();
                        break;
                    case "left":
                        if (selectionStart > 0) {
                            selectionStart -= 1;
                            selectionLength = 0;
                            updateCursor();
                        }
                        break;
                    case "right":
                        if (selectionStart < str.length) {
                            selectionStart = Math.min(selectionStart + 1, str.length);
                            selectionLength = 0;
                            updateCursor();
                        }
                        break;
                }
            });
        }
    });
    edit.onClick(() => {
        let pos = k.mousePos();
        pos = text.fromScreen(pos);
        if (textDimensions.chars.length > 0) {
            let index = 0;
            let x = 0;
            while (index < textDimensions.chars.length) {
                // The character pos is already in the middle of the character
                if (pos.x < textDimensions.chars[index].pos.x) { break; }
                index++;
            }
            selectionStart = Math.min(index, text.text.length);
            selectionLength = 0;
            updateCursor();
        }
    });
    edit.onBlur(() => {
        edit.outline.color = k.WHITE;
        charEvent?.cancel();
        charEvent = null;
        drawEvent?.cancel();
        drawEvent = null;
    });
    return {
        edit,
        get text() {
            return text.text;
        },
        set text(value) {
            text.text = value;
        },
        get color() {
            return text.color;
        },
        set color(value) {
            text.color = value;
        },
        get selection(): string {
            return "";
        },
        select(start: number, length: number = 0): string {
            selectionStart = start;
            selectionLength = length;
            return "";
        }
    }
}