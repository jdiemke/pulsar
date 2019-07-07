import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureMappingShaderProgram } from '../../shader-programs/texture-mapping/TextureMappingShaderProgram';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { TextureFilterMode } from '../../core/texture/TextureFilterMode';

/**
 * https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
 */
export class Scene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();
    private shader: TextureMappingShaderProgram;
    private texture: Texture;

    public preload(): Promise<any> {
        return Promise.all([
            TextureMappingShaderProgram.create().then(
                (x: TextureMappingShaderProgram) => {
                    this.shader = x;
                }
            ),
            TextureUtils.load(require('./font.png')).then(
                (x: Texture) => this.texture = x
            )
        ]);
    }

    public init(): void {
        this.texture.setTextureMagFilter(TextureFilterMode.NEAREST);
        this.texture.setTextureMinFilter(TextureFilterMode.NEAREST);

        const array: Array<number> = [];

        const text: string = 'HELLO WORLD!';
        let pos: number = 0;
        for (let i: number = 0; i < text.length; i++) {
            const char: number = text.charCodeAt(i) - ' '.charCodeAt(0);
            const charx: number = Math.floor(char % 32);
            const chary: number = Math.floor(char / 32);
            const height: number = 1.0 / 2.0;
            const width: number = 1.0 / 32.0;

            array.push(
                pos + 0, 0, charx * width + 0, 0 + chary * height,
                pos + 1, 0, charx * width + width, 0 + chary * height,
                pos + 0, 1, charx * width + 0, height + chary * height,

                pos + 1, 0, charx * width + width, 0 + chary * height,
                pos + 1, 1, charx * width + width, height + chary * height,
                pos + 0, 1, charx * width + 0, height + chary * height
            );
            pos++;
        }

        const vbo: VertexBufferObject = new VertexBufferObject(array);
        const vba: VertexArrayObject = new VertexArrayObject();

        const vertex: number = this.shader.getAttributeLocation('vertex');
        const tex: number = this.shader.getAttributeLocation('texcoord');

        vba.bindVertexBufferToAttribute(vbo, vertex, 2, 4, 0);
        vba.bindVertexBufferToAttribute(vbo, tex, 2, 4, 2);

        this.shader.use();
        this.shader.setModelViewMatrix(this.computeProjectionMatrix());
        this.shader.setProjectionMatrix(this.computModelMatrix());

        vba.bind();
        this.texture.bind();

        gl.clearColor(0.2, 0.2, 0.25, 1);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    }

    public computeProjectionMatrix(): mat4 {
        return mat4.ortho(this.projectionMatrix, 0, 640, 360, 0, -1, 1);
    }

    public computModelMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [640 / 2 - 12 * 16 / 2, 360 / 2 - 16 / 2, 0])
        mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [8 * 2, 8 * 2, 1]);
        return this.modelViewMatrix;
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * 12);
    }

}
