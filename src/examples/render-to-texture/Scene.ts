import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Framebuffer } from '../../core/texture/Framebuffer';
import { Texture } from '../../core/texture/Texture';
import { TextureFilterMode } from '../../core/texture/TextureFilterMode';
import { TextureWrapMode } from '../../core/texture/TextureWrapMode';
import { mat4 } from 'gl-matrix';
import { VertexBufferObject } from '../../VertexBufferObject';
import { TextureMappingShaderProgram } from '../../shader-programs/texture-mapping/TextureMappingShaderProgram';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { VertexArrayObject } from '../../VertextArrayObject';

export class Scene extends AbstractScene {

    private offscreenFramebuffer: Framebuffer;
    private offscreenTexture: Texture;

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: TextureMappingShaderProgram;
    private vbo: VertexBufferObject;
    private length: number;

    public preload(): Promise<any> {
        return Promise.all([
            TextureMappingShaderProgram.create().then((shaderProgram: TextureMappingShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
            WavefrontLoader.loadIntoVboTex(require('./../../assets/models/susanna.obj')).then((vbo) => {
                this.vbo = vbo.vbo;
                this.length = vbo.length;
            })
        ]);
    }

    public init(): void {
        const texture: Texture = new Texture();
        texture.setupEmptyTexture(640, 360);
        texture.setTextureMagFilter(TextureFilterMode.LINEAR);
        texture.setTextureMinFilter(TextureFilterMode.LINEAR);
        texture.setTextureWrapS(TextureWrapMode.CLAMP_TO_EDGE);
        texture.setTextureWrapT(TextureWrapMode.CLAMP_TO_EDGE);

        const framebuffer: Framebuffer = new Framebuffer();
        framebuffer.attachTexture(texture);

        this.offscreenFramebuffer = framebuffer;
        this.offscreenTexture = texture;

        const vao: VertexArrayObject = new VertexArrayObject();
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('vertex'), 3, 5, 0);
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('texcoord'), 2, 5, 3);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());

        vao.bind();
    }

    public draw(): void {
        this.offscreenFramebuffer.bindAndExecute(() => this.renderOffscreenScene());
        this.renderOnscreenScene();
    }

    private renderOffscreenScene(): void {
        gl.viewport(0, 0, 640, 360);
        gl.clearColor(1, 0, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    private renderOnscreenScene(): void {
        gl.viewport(0, 0, 640, 360);
        gl.clearColor(0, 1, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.colorShaderProgram.setProjectionMatrix(this.computeModelViewMatrix());
        this.offscreenTexture.bind();
        this.vbo.draw(this.length);
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 40.0);
    }

    private computeModelViewMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, -0.9, -4]);
        //mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        return mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);

    }

}
