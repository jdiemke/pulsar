import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { Face } from '../../model/face';
import { Mesh } from '../../model/mesh';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { SphereMappingShaderProgram } from '../../shader-programs/sphere-mapping/SphereMappingShaderProgram';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';

export class ReflectionMappingScene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: SphereMappingShaderProgram;
    private vbo: VertexBufferObject;
    private texture: Texture;
    private length: number;

    public preload(): Promise<any> {
        return Promise.all([
            SphereMappingShaderProgram.create().then((shaderProgram: SphereMappingShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
            WavefrontLoader.loadIntoVbo(require('./../../assets/models/dragon.obj')).then((vbo) => {
                this.vbo = vbo.vbo;
                this.length = vbo.length;
            }),
            TextureUtils.load(require('./../../assets/textures/env.jpg')).then((texture: Texture) =>  {
                this.texture = texture;
            })
        ]);
    }

    public init(): void {
        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');
        const color: number = this.colorShaderProgram.getAttributeLocation('vcolor');

        this.colorShaderProgram.use();

        const vao: VertexArrayObject = new VertexArrayObject();
        vao.bindVertexBufferToAttribute(this.vbo, vertex, 3, 6, 0);
        vao.bindVertexBufferToAttribute(this.vbo, color, 3, 6, 3);

        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());

        this.texture.bind();

        gl.clearColor(0.2, 0.2, 0.25, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.colorShaderProgram.setProjectionMatrix(this.computeModelViewMatrix());
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
