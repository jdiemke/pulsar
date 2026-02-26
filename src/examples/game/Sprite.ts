import { mat4 } from 'gl-matrix';
import { Texture } from '../../core/texture/Texture';
import { TextureUnit } from "../../core/texture/TextureUnit";
import { TextureUtils } from '../../core/utils/TextureUtils';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { Vector4f } from '../torus-knot/Vector4f';
import { context as gl } from '../../core/RenderingContext';

import { TextureWrapMode } from '../../core/texture/TextureWrapMode';
import { GreenShaderProgram } from '../image/GreenShaderProgram';

export class Sprite {

    public static create(file: string): Promise<Sprite> {
        return new Sprite().init(file);
    }

    public shader: GreenShaderProgram;
    public texture: Texture;
    public vertexArrayObject: VertexArrayObject;
    public vertextBufferObject: VertexBufferObject
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
        gl.drawArrays(gl.TRIANGLES, 0,6);
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
                texture.setTextureWrapS(TextureWrapMode.CLAMP_TO_EDGE);
                texture.setTextureWrapT(TextureWrapMode.CLAMP_TO_EDGE);
                this.texture = texture;
            })
        ]);
    }

    public setSprite(shot: boolean): void {

        const index = shot ? 1 : 0;
        const width = 1 / 2;
        const offset = index * width;
        const array: Array<number> = [
            0, 0, 0+offset, 0,
            1, 0, width+offset, 0,
            0, 1, 0+offset, 1,

            1, 0, width+offset, 0,
            1, 1, width+offset, 1,
            0, 1, 0+offset, 1
        ];

        this.vertextBufferObject.update(new Float32Array(array));
    }
    private setupEffect(): void {


        const vbo: VertexBufferObject = new VertexBufferObject(null,24*4, gl.DYNAMIC_DRAW);
        const vba: VertexArrayObject = new VertexArrayObject();
        vba.bind();
        this.vertexArrayObject = vba;
        this.vertextBufferObject = vbo;

        vba.bindVertexBufferToAttribute(vbo, this.shader.getAttributeLocation('vertex'), 2, 4, 0);
        vba.bindVertexBufferToAttribute(vbo, this.shader.getAttributeLocation('texcoord'), 2, 4, 2);

        this.shader.use();

        this.shader.setModelViewMatrix(this.computeProjectionMatrix());
        this.shader.setColor(new Vector4f(1, 1, 1));
        // tslint:disable-next-line: max-line-length
        this.shader.setTextureUnit(0);
    }

    private init(file: string): Promise<Sprite> {
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
