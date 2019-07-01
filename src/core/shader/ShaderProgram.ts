import { logger } from '../Logger';
import { context as gl } from '../RenderingContext';
import { FragmentShader } from './FragmentShader';
import { VertexShader } from './VertexShader';

export class ShaderProgram {

    protected program: WebGLProgram;

    constructor(vertexShader: VertexShader, fragmentShader: FragmentShader) {
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader.getShader());
        gl.attachShader(this.program, fragmentShader.getShader());
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            logger.info(gl.getProgramInfoLog(this.program));
            gl.deleteProgram(this.program);
            throw new Error();
        }

        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            logger.info(gl.getProgramInfoLog(this.program));
        }
    }

    public getProgram(): WebGLProgram {
        return this.program;
    }

    public getAttributeLocation(id: string): number {
        return gl.getAttribLocation(this.program, id);
    }

    public getUnifromLocation(id: string): WebGLUniformLocation {
        return gl.getUniformLocation(this.program, id);
    }

    public use(): void {
        gl.useProgram(this.program);
    }

}
