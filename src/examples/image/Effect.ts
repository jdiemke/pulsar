import { mat4 } from 'gl-matrix';
import { Texture, TextureUnit } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { Vector4f } from '../torus-knot/Vector4f';
import { context as gl } from './../../core/RenderingContext';
import { GreenShaderProgram } from './GreenShaderProgram';

export class BackgroundImage {

    public static create(file: string = require('./../../assets/textures/genesis.png')): Promise<BackgroundImage> {
        return new BackgroundImage().init(file);
    }

    public shader: GreenShaderProgram;
    public texture: Texture;
    public vertexArrayObject: VertexArrayObject;
    public position: Vector4f;
    public color: Vector4f = new Vector4f(1, 1, 1);

    public draw(): void {
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);

        this.texture.bind(TextureUnit.UNIT_0);
        this.vertexArrayObject.bind();
        this.shader.use();
        this.shader.setProjectionMatrix(this.computeModelViewMatrix(this.position.x, this.position.y, this.position.z, this.position.w));
        this.shader.setColor(this.color);
        gl.enable(gl.BLEND);

        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.disable(gl.BLEND);

        gl.depthMask(true);
        gl.enable(gl.CULL_FACE);
    }

    public setPosition(x: number, y: number, width: number, height: number): void {
        this.position = new Vector4f(x, y, width, height);
    }

    public setColor(color: Vector4f): void {
        this.color = color;
    }

    private computeModelViewMatrix(x: number, y: number, width: number, height: number): mat4 {
        const modelViewMatrix: mat4 = mat4.create();
        mat4.identity(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix,
            [-1 + 2 / 640 * x, 1 - 2 / 360 * y, 0]);
        //return mat4.scale(modelViewMatrix, modelViewMatrix, [2 / 640 * width, -2 / 360 * height, 1]);
        return mat4.scale(modelViewMatrix, modelViewMatrix, [2 / 640 * width, -2 / 360 * height, 1]);
    }

    private preloadResources(file: string): Promise<any> {
        return Promise.all([
            GreenShaderProgram.create().then((shaderProgram: GreenShaderProgram) => {
                this.shader = shaderProgram;
            }),
            TextureUtils.load(file).then((texture: Texture) => {
                texture.blocky();
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
        this.shader.setColor(new Vector4f(1, 1, 1));
        // tslint:disable-next-line: max-line-length
        this.shader.setTextureUnit(0);
    }

    private init(file: string): Promise<BackgroundImage> {
        this.setPosition(0, 0, 640, 360);
        return this.preloadResources(file).then(() => {
            this.setupEffect();
            return this;
        });
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.identity(mat4.create());
    }

}
