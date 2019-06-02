import { context as gl } from './core/RenderingContext';

export class VertexBufferObject {

    private vbo: WebGLBuffer;

    constructor(bufferData: Array<number>, size: number = 0, usage: number = gl.STATIC_DRAW) {
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        if (bufferData !== null) {
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), usage);
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, size, usage);
        }
    }

    public update(bufferData: Float32Array) {
        this.bindAndExecute(() => {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufferData)
        });
    }

    public bind(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    }

    public unbind(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public draw(length: number): void {
        gl.drawArrays(gl.TRIANGLES, 0, length);
    }

    private bindAndExecute(fun: () => void): void {
        this.bind();
        fun();
        this.unbind();
    }


}
