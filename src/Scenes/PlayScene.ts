import k from "../Engine";
import { Palette } from "../Modules/Misc/Colors";
import createJudgement from "../Modules/Misc/JudgmentDisplay";

k.scene("playscene", () => {
    k.setGravity(1000);
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

    k.onKeyPress((key) => {
        const jud = [
            () => createJudgement("awesome"),
            () => createJudgement("perfect"),
            () => createJudgement("good"),
            () => createJudgement("ok"),
            () => createJudgement("miss"),
        ];

        if (jud[parseInt(key) - 1] == null)
            return;

        jud[parseInt(key) - 1]()
    });

    const hitlane = k.add([
        k.pos(0, k.height() - 96),
        k.rect(k.width(), 4),
    ]);
});