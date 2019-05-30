import { context as gl } from './core/RenderingContext';
import { VertexBufferObject } from './VertexBufferObject';

export class VertexArrayObject {

    private vao: WebGLVertexArrayObject;

    constructor() {
        this.vao = gl.createVertexArray();
    }

    public bind(): void {
        gl.bindVertexArray(this.vao);
    }

    public unbind(): void {
        gl.bindVertexArray(null);
    }

    public bindVertexBufferToAttribute(
        vbo: VertexBufferObject,
        loc: number, size: GLint, stride: GLsizei, offset: GLintptr): void {

        this.bindAndExecute(() => {
            vbo.bind();
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(
                loc,
                size,
                gl.FLOAT,
                false,
                stride * Float32Array.BYTES_PER_ELEMENT,
                offset * Float32Array.BYTES_PER_ELEMENT
            );
        });
    }

    private bindAndExecute(fun: () => void): void {
        this.bind();
        fun();
        this.unbind();
    }

}
