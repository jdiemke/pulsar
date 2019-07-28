import { mat4 } from 'gl-matrix';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { VertexArrayObject } from '../../VertextArrayObject';

import { TextureFilterMode } from '../../core/texture/TextureFilterMode';
import { TextureUnit } from '../../core/texture/TextureUnit';
import { VertexBufferObject } from '../../VertexBufferObject';
import { TextureMappingShaderProgram } from './TextureMappingShaderProgram';

export class TextWriter {

    public static create(font: string, xfonts: number, yFonts: number, w: number, h: number, mapping: string): Promise<TextWriter> {
        return new TextWriter().init(font, xfonts, yFonts, w, h, mapping);
    }

    private static MAX_CHARS: number = 200;
    private static MAX_VERTICES: number = 6 * TextWriter.MAX_CHARS;
    private currentColor: Array<number> = [0, 1, 0, 1];

    private currentScale: number = 2;
    private xfonts: number;
    private yfonts: number;
    private w: number;
    private h: number;
    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();
    private shader: TextureMappingShaderProgram;
    private texture: Texture;
    private numCharacters: number = 0;
    private vba: VertexArrayObject;
    private vbo: VertexBufferObject;
    private ColorVbo: VertexBufferObject;
    private array: Array<number> = [];
    private color: Array<number> = [];
    private charToIndex: Map<number, number>;


    public getCurrentColor(): Array<number> {
        return this.currentColor;
    }
    public setCurrentColor(value: Array<number>): void {
        this.currentColor = value;
    }

    public getCurrentScale(): number {
        return this.currentScale;
    }
    public setCurrentScale(value: number): void {
        this.currentScale = value;
    }

    public addText(x: number, y: number, text: string): void {
        let xpos: number = x;
        let ypos: number = y;
        const scale: number = this.currentScale;
        for (let i: number = 0; i < text.length; i++) {
            const ascii: number = text.charCodeAt(i);
            if (ascii === '\n'.charCodeAt(0)) {
                xpos = x;
                ypos += this.h * scale;
                continue;
            }

            const char: number =  this.charToIndex.has(ascii) ? this.charToIndex.get(ascii) : 0;
            const charx: number = Math.floor(char % this.xfonts);
            const chary: number = Math.floor(char / this.xfonts);
            const height: number = 1.0 / this.yfonts;
            const width: number = 1.0 / this.xfonts;

            // TODO: use instanced rendering
            // define vertices once, add pos, tex offset and color as buffers
            this.array.push(
                xpos + 0, 0 + ypos, charx * width + 0, 0 + chary * height,
                xpos + this.w * scale, 0 + ypos, charx * width + width, 0 + chary * height,
                xpos + 0, this.h * scale + ypos, charx * width + 0, height + chary * height,

                xpos + this.w * scale, 0 + ypos, charx * width + width, 0 + chary * height,
                xpos + this.w * scale, this.h * scale + ypos, charx * width + width, height + chary * height,
                xpos + 0, this.h * scale + ypos, charx * width + 0, height + chary * height
            );
            this.color.push(...this.currentColor);
            this.color.push(...this.currentColor);
            this.color.push(...this.currentColor);
            this.color.push(...this.currentColor);
            this.color.push(...this.currentColor);
            this.color.push(...this.currentColor);

            xpos += this.w * scale;
            this.numCharacters++;
        }
    }

    public begin(): void {
        this.array = [];
        this.color = [];
    }

    public end(): void {
        this.ColorVbo.update(new Float32Array(this.color.slice(0, 4 * TextWriter.MAX_VERTICES)));
        this.vbo.update(new Float32Array(this.array.slice(0, 4 * TextWriter.MAX_VERTICES)));
    }

    public computeProjectionMatrix(): mat4 {
        return mat4.ortho(this.projectionMatrix, 0, 640, 360, 0, -1, 1);
    }

    public computModelMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        return this.modelViewMatrix;
    }

    public draw(): void {
        this.vba.bind();
        this.shader.use();
        this.texture.bind(TextureUnit.UNIT_0);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);

        gl.drawArrays(gl.TRIANGLES, 0, Math.min(this.numCharacters * 6, TextWriter.MAX_VERTICES));

    }

    private initVBOs(): void {
        this.texture.setTextureMagFilter(TextureFilterMode.NEAREST);
        this.texture.setTextureMinFilter(TextureFilterMode.NEAREST);

        const BYTES_PER_FLOAT: number = 4;

        const FLOATS: number = 4;
        const size: number = FLOATS * TextWriter.MAX_VERTICES * BYTES_PER_FLOAT;
        const vbo: VertexBufferObject = new VertexBufferObject(null, size, gl.DYNAMIC_DRAW);
        const ColorVbo: VertexBufferObject = new VertexBufferObject(null, size, gl.DYNAMIC_DRAW);
        const vba: VertexArrayObject = new VertexArrayObject();
        this.vbo = vbo;
        this.ColorVbo = ColorVbo;

        const vertex: number = this.shader.getAttributeLocation('vertex');
        const tex: number = this.shader.getAttributeLocation('texcoord');
        const colorLoc: number = this.shader.getAttributeLocation('color');

        vba.bindVertexBufferToAttribute(vbo, vertex, 2, 4, 0);
        vba.bindVertexBufferToAttribute(vbo, tex, 2, 4, 2);
        vba.bindVertexBufferToAttribute(ColorVbo, colorLoc, 4, 4, 0);

        this.shader.use();
        this.shader.setModelViewMatrix(this.computeProjectionMatrix());
        this.shader.setProjectionMatrix(this.computModelMatrix());

        this.vba = vba;
    }

    private addCharInex(char: number, index: number): void {
        this.charToIndex.set(char, index);
    }

    private init(font: string, xfonts: number, yFonts: number, w: number, h: number, fonts: string): Promise<TextWriter> {
        this.charToIndex = new Map<number, number>();

        for (let x: number = 0; x < fonts.length; x++) {
            this.addCharInex(fonts.charCodeAt(x), x);
        }
        this.xfonts = xfonts;
        this.yfonts = yFonts;
        this.w = w;
        this.h = h;
        return Promise.all([
            TextureMappingShaderProgram.create().then(
                (shader: TextureMappingShaderProgram) => {
                    this.shader = shader;
                }
            ),
            TextureUtils.load(font).then(
                (texture: Texture) => this.texture = texture
            )
        ]).then(() => {
            this.initVBOs();
            return this;
        });
    }

}
