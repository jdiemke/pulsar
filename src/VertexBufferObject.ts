import { context as gl } from './core/RenderingContext';

export class VertexBufferObject {

    private vbo: WebGLBuffer;

    constructor(bufferData: Array<number>) {
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
    }

    public vertexAttributePointer(loc: number, size: GLint, stride: GLsizei, offset: GLintptr): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * Float32Array.BYTES_PER_ELEMENT, offset);
        gl.enableVertexAttribArray(loc);
    }

}
