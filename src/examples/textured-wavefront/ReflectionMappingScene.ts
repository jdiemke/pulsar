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
import { TextureMappingShaderProgram } from '../../shader-programs/texture-mapping/TextureMappingShaderProgram';
import { VertexArrayObject } from '../../VertextArrayObject';

export class ReflectionMappingScene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: TextureMappingShaderProgram;
    private vbo: VertexBufferObject;
    private texture: Texture;
    private length: number;

    public preload(): Promise<any> {
        return Promise.all([
            TextureMappingShaderProgram.create().then((shaderProgram: TextureMappingShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
            WavefrontLoader.loadIntoVboTex(require('./../../assets/models/susanna.obj')).then((vbo) => {
                this.vbo = vbo.vbo;
                this.length = vbo.length;
            }),
            TextureUtils.load(require('./../../assets/models/baked_susanna.png')).then((texture: Texture) => {
                this.texture = texture;
            })
        ]);
    }

    public init(): void {
        const vao: VertexArrayObject = new VertexArrayObject();
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('vertex'), 3, 5, 0);
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('texcoord'), 2, 5, 3);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());

        this.texture.bind();
        vao.bind();
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
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, -0.9, -4]);
        //mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        return mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);

    }

}
