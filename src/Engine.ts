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
    font: "happy-o"
});

export default k;