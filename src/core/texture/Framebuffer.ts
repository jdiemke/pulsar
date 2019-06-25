import { context as gl } from './../RenderingContext';

export class Framebuffer {

    private fb: WebGLFramebuffer;

    constructor() {
        this.fb = gl.createFramebuffer();
    }

    public attachTexture(tex: WebGLTexture): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    }

}
