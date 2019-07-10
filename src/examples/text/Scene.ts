import { mat4, vec4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureFilterMode } from '../../core/texture/TextureFilterMode';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { TextureMappingShaderProgram } from './TextureMappingShaderProgram';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { throws } from 'assert';

/**
 * https://webgl2fundamentals.org/webgl/lessons/webgl-render-to-texture.html
 */
export class Scene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();
    private shader: TextureMappingShaderProgram;
    private texture: Texture;
    private numCharacters: number = 0;
    private currentColor: Array<number> = [0, 1, 0, 1];
    private currentScale: number = 2;

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

    public addText(array: Array<number>, color: Array<number>, x: number, y: number, text: string): void {
        let xpos: number = x;
        let ypos: number = y;
        const scale: number = this.currentScale;
        for (let i: number = 0; i < text.length; i++) {
            const ascii: number = text.charCodeAt(i);
            if (ascii === '\n'.charCodeAt(0)) {
                xpos = x;
                ypos += 8 * scale;
                continue;
            }

            const char: number = ascii - ' '.charCodeAt(0);
            const charx: number = Math.floor(char % 32);
            const chary: number = Math.floor(char / 32);
            const height: number = 1.0 / 2.0;
            const width: number = 1.0 / 32.0;

            // TODO: use instanced rendering
            // define vertices once, add pos, tex offset and color as buffers
            array.push(
                xpos + 0, 0 + ypos, charx * width + 0, 0 + chary * height,
                xpos + 8 * scale, 0 + ypos, charx * width + width, 0 + chary * height,
                xpos + 0, 8 * scale + ypos, charx * width + 0, height + chary * height,

                xpos + 8 * scale, 0 + ypos, charx * width + width, 0 + chary * height,
                xpos + 8 * scale, 8 * scale + ypos, charx * width + width, height + chary * height,
                xpos + 0, 8 * scale + ypos, charx * width + 0, height + chary * height
            );
            color.push(...this.currentColor);
            color.push(...this.currentColor);
            color.push(...this.currentColor);
            color.push(...this.currentColor);
            color.push(...this.currentColor);
            color.push(...this.currentColor);

            xpos += 8 * scale;
            this.numCharacters++;
        }
    }

    public init(): void {
        this.texture.setTextureMagFilter(TextureFilterMode.NEAREST);
        this.texture.setTextureMinFilter(TextureFilterMode.NEAREST);

        const array: Array<number> = [];
        const color: Array<number> = [];

        const text: string =
            'HELLO WORLD!\n' +
            'HOW ARE YOU????';

        this.addText(array, color, 16, 16, text);
        this.currentColor = [1, 0, 0, 1];
        this.addText(array, color, 16, 16 + 16 + 16 + 16, 'WHAAAZZUUUPPP?');
        this.currentColor = [1, 0, 1, 1];
        this.currentScale = 4;
        this.addText(array, color, 16, 16 + 16 + 16 + 16+16, 'HUH??');
        this.currentColor = [1, 1, 1, 1];
        this.currentScale = 5;
        this.addText(array, color, 16, 16 + 16 + 16 + 16+16+16+16, 'NO! NO! NO!');
        this.currentScale = 8;
        this.addText(array, color, 16, 16 + 16 + 16 + 16+16+16+16+16+16+16+16+16+16, '$GENESIS§');

        const vbo: VertexBufferObject = new VertexBufferObject(array);
        const ColorVbo: VertexBufferObject = new VertexBufferObject(color);
        const vba: VertexArrayObject = new VertexArrayObject();

        const vertex: number = this.shader.getAttributeLocation('vertex');
        const tex: number = this.shader.getAttributeLocation('texcoord');
        const colorLoc: number = this.shader.getAttributeLocation('color');

        vba.bindVertexBufferToAttribute(vbo, vertex, 2, 4, 0);
        vba.bindVertexBufferToAttribute(vbo, tex, 2, 4, 2);
        vba.bindVertexBufferToAttribute(ColorVbo, colorLoc, 4, 4, 0);

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
        return this.modelViewMatrix;
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * this.numCharacters);
    }

}
