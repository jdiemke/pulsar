import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { TextWriter } from './TextWriter';

export class Scene extends AbstractScene {

    private textWriter: TextWriter;
    private textWriter2: TextWriter;
    private startTime: number = Date.now();

    public preload(): Promise<any> {
        // tslint:disable-next-line: max-line-length
        return Promise.all([
            TextWriter.create(require('./font.png'), 32, 2, 8, 8, ' !\'><@+\'()@+,-./0123456789:; = ? ABCDEFGHIJKLMNOPQRSTUVWXYZ').then((textWriter: TextWriter) => this.textWriter = textWriter),
            TextWriter.create(require('./fraxionFont.png'), 10, 7, 31, 34, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#: 0123456789!\'()?-/.,').then((textWriter: TextWriter) => this.textWriter2 = textWriter)
        ]);
    }

    public init(): void {
        gl.clearColor(0.2, 0.2, 0.25, 1);
    }

    public getPreparedTextBatch(): TextWriter {
        const textWriter: TextWriter = this.textWriter;

        textWriter.begin();
        textWriter.setCurrentScale(2);
        textWriter.setCurrentColor([0, 1, 0, 1]);
        textWriter.addText(16, 16, 'HELLO WORLD!\nHOW ARE YOU????');
        textWriter.setCurrentColor([1, 0, 0, 1]);
        textWriter.addText(16, 64, 'WHAAAZZUUUPPP?');
        textWriter.setCurrentColor([1, 0, 1, 1]);
        textWriter.setCurrentScale(4);
        textWriter.addText(16, 80, 'HUH??');
        textWriter.setCurrentColor([1, 1, 1, 1]);
        textWriter.setCurrentScale(5);
        textWriter.addText(16, 110, 'NO! NO! NO!');
        textWriter.setCurrentScale(8);
        textWriter.addText(16, 208, '<GENESIS>');
        textWriter.end();

        return textWriter;
    }

    /**
     * TODO: add to dedicated effects class!!
     */
    public addScrollText(textWriter: TextWriter): void {
        const fontWidth: number = 32;
        const fontScale: number = 2;
        const screenWidth: number = 640;
        const charDisplayCount: number = Math.ceil(screenWidth / (fontWidth * fontScale));
        textWriter.setCurrentColor([1, 1, 1, 1]);
        const speedScale: number = 400;
        const text: string = 'YOUR SCROLL TEXT HERE!!!' + ' '.repeat(charDisplayCount);
        textWriter.setCurrentScale(fontScale);
        const elapsedTime: number = Date.now() - this.startTime;
        const xPos: number = Math.floor((elapsedTime % speedScale) / speedScale * (fontWidth * fontScale));
        for (let i: number = 0; i < charDisplayCount + 1; i++) {
            const char: string = text.charAt((i + Math.floor(elapsedTime / speedScale)) % text.length);
            const xpos2: number = i * (fontWidth * fontScale) - xPos;
            //  - Math.sin(xpos2 * 0.014 + elapsedTime * 0.01) * 10
            textWriter.addText(xpos2, Math.floor(360 - (fontWidth * fontScale) - 16), char);
        }
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw Text
        this.getPreparedTextBatch().draw();

        const textWriter2: TextWriter = this.textWriter2;
        textWriter2.begin();
        textWriter2.setCurrentScale(1);
        textWriter2.setCurrentColor([1, 1, 1, 1]);
        this.addScrollText(this.textWriter2);
        textWriter2.end();
        textWriter2.draw();
    }

}
