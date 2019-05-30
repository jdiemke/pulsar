import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { GreenShaderProgram } from './GreenShaderProgram';
import { Face } from '../../model/face';
import { Mesh } from '../../model/mesh';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { Texture } from '../../core/texture/Texture';
import { BackgroundImage } from './Effect';

export class Scene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: GreenShaderProgram;
    private texture: Texture;
    private effect: BackgroundImage;

    public preload(): Promise<any> {
        return Promise.all([GreenShaderProgram.create().then(
            (shaderProgram: GreenShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
        TextureUtils.load(require('./../../assets/textures/genesis.png')).then((texture: Texture) => {
            this.texture = texture;
        }),
        BackgroundImage.create().then((x: BackgroundImage) => {
            this.effect = x;
        })
        ]);
    }

    public init(): void {
        const array: Array<number> = [
            0, 0, 0, 0,
            1, 0, 1, 0,
            0, 1, 0, 1,

            1, 0, 1, 0,
            1, 1, 1, 1,
            0, 1, 0, 1
        ];

        const vbo: VertexBufferObject = new VertexBufferObject(array);
        const vba: VertexArrayObject = new VertexArrayObject();
        vba.bind();

        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');
        const tex: number = this.colorShaderProgram.getAttributeLocation('texcoord');

        vba.bindVertexBufferToAttribute(vbo, vertex, 2, 4, 0);
        vba.bindVertexBufferToAttribute(vbo, tex, 2, 4, 2);

        this.colorShaderProgram.use();

        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());
        this.texture.bind();
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.colorShaderProgram.setProjectionMatrix(this.computeModelViewMatrix(0, 0, 640, 360));

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.identity(this.projectionMatrix);
    }

    private computeModelViewMatrix(x: number, y: number, width: number, height: number): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix,
            [-1 + 2 / 640 * x, 1 - 2 / 360 * y, 0]);
        return mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [2 / 640 * width, -2 / 360 * height, 1]);
    }

}
