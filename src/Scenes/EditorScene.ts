import k from "../Engine";
import newButton from "../Interface/Button";
import FileController from "../Modules/FileManager";
import newSlider from "../Interface/Slider";
import background from "../Modules/Misc/Background";
import Conductor from "../Modules/Conductor";
import newEditBox from "../Interface/EditBox";
import createNote from "../Modules/Note";

export let editorState = {
    audioInstance: null,
    noteToolBox: [],
    notes: [],
    notesObjects: [],
    currentSelected: 1,
    canPlace: false,
    interfaceFocus: false,
    scrollSpeed: 2.2,
    lastSavedScrollDistance: 0,
    scrollDistance: k.center().y / 2,
}

export function posYFromStrum(time: number): number
{
    return k.map(time, 0, 2.5 * Conductor.stepCrochet, 0, k.height());
}

export function getStrumTime(y: number): number
{
    return k.map(y, 0, k.height(), 0, 2.5 * Conductor.stepCrochet);
}

function roundDecimal(value: number, precision: number)
{
    let m: number = 1;
    for(let i = 0; i < precision; i++)
    {
        m *= 10;
    }
    return Math.round(value * m) / m;
}

k.scene("editorscene", () => {
    background();

    Conductor.songPos = 0;
    Conductor.curStep = 0;

    const panel = k.add([
        k.rect(k.width(), 138),
        k.area(),
        k.fixed(),
        k.opacity(0.6),
        k.color(k.BLACK),
    ]);

    const startLine = k.add([
        k.pos(0, 0),
        k.z(-100),
        k.rect(k.width(), 4),
    ]);

    const line = k.add([
        k.pos(0, k.center().y / 2),
        k.z(-100),
        k.fixed(),
        k.rect(k.width(), 4),
        k.color(k.rgb(82, 197, 19))
    ])

    const camPos = k.getCamPos();
    k.setCamPos(camPos.x, k.center().y / 2);

    const sliderMusic = newSlider(panel, {
        position: k.vec2(k.width() - 378, 16),
        size: k.vec2(256, 16),
        orientation: "horizontal",
    });
    const importButton = newButton(panel, {
        position: k.vec2(16, 16), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "new song",
            textsize: 24,
        }
    });
    const playButton = newButton(panel, {
        position: k.vec2(importButton.width + 32, 16), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "Play",
            textsize: 24,
        }
    });

    const stopButton = newButton(panel, {
        position: k.vec2(importButton.width + 146, 16), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "Stop",
            textsize: 24,
        }
    });
    
    function playSong()
    {
        if (!editorState.audioInstance.paused)
                return;

        editorState.audioInstance.paused = false;
        editorState.audioInstance.volume = 0.5;
        editorState.audioInstance.play();
        return;
    }

    function stopSong()
    {
        editorState.audioInstance.paused = true;
        editorState.audioInstance.seek(0);
        return;
    }

    function updateNotes()
    {
        editorState.notesObjects.forEach((note, i, a) => {
            note.pos.y = (startLine.pos.y - (Conductor.songPos * 1000 - note.time) * (0.45 * roundDecimal(editorState.scrollSpeed, 2)));
        });
    }

    function resetNotes()
    {
        editorState.notesObjects.forEach((note, i, a) => {
            note.pos.y = posYFromStrum(note.time);
            note.hit = false;
        });
    }

    importButton.onPressed(async () => {
        const audioFile = await FileController.receiveFile();
        sliderMusic.value = 0;
        await k.loadSound("editor-song", await audioFile.arrayBuffer());

        editorState.audioInstance = k.play("editor-song", {
            volume: 0,
        });
        editorState.audioInstance.paused = true;
        editorState.audioInstance.seek(0);
    });
    playButton.onPressed(() => {
        if (editorState.audioInstance != null)
        {
            playSong();
            return;
        }
        k.debug.log("Nothing to play yet!");
    });

    stopButton.onPressed(() => {
        if (editorState.audioInstance != null)
        {
            editorState.scrollDistance = 0;
            stopSong();
            return;
        }
        k.debug.log("Nothing to stop yet!");
    });
    
    sliderMusic.onValueChanged((value) => {
        const song = k.getSound("editor-song");
        if (song == null || editorState.audioInstance == null)
            return;
        if (editorState.audioInstance.paused)
            return;
    });

    const editboxBPM = newEditBox(panel, {
        position: k.vec2(k.center().x, 16),
        width: 156
    });

    const setBPMButton = newButton(panel, {
        position: k.vec2(k.center().x - 189, 16), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "Set BPM",
            textsize: 24,
        }
    });

    const clearNotesButton = newButton(panel, {
        position: k.vec2(k.center().x - 166, 72), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "Clear",
            textsize: 24,
        }
    });

    const saveButton = newButton(panel, {
        position: k.vec2(k.width() - 360, 72), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "Save",
            textsize: 24,
        }
    });

    saveButton.onPressed(() => {
        const songdata = {
            name: "default",
            artist: "default",
            bpm: Conductor.bpm,
            scrollSpeed: editorState.scrollSpeed,
            notes: [],
        };

        for (const note of editorState.notesObjects)
        {
            songdata.notes.push(note.getRepresentation());
        }

        songdata.notes.sort((a, b) => { return a.time - b.time });

        FileController.download("song.json", JSON.stringify(songdata));
    });

    const loadButton = newButton(panel, {
        position: k.vec2(k.width() - 230, 72), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "Load",
            textsize: 24,
        }
    });

    loadButton.onPressed(async () => {
        const file = await FileController.getJSON();
        
        const data = await JSON.parse(await file.text());
        //await console.log(file.text());

        for(let i = editorState.notesObjects.length - 1; i > -1; i--)
        {
            const note = editorState.notesObjects[i];
            console.log(note);
            note.destroy();
        }

        Conductor.setBPM(data.bpm);
        editboxBPM.text = data.bpm;
        editorState.scrollSpeed = data.scrollSpeed;
        for(const note of data.notes)
        {
            const n = createNote(note.noteid, note.x, posYFromStrum(note.time / Conductor.stepCrochet * 60));
            n.onDestroy(() => {
                const idx = editorState.notesObjects.indexOf(n);

                if (idx !== -1) editorState.notesObjects.splice(idx, 1);
                //editorState.notesObjects.splice(lastNote.index, 1);
            });
            resetNotes();
        }

        //editorState
    });

    clearNotesButton.onPressed(() => {
        for(let i = editorState.notesObjects.length - 1; i > -1; i--)
        {
            const note = editorState.notesObjects[i];
            console.log(note);
            note.destroy();
        }
    });

    setBPMButton.onPressed(() => {
        Conductor.setBPM(parseFloat(editboxBPM.text));
        k.debug.log("BPM Set to " + editboxBPM.text);
    });

    const subSpeedButton = newButton(panel, {
        position: k.vec2(k.center().x, 72), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "-",
            textsize: 30,
        }
    });

    subSpeedButton.onPressed(() => {
        editorState.scrollSpeed -= 0.01;
    });

    const textSpeed = k.add([
        k.pos(k.center().x + 80, 72),
        k.text(editorState.scrollSpeed.toString(), {
            size: 30,
        }),
        k.fixed(),
    ]);

    textSpeed.onUpdate(() => {
        textSpeed.text = `${editorState.scrollSpeed.toFixed(2).toString()}`;
    });

    const addSpeedButton = newButton(panel, {
        position: k.vec2(k.center().x + 196, 72), 
        //@ts-ignore
        text: {
            color: k.WHITE,
            label: "+",
            textsize: 30,
        }
    });

    addSpeedButton.onPressed(() => {
        editorState.scrollSpeed += 0.01;
    });


    //editboxBPM.text;

    for (let i = 0; i < 8; i++)
    {
        const posY = 96;
        const tile = k.add([
            k.sprite("tiles"),
            k.scale(0.75),
            k.anchor("center"),
            k.fixed(),
            k.pos(32 + 55 * i, posY),
            k.area(),
            {
                selected: false,
                noteid: i,
            },
            "noteID_" + i.toString(),
        ]);
        tile.frame = i;
        if (i == 0)
        {
            tile.selected = true;
            editorState.currentSelected = 0;
        }
        editorState.noteToolBox.push(tile);
        tile.onUpdate(() => {
            if(tile.selected)
                tile.pos.y = k.lerp(tile.pos.y, posY + 8, 0.1);
            else
                tile.pos.y = k.lerp(tile.pos.y, posY, 0.1);
            
        });
        tile.onMousePress(() => {
            if (tile.isHovering())
            {
                editorState.noteToolBox.forEach((note, i, a) => {
                    note.selected = false;
                });
                editorState.currentSelected = tile.noteid;
                tile.selected = true;
            }
        });
    }

    k.onKeyPress((key) => {
        if (editorState.audioInstance == null)
            return;

        if (key == "space")
            if (editorState.audioInstance.paused)
            {
                editorState.lastSavedScrollDistance = editorState.scrollDistance;
                editorState.scrollDistance = 0;
                k.setCamPos(k.vec2(k.getCamPos().x, editorState.scrollDistance));
                playSong();
                return;
            }
            else
            {
                resetNotes();
                editorState.scrollDistance = editorState.lastSavedScrollDistance;
                Conductor.songPos = 0;
                //updateNotes();
                k.setCamPos(k.vec2(k.getCamPos().x, editorState.scrollDistance));
                stopSong();
                return;
            }
    });

    k.onUpdate(() => {
        const song = k.getSound("editor-song");

        if (song == null || editorState.audioInstance == null)
            return;

        if (editorState.audioInstance.paused)
            return; 
        
        sliderMusic.value = editorState.audioInstance.time() / editorState.audioInstance.duration();

        Conductor.songPos = editorState.audioInstance.time();
        Conductor.update();

        //playerArrows.y / playerArrows.scale + 0.45 * ( Conductor.songPos - Song.Notes[ index ].Time ) * 2.5
        //editorState.scrollDistance = 8 * (Conductor.songPos * editorState.scrollSpeed);

        updateNotes(); 

        editorState.notesObjects.forEach((note, i, a) => {
            //note.pos.y = (startLine.pos.y - (Conductor.songPos * 1000 - note.time) * (0.45 * roundDecimal(editorState.scrollSpeed, 2)));
            if (note.pos.y < 0 && !note.hit)
            {
                k.play("hitsound", {
                    volume: 0.5,
                });
                note.hit = true;
            }
        });

        //k.debug.log(Conductor.songPos);

        //k.setCamPos(k.vec2(k.getCamPos().x, editorState.scrollDistance));
    });

    k.onMousePress((mb) => {
        if (editorState.audioInstance == null)
            return;
    
        if (!editorState.audioInstance.paused)
            return;

        if (mb == "left")
        {
            if (k.toWorld(k.mousePos()).y < 0)
                return;

            if (panel.isHovering())
                return;


            const lastNote = editorState.notesObjects[editorState.notesObjects.length - 1];
            if (lastNote != null && lastNote.isHovering())
                return;
            
            const n = createNote(editorState.currentSelected, k.mousePos().x, getStrumTime(k.toWorld(k.mousePos()).y));
            n.onDestroy(() => {
                const idx = editorState.notesObjects.indexOf(n);

                if (idx !== -1) 
                    editorState.notesObjects.splice(idx, 1);
            });
        }

        if (mb == "right")
        {
            if (k.toWorld(k.mousePos()).y < 0)
                return;

            if (panel.isHovering())
                return;

            editorState.notesObjects.forEach((note, i, a) => {
                if (note.isHovering())
                    note.destroy();
            });
        }
    });

    k.onScroll((delta) => {
        editorState.scrollDistance += delta.y / 10;
        k.setCamPos(k.vec2(k.getCamPos().x, editorState.scrollDistance));
    });
});