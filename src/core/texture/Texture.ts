import { context as gl } from './../RenderingContext';
import { TextureFilterMode } from './TextureFilterMode';
import { TextureUnit } from './TextureUnit';
import { TextureWrapMode } from './TextureWrapMode';

export class Texture {

    private texture: WebGLTexture = null;

    public constructor() {
        this.texture = gl.createTexture();
    }

    public getWebGLTexture(): WebGLTexture {
        return this.texture;
    }

    public setHTMLImageElementData(image: HTMLImageElement): void {
        this.bindAndExecute(() => {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        });
    }

    public setTextureMinFilter(type: TextureFilterMode): void {
        this.bindAndExecute(() => {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, type);
        });
    }

    public setTextureMagFilter(type: TextureFilterMode): void {
        this.bindAndExecute(() => {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, type);
        });
    }

    public setTextureWrapS(type: TextureWrapMode): void {
        this.bindAndExecute(() => {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, type);
        });
    }

    public setTextureWrapT(type: TextureWrapMode): void {
        this.bindAndExecute(() => {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, type);
        });
    }

    public setupEmptyTexture(width: number, height: number): void {
        this.bindAndExecute(() => {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        });
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

    // see: https://books.google.de/books?id=0bTMBQAAQBAJ&pg=PA591&lpg=PA591&dq=%22gl.getParameter(gl.TEXTURE_BINDING_2D);%22&source=bl&ots=byDv_PZaTG&sig=ACfU3U21KvUv3asbADMrLc3UIX9u1ggiTQ&hl=de&sa=X&ved=2ahUKEwiXt4j6noTjAhWFzKQKHXc6CeUQ6AEwBXoECAkQAQ#v=onepage&q=%22gl.getParameter(gl.TEXTURE_BINDING_2D)%3B%22&f=false
    private bindAndExecute(arrowFunction: () => void): void {
        const boundTexture: WebGLTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        arrowFunction();
        gl.bindTexture(gl.TEXTURE_2D, boundTexture);
    }

}
