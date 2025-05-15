import kaplay from "kaplay";

import { crew } from "@kaplayjs/crew";
import kaplayUi from "./Plugins/KaplayUI";
import konsole from "./Plugins/Konsole";

const k = kaplay({
    width: 1280,
    height: 768,
    letterbox: true,
    stretch: false,
    debug: true,
    crisp: true,
    plugins: [ crew, kaplayUi, konsole ],
    font: "happy-o",
    buttons: {
        down: {
            keyboard: [ "down", "s" ]
        },
        up: {
            keyboard: [ "up", "w" ]
        },
        accept: {
            keyboard: [ "enter", "space" ]
        },
        return: {
            keyboard: [ "backspace", "escape" ]
        },
    }
});

export default k;