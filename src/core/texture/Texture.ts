import { context as gl } from './../RenderingContext';

export class Texture {

    private texture: WebGLTexture;

    constructor() {
        this.texture = gl.createTexture();
    }

    public setHTMLImageElementData(image: HTMLImageElement): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    public setTextureMinFilter(type: TextureFilterMode): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, type);
    }

    public setTextureMagFilter(type: TextureFilterMode): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, type);
    }

    // TODO: typesafe enums
    public setTextureWrapS(type: TextureWrapMode): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, type);
    }

    public setTextureWrapT(type: TextureWrapMode): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, type);
    }

    public setupEmptyTexture(width: number, height: number): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
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

export enum TextureFilterMode {
    NEAREST = WebGL2RenderingContext.NEAREST,
    LINEAR = WebGL2RenderingContext.LINEAR,
}

export enum TextureWrapMode {
    CLAMP_TO_EDGE = WebGL2RenderingContext.CLAMP_TO_EDGE,
    REPEAT = WebGL2RenderingContext.REPEAT,
}
