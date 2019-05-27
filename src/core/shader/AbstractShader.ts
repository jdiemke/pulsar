import { logger } from '../Logger';
import { context as gl } from '../RenderingContext';

export abstract class AbstractShader {

    private shader: WebGLShader = null;

    constructor(source: string) {
        const shader: WebGLShader = gl.createShader(this.getType());
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        this.shader = shader;

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            logger.info(gl.getShaderInfoLog(shader));
            // this.delete();
            // throw new Error('Could not compile shader ' + source);
        }
    }

    public getShader(): WebGLShader {
        return this.shader;
    }

    public delete(): void {
        gl.deleteShader(this.getShader());
    }

    protected abstract getType(): number;

}
