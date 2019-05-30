import { context as gl } from './core/RenderingContext';

export class VertexBufferObject {

    private vbo: WebGLBuffer;

    constructor(bufferData: Array<number>) {
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
    }

    public bind(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    }

    public draw(length: number): void {
        gl.drawArrays(gl.TRIANGLES, 0, length);
    }

}
