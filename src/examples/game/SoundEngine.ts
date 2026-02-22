export class SoundEngine {

    public static getInstance(): SoundEngine {
        if (SoundEngine.instance === null) {
            SoundEngine.instance = new SoundEngine();
        }

        return SoundEngine.instance;
    }

    private static instance: SoundEngine = null;
    private audioContext: AudioContext;

    private audioMap: Map<string, AudioBuffer>;

    private constructor() {
   
        this.audioContext = new AudioContext({
            sampleRate: 22050
        })
        this.audioMap = new Map<string, AudioBuffer>();
    }

    public loadSound(key: string, filename: string): Promise<Map<string, AudioBuffer>> {
        return fetch(filename)
            .then((response: Response) => response.arrayBuffer())
            .then((arrayBuffer: ArrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer))
            .then((audioBuffer: AudioBuffer) => this.audioMap.set(key, audioBuffer));
    }

    public play(key: string, gain: number = 1.0, loop: boolean = false) {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioMap.get(key);
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = gain;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.loop = loop;
        source.start();
    }

}
