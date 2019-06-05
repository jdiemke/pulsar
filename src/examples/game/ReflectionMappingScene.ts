import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { Face } from '../../model/face';
import { Mesh } from '../../model/mesh';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { SphereMappingShaderProgram } from '../../shader-programs/sphere-mapping/SphereMappingShaderProgram';
import { VertexBufferObject } from '../../VertexBufferObject';
import { TextureMappingShaderProgram } from '../../shader-programs/texture-mapping/TextureMappingShaderProgram';
import { VertexArrayObject } from '../../VertextArrayObject';
import { ControllableCamera } from './ControllableCamera';
import { Vector4f } from '../torus-knot/Vector4f';
import { Keyboard } from './Keyboard';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

export class ReflectionMappingScene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: TextureMappingShaderProgram;
    private vbo: VertexBufferObject;
    private texture: Texture;
    private length: number;
    private level: Array<Array<number>> = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    private camera: ControllableCamera = new ControllableCamera(new Vector4f(1.0, 1.0, 0.0), Math.PI* 2/360*180);
    private keyboard = new Keyboard();
    public preload(): Promise<any> {
        return Promise.all([
            TextureMappingShaderProgram.create().then((shaderProgram: TextureMappingShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
            TextureUtils.load(require('./../../assets/textures/doom_tiles.png')).then((texture: Texture) => {
                texture.blocky();
                this.texture = texture;
            })
        ]);
    }

    public init(): void {
        
        const xIdx = 1;
        const yIdx = 2;
        this.vbo = new VertexBufferObject([
            -0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 0.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 1.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            0.5, 1.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            -0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,

            0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 0.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            0.5, 1.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,

            0.5, 0.0, -0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            -0.5, 0.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            -0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            0.5, 1.0, -0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            0.5, 0.0, -0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,

            -0.5, 0.0, -0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            -0.5, 0.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            -0.5, 1.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, -0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            -0.5, 0.0, -0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
        ]);
        this.length = 6 * 4;

        const vao: VertexArrayObject = new VertexArrayObject();
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('vertex'), 3, 5, 0);
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('texcoord'), 2, 5, 3);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.cullFace(gl.BACK);
         gl.enable(gl.CULL_FACE);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());

        this.texture.bind();
        vao.bind();
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (this.keyboard.isDown(Keyboard.UP)) {
            this.camera.moveForward(0.03, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.DOWN)) {
            this.camera.moveBackward(0.03, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.LEFT)) {
            this.camera.turnLeft(0.015, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.RIGHT)) {
            this.camera.turnRight(0.015, 1.0);
        }

        let cam = this.camera.getMatrix();


        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {

                if (this.level[i][j] === 1) {
                    let cam2 = this.computeModelViewMatrix(i, j, cam);

                    this.colorShaderProgram.setProjectionMatrix(cam2);
                    this.vbo.draw(this.length);
                }
            }
        }

    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 40.0);
    }

    private computeModelViewMatrix(x: number, y: number, cam: mat4): mat4 {

        mat4.translate(this.modelViewMatrix, cam, [-0.0, -0.5, -1.0]);

        let mat = mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [x, 0, y]);
        // console.log(mat);
        return mat;

    }

}
