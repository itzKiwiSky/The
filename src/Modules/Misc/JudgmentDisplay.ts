import { GameObj } from "kaplay";
import k from "../../Engine";

const judments = {
    "awesome": "awesome",
    "perfect": "perfect",
    "good": "good",
    "ok": "ok",
    "miss": "miss",
};

export default function createJudgement(name: string): void
{
    if (judments[name] == null)
        return;

    const popupJudment: GameObj = k.add([
        k.pos(k.center()),
        k.sprite(judments[name]),
        k.body({
            jumpForce: 500,
            maxVelocity: 10000,
            mass: 300
        }),
        k.opacity(1),
        k.offscreen({
            destroy: true
        }),

        {
            canJump: true,
        }
    ]);


    popupJudment.onUpdate(() => {
        popupJudment.opacity -= k.dt() * 0.5;

        if (popupJudment.canJump === true)
        {
            popupJudment.addForce(k.vec2(k.randi(-1006, 1006), 10));
            popupJudment.jump();
            popupJudment.canJump = false;
        }

        if (popupJudment.opacity <= 0)
            popupJudment.destroy();
    });
}