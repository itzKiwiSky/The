import { Color } from "kaplay";
import k from "../../Engine";

export default function background(col1?: Color, col2?: Color)
{
    k.add([
        k.rect(k.width(), k.height()),
        k.scale(8),
        k.z(-10000),
        k.fixed(),
        k.shader("background", () => ({
            "u_time": k.time() / 5,
            "u_color1": col1 ?? k.rgb(74, 48, 82),
            "u_color2": col2 ?? k.rgb(123, 84, 128),
            "u_speed": k.vec2(0.4, -0.8),
            "u_angle": 0,
            "u_scale": 6,
            "u_aspect": k.width() / k.height(),
        })),
    ]);
}