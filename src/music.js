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
    }

    async setup() {
        Tone.start();
        this.kickPlayer = new Tone.Player(kick).toDestination();
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
