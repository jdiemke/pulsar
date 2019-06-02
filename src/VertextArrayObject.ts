import { context as gl } from './core/RenderingContext';
import { VertexBufferObject } from './VertexBufferObject';
import { ElementBufferObject } from './ElementBufferObject';

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
        loc: number, size: GLint, stride: GLsizei, offset: GLintptr, divisor: number = 0): void {

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
            gl.vertexAttribDivisor(loc, divisor);
        });
    }

    public bindElementBuffer(ebo: ElementBufferObject): void {
        this.bindAndExecute(() => {
            ebo.bind();
        });
        ebo.unbind();
    }

    private bindAndExecute(fun: () => void): void {
        this.bind();
        fun();
        this.unbind();
    }

}
