import { mat4 } from 'gl-matrix';
import { Texture } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { context as gl } from './../../core/RenderingContext';
import { GreenShaderProgram } from './GreenShaderProgram';

export class BackgroundImage {

    public static create(): Promise<BackgroundImage> {
        return new BackgroundImage().init();
    }

    public shader: GreenShaderProgram;
    public texture: Texture;
    public vertexArrayObject: VertexArrayObject;

    public draw(): void {
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);

        this.texture.bind();
        this.vertexArrayObject.bind();
        this.shader.use();

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.depthMask(true);
        gl.enable(gl.CULL_FACE);
    }

    private computeModelViewMatrix(x: number, y: number, width: number, height: number): mat4 {
        const modelViewMatrix: mat4 = mat4.create();
        mat4.identity(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix,
            [-1 + 2 / 640 * x, 1 - 2 / 360 * y, 0]);
        return mat4.scale(modelViewMatrix, modelViewMatrix, [2 / 640 * width, -2 / 360 * height, 1]);
    }

    private preloadResources(): Promise<any> {
        return Promise.all([
            GreenShaderProgram.create().then((shaderProgram: GreenShaderProgram) => {
                this.shader = shaderProgram;
            }),
            TextureUtils.load(require('./../../assets/textures/genesis.png')).then((texture: Texture) => {
                this.texture = texture;
            })
        ]);
    }

    private setupEffect(): void {
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
        this.vertexArrayObject = vba;

        vba.bindVertexBufferToAttribute(vbo, this.shader.getAttributeLocation('vertex'), 2, 4, 0);
        vba.bindVertexBufferToAttribute(vbo, this.shader.getAttributeLocation('texcoord'), 2, 4, 2);

        this.shader.use();

        this.shader.setModelViewMatrix(this.computeProjectionMatrix());
        this.shader.setProjectionMatrix(this.computeModelViewMatrix(0, 0, 640, 360));
    }

    private init(): Promise<BackgroundImage> {
        return this.preloadResources().then(() => {
            this.setupEffect();
            return this;
        });
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.identity(mat4.create());
    }

}
