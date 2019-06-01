import { context as gl } from './core/RenderingContext';

export class ElementBufferObject {

    private ebo: WebGLBuffer;

    constructor(bufferData: Array<number>) {
        this.ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(bufferData), gl.STATIC_DRAW);
    }

    public bind(): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    }

    public unbind(): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }


    public draw(length: number): void {
        gl.drawArrays(gl.TRIANGLES, 0, length);
    }

}
