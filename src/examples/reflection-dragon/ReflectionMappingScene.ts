import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { SphereMappingShaderProgram } from '../../shader-programs/sphere-mapping/SphereMappingShaderProgram';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { BackgroundImage } from '../image/Effect';

export class ReflectionMappingScene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private sphereMappingShaderProgram: SphereMappingShaderProgram;
    private vbo: VertexBufferObject;
    private texture: Texture;
    private length: number;
    private backgroundImage: BackgroundImage;
    private vao: VertexArrayObject;

    public preload(): Promise<any> {
        return Promise.all([
            SphereMappingShaderProgram.create().then((shaderProgram: SphereMappingShaderProgram) => {
                this.sphereMappingShaderProgram = shaderProgram;
            }),
            WavefrontLoader.loadIntoVbo(require('./../../assets/models/dragon.obj')).then((vbo) => {
                this.vbo = vbo.vbo;
                this.length = vbo.length;
            }),
            TextureUtils.load(require('./../../assets/textures/env.jpg')).then((texture: Texture) => {
                this.texture = texture;
            }),
            BackgroundImage.create().then((backgroundImage: BackgroundImage) => {
                this.backgroundImage = backgroundImage;
            })
        ]);
    }

    public init(): void {
        const vertex: number = this.sphereMappingShaderProgram.getAttributeLocation('vertex');
        const normal: number = this.sphereMappingShaderProgram.getAttributeLocation('normal');

        this.sphereMappingShaderProgram.use();

        const vao: VertexArrayObject = new VertexArrayObject();
        this.vao = vao;
        vao.bindVertexBufferToAttribute(this.vbo, vertex, 3, 6, 0);
        vao.bindVertexBufferToAttribute(this.vbo, normal, 3, 6, 3);

        this.sphereMappingShaderProgram.setProjectionMatrix(this.computeProjectionMatrix());

        gl.clearColor(0.2, 0.2, 0.25, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw GENESiS Logo
        this.backgroundImage.draw();

        // Draw Dragon with Reflection Mapping
        this.sphereMappingShaderProgram.use();
        this.sphereMappingShaderProgram.setModelViewMatrix(this.computeModelViewMatrix());

        this.texture.bind();
        this.vao.bind();
        this.vbo.draw(this.length);
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 40.0);
    }

    private computeModelViewMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -2]);
        mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        return mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
    }

}
