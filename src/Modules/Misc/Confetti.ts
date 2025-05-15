import { Color, Vec2 } from "kaplay";
import k from "../../Engine";

const DEF_COUNT = 80;
const DEF_GRAVITY = 800;
const DEF_AIR_DRAG = 0.9;
const DEF_VELOCITY = [1000, 4000];
const DEF_ANGULAR_VELOCITY = [-200, 200];
const DEF_FADE = 0.3;
const DEF_SPREAD = 60;
const DEF_SPIN = [2, 8];
const DEF_SATURATION = 0.7;
const DEF_LIGHTNESS = 0.6;

type confettiOpts = {
    count?: number,
    pos?: Vec2,
    color?: Color,
    gravity?: number,
    airDrag?: number,
    heading?: number,
    fade?: number,
    spread?: number,
    angularVelocity?: number
    velocity?: number,
};

export default function addConfetti(opt: confettiOpts = {}) {
    const sample = (s) => typeof s === "function" ? s() : s;
    for (let i = 0; i < (opt.count ?? DEF_COUNT); i++) {
        const p = k.add([
            k.pos(sample(opt.pos ?? k.vec2(0, 0))),
            k.choose([
                k.rect(k.rand(5, 20), k.rand(5, 20)),
                k.circle(k.rand(3, 10)),
            ]),
            k.color(
                sample(
                    opt.color
                        ?? k.hsl2rgb(k.rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS),
                ),
            ),
            k.opacity(1),
            k.lifespan(4),
            k.scale(1),
            k.anchor("center"),
            k.offscreen({
                destroy: true,
            }),
            k.rotate(k.rand(0, 360)),
        ]);

        const spin = k.rand(DEF_SPIN[0], DEF_SPIN[1]);
        const gravity = opt.gravity ?? DEF_GRAVITY;
        const airDrag = opt.airDrag ?? DEF_AIR_DRAG;
        const heading = sample(opt.heading ?? 0) - 90;
        const spread = opt.spread ?? DEF_SPREAD;
        const head = heading + k.rand(-spread / 2, spread / 2);
        const fade = opt.fade ?? DEF_FADE;
        const vel = sample(
            opt.velocity ?? k.rand(DEF_VELOCITY[0], DEF_VELOCITY[1]),
        );
        let velX = Math.cos(k.deg2rad(head)) * vel;
        let velY = Math.sin(k.deg2rad(head)) * vel;
        const velA = sample(
            opt.angularVelocity
                ?? k.rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]),
        );

        p.onUpdate(() => {
            velY += gravity * k.dt();
            p.pos.x += velX * k.dt();
            p.pos.y += velY * k.dt();
            p.angle += velA * k.dt();
            p.opacity -= fade * k.dt();
            velX *= airDrag;
            velY *= airDrag;
            p.scale.x = k.wave(-1, 1, k.time() * spin);

            if(p.opacity <= 0)
                p.destroy();
        });
    }
}