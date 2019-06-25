import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureUnit } from '../../core/texture/TextureUnit';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { ElementBufferObject } from '../../ElementBufferObject';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { BackgroundImage } from '../image/Effect';
import { GreenShaderProgram } from './GreenShaderProgram';
import { Vector4f } from './Vector4f';

export class Scene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: GreenShaderProgram;
    private array: Array<number> = new Array<number>();
    private array2: Array<number> = new Array<number>();
    private texture: Texture;
    private texture2: Texture;
    private background: BackgroundImage;
    private vba: VertexArrayObject;

    public preload(): Promise<any> {
        return Promise.all([GreenShaderProgram.create().then(
            (shaderProgram: GreenShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
        TextureUtils.load(require('./../../assets/textures/metal.png')).then((texture: Texture) => {
            this.texture = texture;
        }),
        TextureUtils.load(require('./../../assets/textures/env.jpg')).then((texture: Texture) => {
            this.texture2 = texture;
        }),
        BackgroundImage.create().then((backgroundImage: BackgroundImage) => {
            this.background = backgroundImage;
        })
        ]);
    }

    public addIndex(array: Array<number>, points: Array<Vector4f>, normals: Array<Vector4f>, tex: Array<Vector4f>, index: number): void {
        array.push(points[index].x);
        array.push(points[index].y);
        array.push(points[index].z);
        array.push(normals[index].x);
        array.push(normals[index].y);
        array.push(normals[index].z);
        array.push(tex[index].x);
        array.push(tex[index].y);
    }

    public init2(): void {
        const array: Array<number> = this.array;

        const points: Array<Vector4f> = [];
        const normals: Array<Vector4f> = [];
        const tex: Array<Vector4f> = [];

        let STEPS = 160;
        let STEPS2 = 16;
        for (let i = 0; i < STEPS + 1; i++) {
            let frame = this.torusFunction3(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction3(i * 2 * Math.PI / STEPS + 0.1);

            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            let right = tangent.cross(up).normalize().mul(20.0);
            up = right.cross(tangent).normalize().mul(20.0);

            for (let r = 0; r < STEPS2 + 1; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos.mul(1));
                normals.push(pos.sub(frame).normalize());
                tex.push(new Vector4f(r / STEPS2 * 2, i / STEPS * 8, 0, 0));
            }
        }
        console.log('points', points.length);

        STEPS++;
        STEPS2++;

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                const idx1 = ((STEPS2 * j) + (1 + i) % STEPS2) % points.length;
                const idx2 = ((STEPS2 * j) + (0 + i) % STEPS2) % points.length;
                const idx3 = ((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length;

                const idx4 = ((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2) % points.length; //4
                const idx5 = ((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length; //3
                const idx6 = ((STEPS2 * j) + (0 + i) % STEPS2) % points.length; // 5

                this.addIndex(array, points, normals, tex, idx1);
                this.addIndex(array, points, normals, tex, idx2);
                this.addIndex(array, points, normals, tex, idx3);
                this.addIndex(array, points, normals, tex, idx4);
                this.addIndex(array, points, normals, tex, idx5);
                this.addIndex(array, points, normals, tex, idx6);
            }
        }

        console.log('vertices', array.length / 8);

        const vbo: VertexBufferObject = new VertexBufferObject(array);

        const vba: VertexArrayObject = new VertexArrayObject();
        this.vba = vba;

        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');
        const color: number = this.colorShaderProgram.getAttributeLocation('vcolor');
        const texture: number = this.colorShaderProgram.getAttributeLocation('texcoord');

        vba.bindVertexBufferToAttribute(vbo, vertex, 3, 8, 0);
        vba.bindVertexBufferToAttribute(vbo, color, 3, 8, 3);
        vba.bindVertexBufferToAttribute(vbo, texture, 2, 8, 6);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());
        this.colorShaderProgram.setTextureUnit(0);
        this.colorShaderProgram.setTextureUni2t(1);

        vba.bind();
        this.texture.bind(TextureUnit.UNIT_0);
        this.texture2.bind(TextureUnit.UNIT_1);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
    }

    public init(): void {
        const array: Array<number> = this.array;

        const points: Array<Vector4f> = [];

        let STEPS = 160;
        let STEPS2 = 16;

        const array2 = this.array2;
        for (let i = 0; i < STEPS + 1; i++) {
            let frame = this.torusFunction3(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction3(i * 2 * Math.PI / STEPS + 0.1);

            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            let right = tangent.cross(up).normalize().mul(20.0);
            up = right.cross(tangent).normalize().mul(20.0);

            for (let r = 0; r < STEPS2 + 1; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                const p = pos;
                const n = pos.sub(frame).normalize()
                const t = new Vector4f(r / STEPS2 * 2, i / STEPS * 8, 0, 0);

                array.push(p.x);
                array.push(p.y);
                array.push(p.z);
                array.push(n.x);
                array.push(n.y);
                array.push(n.z);
                array.push(t.x);
                array.push(t.y);
                points.push(p);
            }
        }
        console.log('points', points.length);

        STEPS++;
        STEPS2++;

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                const idx1 = ((STEPS2 * j) + (1 + i) % STEPS2) % points.length;
                const idx2 = ((STEPS2 * j) + (0 + i) % STEPS2) % points.length;
                const idx3 = ((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length;

                const idx4 = ((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2) % points.length; //4
                const idx5 = ((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length; //3
                const idx6 = ((STEPS2 * j) + (0 + i) % STEPS2) % points.length; // 5

                array2.push(idx1, idx2, idx3, idx4, idx5, idx6);
            }
        }

        console.log('vertices', array.length / 8);
        console.log('vertices', array2.length);

        const vbo: VertexBufferObject = new VertexBufferObject(array);

        const vba: VertexArrayObject = new VertexArrayObject();
        this.vba = vba;
        const ibo: ElementBufferObject = new ElementBufferObject(array2);

        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');
        const color: number = this.colorShaderProgram.getAttributeLocation('vcolor');
        const texture: number = this.colorShaderProgram.getAttributeLocation('texcoord');

        vba.bindVertexBufferToAttribute(vbo, vertex, 3, 8, 0);
        vba.bindVertexBufferToAttribute(vbo, color, 3, 8, 3);
        vba.bindVertexBufferToAttribute(vbo, texture, 2, 8, 6);
        vba.bindElementBuffer(ibo);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());
        this.colorShaderProgram.setTextureUnit(0);
        this.colorShaderProgram.setTextureUni2t(1);

        vba.bind();
        this.texture.bind(TextureUnit.UNIT_0);
        this.texture2.bind(TextureUnit.UNIT_1);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw Logo
        this.background.draw();

        // Draw Torus
        this.vba.bind();

        this.colorShaderProgram.use();
        this.colorShaderProgram.setProjectionMatrix(this.computeModelViewMatrix());

        this.texture.bind(TextureUnit.UNIT_0);
        this.texture2.bind(TextureUnit.UNIT_1);

        gl.drawElements(gl.TRIANGLES, this.array2.length, gl.UNSIGNED_INT, 0);
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 400.0);
    }

    private computeModelViewMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [Math.sin(Date.now() * 0.0005) * 64, Math.cos(Date.now() * 0.0005) * 32, -230]);
        mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0005);
        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0005);
        return mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0005);
    }

    private torusFunction3(alpha: number): Vector4f {
        let p = 2, q = 3;
        let r = 0.5 * (2 + Math.sin(q * alpha));
        return new Vector4f(r * Math.cos(p * alpha),
            r * Math.cos(q * alpha),
            r * Math.sin(p * alpha)).mul(50);
    }

}
