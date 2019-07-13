import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { TextWriter } from './TextWriter';

/**
 * https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
 */
export class Scene extends AbstractScene {

    private textWriter: TextWriter;

    public preload(): Promise<any> {
        return TextWriter.create().then(
            (t: TextWriter) => this.textWriter = t
        );
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

        textWriter.currentScale = 2;
        textWriter.currentColor = [0, 1, 0, 1];
        textWriter.addText(16, 16, text);
        textWriter.currentColor = [1, 0, 0, 1];
        textWriter.addText(16, 16 + 16 + 16 + 16, 'WHAAAZZUUUPPP?');
        textWriter.currentColor = [1, 0, 1, 1];
        textWriter.currentScale = 4;
        textWriter.addText(16, 16 + 16 + 16 + 16 + 16, 'HUH??');
        textWriter.currentColor = [1, 1, 1, 1];
        textWriter.currentScale = 5;
        textWriter.addText(16, 16 + 16 + 16 + 16 + 16 + 16 + 16, 'NO! NO! NO!');
        textWriter.currentScale = 8;
        textWriter.addText(16, 16 + 16 + 16 + 16 + 16 + 16 + 16 + 16 + 16 + 16 + 16 + 16 + 16, '$GENESIS§');
        textWriter.end();

        return textWriter;
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.getPreparedTextBatch().draw();
    }

}
