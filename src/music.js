import * as Tone from 'tone';
import kick from './sounds/005SEPT-Kick.wav';
import OHat from './sounds/020SEPTOpenHat.wav';
import CHat from './sounds/001SEPTClosedHat.wav';
import Clap from './sounds/014SEPTClap.wav';
import bgm from './sounds/sessions.wav';

export default class Music {
    static {
        this.bpm = 130;        
        this.quarterIntervalMillis = 461.53846153;
        this.eighthIntervalMillis = this.quarterIntervalMillis / 2;
        this.measureIntervalMillis = this.quarterIntervalMillis * 4;
    }

    constructor() {
    }

    async setup() {
        Tone.start();
        this.kickPlayer = new Tone.Player(kick).toDestination();
        this.ohatPlayer = new Tone.Player(OHat).toDestination();
        this.chatPlayer = new Tone.Player(CHat).toDestination();
        this.clapPlayer = new Tone.Player(Clap).toDestination();
        this.bgmPlayer = new Tone.Player(bgm).toDestination();
        await Tone.loaded();
        
        Tone.Transport.bpm.value = 130;
        // // Tone.Transport.scheduleRepeat(time => {
        // //     this.kickPlayer.start();
        // // }, '4n', '4m', '4m');
        // Tone.Transport.scheduleRepeat(time => {
        //     this.kickPlayer.start(time);
        //     this.chatPlayer.start(time +0.461538);
        // }, '4n', 0, '4m');
    }

    start() {
        //Tone.Transport.start();
        this.bgmPlayer.start();
        console.log('start');
    }

    stop() {
        this.bgmPlayer.stop();
    }
}
