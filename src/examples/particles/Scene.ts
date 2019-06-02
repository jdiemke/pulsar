import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { GreenShaderProgram } from './GreenShaderProgram';
import { Face } from '../../model/face';
import { Mesh } from '../../model/mesh';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { Vector4f } from './Vector4f';
import { Texture, TextureUnit } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { BackgroundImage } from '../image/Effect';
import { ElementBufferObject } from '../../ElementBufferObject';

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
    private ibo: ElementBufferObject;
    private particles: Array<Vector4f> = new Array<Vector4f>();

    public preload(): Promise<any> {
        return Promise.all([GreenShaderProgram.create().then(
            (shaderProgram: GreenShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
        TextureUtils.load(require('./../../assets/textures/metal.png')).then((texture: Texture) => {
            this.texture = texture;
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
        this.updateParticles();

        const array: Array<number> = this.array;
        array.push(-0.5, 0.5, 0.0, 0.0, 0.0);
        array.push(0.5, 0.5, 0.0, 1.0, 0.0);
        array.push(0.5, -0.5, 0.0, 1.0, 1.0);
        array.push(-0.5, -0.5, 0.0, 0.0, 1.0);

        this.array2.push(3, 1, 0);
        this.array2.push(3, 2, 1);

        console.log('vertices', array.length / 5);
        console.log('vertices', this.array2.length);

        const vbo: VertexBufferObject = new VertexBufferObject(array);

        const vba: VertexArrayObject = new VertexArrayObject();
        this.vba = vba;
        const ibo: ElementBufferObject = new ElementBufferObject(this.array2);
        this.ibo = ibo;

        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');
        const texcoord: number = this.colorShaderProgram.getAttributeLocation('texcoord');


        vba.bindVertexBufferToAttribute(vbo, vertex, 3, 5, 0);
        vba.bindVertexBufferToAttribute(vbo, texcoord, 2, 5, 3);

        vba.bindElementBuffer(ibo);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());
        this.colorShaderProgram.setTextureUnit(0);
        this.colorShaderProgram.setTextureUni2t(1);

        gl.cullFace(gl.BACK);

        //   gl.enable(gl.CULL_FACE);
    }

    public updateParticles(): void {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                
                let x = (i-(9/2))*0.5;
                let y = (j-(9/2))*0.5;
                let z = (Math.sin(x*1.2+Date.now()*0.003)+Math.cos(y*1.2+Date.now()*0.003))*0.5;

                this.particles[i*10+j]=
                    new Vector4f(x, y, z, 1);
            }
        }
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw Logo
        this.background.draw();

        // Draw Torus
        this.vba.bind();
        gl.depthMask(false);
        this.colorShaderProgram.use();

        this.texture2.bind(TextureUnit.UNIT_0);
        gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);



        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -5]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0004, [1, 0, 0]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0004, [0, 1, 0]);
        // https://stackoverflow.com/questions/15697273/how-can-i-get-view-direction-from-the-opengl-modelview-matrix
        // http://blog.db-in.com/cameras-on-opengl-es-2-x/
        const viewDir = new Vector4f(this.modelViewMatrix[2], this.modelViewMatrix[6], this.modelViewMatrix[10], 0);

        this.updateParticles();
        this.particles.sort((a, b) => {
            return a.dot(viewDir) - b.dot(viewDir);
        });

        this.particles.forEach((p: Vector4f) => {
            this.colorShaderProgram.setProjectionMatrix(this.computeModelViewMatrix(p));
            gl.drawElements(gl.TRIANGLES, this.array2.length, gl.UNSIGNED_INT, 0);
        });
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 400.0);
    }

    private computeModelViewMatrix(p: Vector4f): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -5]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0004, [1, 0, 0]);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0004, [0, 1, 0]);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [p.x, p.y, p.z]);
        return mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [0.8, 0.8, 0.8]);
    }

}
