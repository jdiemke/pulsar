import { context as gl } from './../RenderingContext';
import { Texture } from './Texture';

export class Framebuffer {

    private fb: WebGLFramebuffer;

    constructor() {
        this.fb = gl.createFramebuffer();
    }

    public attachTexture(tex: Texture): void {
        this.bindAndExecute(() => {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.getWebGLTexture(), 0);
        });
    }

    public getWebGLFramebuffer(): WebGLFramebuffer {
        return this.fb;
    }

    public bind(): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    }

    public bindAndExecute(arrowFunction: () => void): void {
        const boundTexture: WebGLFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        arrowFunction();
        gl.bindFramebuffer(gl.FRAMEBUFFER, boundTexture);
    }

    public unbind(): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

}
