import k from "../Engine";
import Conductor from "./Conductor";

export default class SongController
{
    public static id: string = "";
    public static artist: string = "";
    public static songname: string = "";
    public static notes: Array<any> = [];
    public static BPM: number = 120;
    public static scrollSpeed: number = 2.2;

    public static loadSong(name: string)
    {
        SongController.id = name;
        const songdata = k.loadJSON("song", `data/songs/${name}.json`);
        songdata.then((data) => {
            SongController.songname = data.song;
            SongController.BPM = data.bpm;
            SongController.artist = data.artist;
            SongController.scrollSpeed = data.speed;
        });
    }
}