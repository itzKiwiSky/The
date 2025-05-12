import k from "../Engine";
import { Palette } from "../Modules/Misc/Colors";

k.scene("playscene", () => {
    k.add([
        k.rect(k.width(), k.height()),
        k.scale(8),
        k.shader("background", () => ({
            "u_time": k.time() / 5,
            "u_color1": Palette.LimeSpring,
            "u_color2": Palette.MossMeadow,
            "u_speed": k.vec2(0.4, -0.8),
            "u_angle": 0,
            "u_scale": 4,
            "u_aspect": k.width() / k.height(),
        })),
    ]);

    const hitlane = k.add([
        k.pos(0, k.height() - 96),
        k.rect(k.width(), 4),
    ]);
});