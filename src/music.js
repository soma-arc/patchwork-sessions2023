import * as Tone from 'tone';
import kick from './sounds/005SEPT-Kick.wav';

export default class Music {
    static {
        this.bpm = 130;        
        this.quarterIntervalMillis = 461.53846153;
        this.eighthIntervalMillis = this.quarterIntervalMillis / 2;
        this.measureIntervalMillis = this.quarterIntervalMillis * 4;
    }

    constructor() {
        Tone.start();
        this.kickPlayer = new Tone.Player(kick).toDestination();
    }

    async setup() {
        await Tone.loaded();
        Tone.Transport.bpm.value = 130;
        Tone.Transport.scheduleRepeat(time => {
            this.kickPlayer.start();
        }, '4n', '1m', '2m');
    }

    start() {
        Tone.Transport.start();
    }
}
