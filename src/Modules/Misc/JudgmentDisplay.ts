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

    const popupJudment = k.add([
        k.pos(k.center()),
        k.sprite(judments[name]),
        k.body({
            jumpForce: 500,
            maxVelocity: 10000,
            mass: 300,
            drag: 0,
        }),
        k.opacity(1),
        k.offscreen({
            destroy: true
        }),

        {
            canJump: true,
            direction: k.randi(-10, 10)
        }
    ]);

    popupJudment.onAdd(() => popupJudment.vel.x = popupJudment.direction)


    popupJudment.onUpdate(() => {
        popupJudment.opacity -= k.dt() * 0.5;
        //popupJudment.direction = k.lerp(popupJudment.direction, popupJudment.direction + 100, 0.1);
        //popupJudment.vel.x = popupJudment.direction;
        popupJudment.applyImpulse(k.vec2(k.lerp(popupJudment.direction, 0, 0.1), 0));

        if (popupJudment.canJump === true)
        {
            //popupJudment.addForce(k.vec2(k.randi(-1006, 1006), 0));
            //popupJudment.moveBy(k.vec2(k.randi(-100, 100), 0));
            popupJudment.jump();
            popupJudment.canJump = false;
        }

        if (popupJudment.opacity <= 0)
            popupJudment.destroy();
    });
}