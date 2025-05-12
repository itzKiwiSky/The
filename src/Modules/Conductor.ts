import k from "../Engine";

export default class Conductor
{
    public static bpm: number = 120;
    public static crochet: number = ((60 / Conductor.bpm) * 1000);
    public static stepCrochet: number = Conductor.crochet / 4;
    public static safeFrames: number = 5;
    public static safeFramesOffset: number = Math.floor((Conductor.safeFrames / 60) * 1000);
    public static songPos: number = 0;

    public static lastBeat: number = 0;
    public static curBeat: number = 0;
    public static lastStep: number = 0;
    public static curStep: number = 0;

    public offset: number = 0;

    public static update()
    {
        let oldStep: number = Conductor.curStep;

        Conductor.curStep = Math.floor(Conductor.songPos / Conductor.stepCrochet);
        Conductor.curBeat = Math.floor(Conductor.curStep / 4);
        
        Conductor.crochet = ((60 / Conductor.bpm) * 1000);
        Conductor.stepCrochet = Conductor.crochet / 4;

        if (oldStep != Conductor.stepCrochet && Conductor.curStep > 0)
            Conductor.stepHit();
    };

    public static stepHit()
    {
        if (Conductor.curStep % 4 == 0)
            Conductor.beatHit();
    };

    public static setBPM(bpm: number)
    {
        Conductor.bpm = bpm;
        Conductor.crochet = ((60 / Conductor.bpm) * 1000);
        Conductor.stepCrochet = Conductor.crochet / 4;
        Conductor.safeFrames = 5;
        Conductor.safeFramesOffset = Math.floor((Conductor.safeFrames / 60) * 1000);
    }

    public static beatHit(){};
}