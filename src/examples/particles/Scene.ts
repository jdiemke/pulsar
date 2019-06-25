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
    private texture2: Texture;
    private background: BackgroundImage;
    private vba: VertexArrayObject;
    private posArray: VertexBufferObject;
    private particles: Array<Vector4f> = new Array<Vector4f>(100);
    private floatArray = new Float32Array(100 * 3);

    public preload(): Promise<any> {
        return Promise.all([GreenShaderProgram.create().then(
            (shaderProgram: GreenShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
        TextureUtils.load(require('./../../assets/textures/metal.png')).then((texture: Texture) => {
        }),
        TextureUtils.load(require('./../../assets/textures/ball.png')).then((texture: Texture) => {
            this.texture2 = texture;
        }),
        BackgroundImage.create().then((backgroundImage: BackgroundImage) => {
            this.background = backgroundImage;
        })
        ]);
    }

    public init(): void {
        this.particles = this.particles.fill(null).map(() => new Vector4f(0, 0, 0, 1));

        const array: Array<number> = this.array;
        array.push(-0.5, 0.5, 0.0, 0.0, 0.0);
        array.push(0.5, 0.5, 0.0, 1.0, 0.0);
        array.push(0.5, -0.5, 0.0, 1.0, 1.0);
        array.push(-0.5, -0.5, 0.0, 0.0, 1.0);

        this.array2.push(3, 1, 0);
        this.array2.push(3, 2, 1);

        const vbo: VertexBufferObject = new VertexBufferObject(array);

        const vba: VertexArrayObject = new VertexArrayObject();
        this.vba = vba;
        const ibo: ElementBufferObject = new ElementBufferObject(this.array2);
        this.posArray = new VertexBufferObject(null, 100 * 3 * 4, gl.DYNAMIC_DRAW);

        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');
        const texcoord: number = this.colorShaderProgram.getAttributeLocation('texcoord');
        const position: number = this.colorShaderProgram.getAttributeLocation('position');

        vba.bindVertexBufferToAttribute(vbo, vertex, 3, 5, 0);
        vba.bindVertexBufferToAttribute(vbo, texcoord, 2, 5, 3);
        vba.bindVertexBufferToAttribute(this.posArray, position, 3, 3, 0, 1);
        vba.bindElementBuffer(ibo);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());

        gl.cullFace(gl.BACK);
    }

    public updateParticles(): void {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {

                let x = (i - (9 / 2)) * 0.5;
                let y = (j - (9 / 2)) * 0.5;
                let z = (Math.sin(x * 1.2 + Date.now() * 0.003) + Math.cos(y * 1.2 + Date.now() * 0.003)) * 0.5;

                this.particles[i * 10 + j].x = x;
                this.particles[i * 10 + j].y = y;
                this.particles[i * 10 + j].z = z;
            }
        }

        // https://stackoverflow.com/questions/15697273/how-can-i-get-view-direction-from-the-opengl-modelview-matrix
        // http://blog.db-in.com/cameras-on-opengl-es-2-x/

        const viewDir = new Vector4f(this.modelViewMatrix[2], this.modelViewMatrix[6], this.modelViewMatrix[10], 0);

        this.particles.sort((a, b) => {
            // project particle on view direction vector
            return a.dot(viewDir) - b.dot(viewDir);
        });

        for (let i = 0; i < 100; i++) {
            const p = this.particles[i];
            this.floatArray[i * 3] = p.x;
            this.floatArray[i * 3 + 1] = p.y;
            this.floatArray[i * 3 + 2] = p.z;
        }

        this.posArray.update(this.floatArray);
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw Logo
        this.background.draw();

        // Draw Billboards
        this.drawBalls();
    }

    private drawBalls(): void {
        this.vba.bind();
        gl.depthMask(false);
        this.colorShaderProgram.use();

        this.texture2.bind(TextureUnit.UNIT_0);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);

        const mv: mat4 = this.computeModelViewMatrix();
        this.updateParticles();

        this.colorShaderProgram.setProjectionMatrix(mv);
        gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0, 100);
    }

    private computeModelViewMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -5]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0004, [1, 0, 0]);
        return mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0004, [0, 1, 0]);
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 400.0);
    }

}
