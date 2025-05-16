import k from "./Engine";
import { assets } from "@kaplayjs/crew";

k.loadRoot("./"); // A good idea for Itch.io publishing later

Object.keys(assets).forEach((key) => {
    const asset = assets[key];
    k.loadSprite(`@${key}`, asset.sprite);
    k.loadSprite(`@${key}-o`, asset.outlined);
});

function getFileName(path: string): string | null 
{
    const match = path.match(/([^\/]+)\.[^.]+$/);
    return match ? match[1] : null;
}

//@ts-ignore//
const files = import.meta.glob("/resources/music/*.ogg?url", { eager: true });
Object.keys(files).forEach((el, i, a) => {
    //console.log(getFileName(el));
    k.loadMusic(el, `/music/${el}.ogg`);
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