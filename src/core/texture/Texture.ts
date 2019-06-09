import { context as gl } from './../RenderingContext';

export class Texture {

    private texture: WebGLTexture;

    constructor(image: HTMLImageElement) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        // gl.generateMipmap(gl.TEXTURE_2D);
    }

    public blocky(): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    public bind(textureUnit: TextureUnit = TextureUnit.UNIT_0): void {
        gl.activeTexture(textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

}

export enum TextureUnit {
    UNIT_0 = WebGL2RenderingContext.TEXTURE0,
    UNIT_1 = WebGL2RenderingContext.TEXTURE1
}
