import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Framebuffer } from '../../core/texture/Framebuffer';
import { Texture } from '../../core/texture/Texture';
import { TextureFilterMode } from '../../core/texture/TextureFilterMode';
import { TextureWrapMode } from '../../core/texture/TextureWrapMode';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { TextureMappingShaderProgram } from '../../shader-programs/texture-mapping/TextureMappingShaderProgram';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { ShaderUtils } from '../../core/utils/ShaderUtils';
import { ShaderProgram } from '../../core/shader/ShaderProgram';

/**
 * https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
 */
export class Scene extends AbstractScene {

    private offscreenFramebuffer: Framebuffer;
    private offscreenTexture: Texture;
    private vao: VertexArrayObject;
    private fullscreenQuadVAO: VertexArrayObject;

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: TextureMappingShaderProgram;
    private vbo: VertexBufferObject;
    private fullscreenVbo: VertexBufferObject;
    private length: number;
    private plasmaShader: ShaderProgram;
    private start: number = Date.now();

    public preload(): Promise<any> {
        return Promise.all([
            TextureMappingShaderProgram.create().then((shaderProgram: TextureMappingShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
            ShaderUtils.createProgram(require('./VertexShader.vs'), require('./FragmentShader.fs')).then(x => {
                this.plasmaShader = x;
            })
        ]);
    }

    public init(): void {
        const texture: Texture = new Texture();
        texture.setupEmptyTexture(512, 512);
        texture.setTextureMagFilter(TextureFilterMode.LINEAR);
        texture.setTextureMinFilter(TextureFilterMode.LINEAR);
        texture.setTextureWrapS(TextureWrapMode.CLAMP_TO_EDGE);
        texture.setTextureWrapT(TextureWrapMode.CLAMP_TO_EDGE);

        const framebuffer: Framebuffer = new Framebuffer();
        framebuffer.attachTexture(texture);

        this.offscreenFramebuffer = framebuffer;
        this.offscreenTexture = texture;

        let tileArray = [
            -0.5, -0.5, 0.5, 0.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 0.5, 1.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,

            0.5, -0.5, 0.5, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 1.0,
            0.5, -0.5, 0.5, 0.0, 0.0,

            0.5, -0.5, -0.5, 0.0, 0.0,
            -0.5, -0.5, -0.5, 1.0, 0.0,
            -0.5, 0.5, -0.5, 1.0, 1.0,
            -0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, -0.5, 0.0, 0.0,

            -0.5, -0.5, -0.5, 0.0, 0.0,
            -0.5, -0.5, 0.5, 1.0, 0.0,
            -0.5, 0.5, 0.5, 1.0, 1.0,
            -0.5, 0.5, 0.5, 1.0, 1.0,
            -0.5, 0.5, -0.5, 0.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 0.0,

            -0.5, 0.5, 0.5, 0.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            -0.5, 0.5, -0.5, 0.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 0.0,

            -0.5, -0.5, 0.5, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 1.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,
            -0.5, -0.5, -0.5, 0.0, 1.0,
        ];

        this.vbo = new VertexBufferObject(tileArray);

        const vao: VertexArrayObject = new VertexArrayObject();
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('vertex'), 3, 5, 0);
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('texcoord'), 2, 5, 3);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());

        this.vao = vao;

        const quadrilateralVertices: Array<number> = [
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
        ];

        const vbo: VertexBufferObject = new VertexBufferObject(quadrilateralVertices);
        const vba: VertexArrayObject = new VertexArrayObject();

        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');

        vba.bindVertexBufferToAttribute(vbo, vertex, 3, 3, 0);
        this.fullscreenQuadVAO = vba;
        this.fullscreenVbo = vbo;




    }

    public draw(): void {
        /**
         * TODO:
         * - render plasma into texture
         * - texture cube with plasma :)
         */
        this.offscreenFramebuffer.bindAndExecute(() => this.renderOffscreenScene());
        this.renderOnscreenScene();
    }

    /**
     * clear texture
     */
    private renderOffscreenScene(): void {
        gl.viewport(0, 0, 512, 512);
        gl.clearColor(1, 0, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.fullscreenQuadVAO.bind();
        this.plasmaShader.use();
        gl.uniform1f(gl.getUniformLocation(
            this.plasmaShader.getProgram(), 'myTime'), (Date.now() - this.start) * 0.0002
        );
        this.fullscreenVbo.draw(6);
    }

    /**
     * render obj with cleared texture
     */
    private renderOnscreenScene(): void {
        gl.viewport(0, 0, 640, 360);
        gl.clearColor(0.1, 0.1, 0.12, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setProjectionMatrix(this.computeModelViewMatrix());
        this.offscreenTexture.bind();
        this.vao.bind();
        this.vbo.draw(6 * 6);
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 40.0);
    }

    private computeModelViewMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, -0.0, -2]);
        mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        return mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
    }

}
