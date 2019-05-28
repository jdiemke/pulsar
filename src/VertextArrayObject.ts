import { context as gl } from './core/RenderingContext';

export class VertexArrayObject {

    private vao: WebGLVertexArrayObject;

    constructor() {
        this.vao = gl.createVertexArray();
    }

    public bind(): void {
        gl.bindVertexArray(this.vao);
    }

}
