import * as fs from "fs/promises";

let [filename, sceneName] = (process.argv[2] ?? "").split(":");
sceneName = sceneName.replace(/[\s_\-\.]/g, "");
filename = filename.replace(/[\s_\-\.]/g, "");

if (!sceneName || !filename)
{
    console.error("Specify a scene name");
    process.exit(1);
}

const scenesDir = `src/Scenes`;
const filePath = `${scenesDir}/${filename}.ts`;

const template = `
import k from "../Engine";

k.scene("${sceneName}", () => {
    const bean = k.add([
        k.pos(),
        k.sprite("@bean"),
    ]);

    // write more of your stuff here :3 //
});
`.trim();

const isDir = (path) => fs.stat(path).then((stat) => stat.isDirectory()).catch(() => false);

if (await isDir(filePath))
{
    console.error(`File already exists at "${filePath}"!`);
    process.exit(1);
}

await fs.writeFile(`${filePath}`, template);

console.log(`Scene created at ${filePath}!`);
process.exit(0);

