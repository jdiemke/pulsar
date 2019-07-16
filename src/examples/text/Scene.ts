import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { TextWriter } from './TextWriter';

export class Scene extends AbstractScene {

    private textWriter: TextWriter;

    public preload(): Promise<any> {
        return TextWriter.create().then((textWriter: TextWriter) => this.textWriter = textWriter);
    }

    public init(): void {
        gl.clearColor(0.2, 0.2, 0.25, 1);
    }

    public getPreparedTextBatch(): TextWriter {
        const textWriter: TextWriter = this.textWriter;
        textWriter.begin();

        const text: string =
            'HELLO WORLD!\n' +
            'HOW ARE YOU????';

        textWriter.setCurrentScale(2);
        textWriter.setCurrentColor([0, 1, 0, 1]);
        textWriter.addText(16, 16, text);
        textWriter.setCurrentColor([1, 0, 0, 1]);
        textWriter.addText(16, 64, 'WHAAAZZUUUPPP?');
        textWriter.setCurrentColor([1, 0, 1, 1]);
        textWriter.setCurrentScale(4);
        textWriter.addText(16, 80, 'HUH??');
        textWriter.setCurrentColor([1, 1, 1, 1]);
        textWriter.setCurrentScale(5);
        textWriter.addText(16, 110, 'NO! NO! NO!');
        textWriter.setCurrentScale(8);
        textWriter.addText(16, 208, '$GENESIS§');
        textWriter.end();

        return textWriter;
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw Text
        this.getPreparedTextBatch().draw();
    }

}
