import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { TextWriter } from './TextWriter';

/**
 * https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
 */
export class Scene extends AbstractScene {

    private textWriter: TextWriter;

    public preload(): Promise<any> {
        return TextWriter.create().then((t: TextWriter) => this.textWriter = t);
    }

    public init(): void {
        this.textWriter.init2();
        this.textWriter.drawText();
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.textWriter.draw();
    }

}
