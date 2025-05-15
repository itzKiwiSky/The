import k from "./Engine";
import { assets } from "@kaplayjs/crew";

k.loadRoot("./"); // A good idea for Itch.io publishing later

Object.keys(assets).forEach((key) => {
    const asset = assets[key];
    k.loadSprite(`@${key}`, asset.sprite);
    k.loadSprite(`@${key}-o`, asset.outlined);
});

k.loadSprite("button", "images/button.png", {
    slice9: { left: 3, top: 3, right: 3, bottom: 3 },
    sliceX: 2,
});
k.loadSprite("tiles", "images/tiles.png", {
    sliceX: 8,
    sliceY: 1
});

const judmentNames = [
    "awesome",
    "perfect",
    "good",
    "ok",
    "miss",
]

for (let i = 0; i < judmentNames.length; i++)
    k.loadSprite(judmentNames[i], `images/${judmentNames[i]}.png`);
    

k.loadSound("hitsound", "sounds/hitsound.ogg");

k.loadShaderURL("background", null, "shaders/Background.glsl");

k.loadCrewFont("happy-o");