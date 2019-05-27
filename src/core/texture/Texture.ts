import { context as gl } from './../RenderingContext';

export class Texture {

    private texture: WebGLTexture;

    constructor(image: HTMLImageElement) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    public bind(): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
    
}
