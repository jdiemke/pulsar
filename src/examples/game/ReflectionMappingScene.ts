import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { TextureMappingShaderProgram } from '../../shader-programs/texture-mapping/TextureMappingShaderProgram';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { Vector4f } from '../torus-knot/Vector4f';
import { ControllableCamera } from './ControllableCamera';
import { Keyboard } from './Keyboard';

export class ReflectionMappingScene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: TextureMappingShaderProgram;
    private vbo: VertexBufferObject;
    private texture: Texture;
    private length: number;
    private level: Array<Array<number>> = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    private firstOff: number;

    private camera: ControllableCamera = new ControllableCamera(new Vector4f(1.5, 0.0, 1.5), Math.PI * 2 / 360 * 180);
    private keyboard: Keyboard = new Keyboard();
    public preload(): Promise<any> {
        return Promise.all([
            TextureMappingShaderProgram.create().then((shaderProgram: TextureMappingShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
            TextureUtils.load(require('./../../assets/textures/doom_tiles.png')).then((texture: Texture) => {
                texture.blocky(); // remove this hack
                this.texture = texture;
            })
        ]);
    }

    public init(): void {

        let xIdx = 1;
        let yIdx = 2;
        let array = [
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
        ];

        this.length = 6 * 4;
        this.firstOff = 6 * 4;
        xIdx = 0;
        yIdx = 1;
        array = array.concat( [
            -0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 0.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 0.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            0.5, 0.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 0.0, -.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            -0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,

        ]);
        yIdx = 7;
        array = array.concat( [
            
            0.5, 1.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            -0.5, 1.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, -.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,

        ]);

        this.vbo = new VertexBufferObject(array);
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

    public hit(pos: Vector4f): boolean {
       

        let val = this.level[Math.floor(pos.x)][Math.floor(pos.z)];
        if (val === 1 || val === undefined) {
            return true;
        }
        return false;
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let oldPos = new Vector4f(this.camera.position.x, this.camera.position.y, this.camera.position.z);
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


        let newPos = new Vector4f(oldPos.x, oldPos.y, oldPos.z);
        newPos.z = this.camera.position.z;

        // up movement collision
        if (newPos.z - oldPos.z > 0) {
          
            const leftTop = newPos.add(new Vector4f(-0.25, 0.0, 0.25));
            const rightTop = newPos.add(new Vector4f(0.25, 0.0, 0.25));
        

            if (this.hit(leftTop)  || this.hit(rightTop)) {
                
                newPos.z = Math.floor(leftTop.z) - 0.2501;
            }
            
           
        } else if (newPos.z - oldPos.z < 0) {
           

            const leftBottom = newPos.add(new Vector4f(-0.25, 0.0, -0.25));
            const rightBottom = newPos.add(new Vector4f(0.25, 0.0, -0.25));
           
            if (this.hit(leftBottom) || this.hit(rightBottom)) {
               
                newPos.z = Math.floor(leftBottom.z) + 1 + 0.2501;
                
            }
           
        }

        newPos.x = this.camera.position.x;

        // right
        if (newPos.x - oldPos.x > 0) {
            
            const leftTop2 = newPos.add(new Vector4f(0.25, 0.0, 0.25));
            const rightTop2 = newPos.add(new Vector4f(0.25, 0.0, -0.25));
         
          
            if (this.hit(leftTop2)  || this.hit(rightTop2)) {
               
                newPos.x = Math.floor(leftTop2.x) - 0.2501;
            }
           
        } else if (newPos.x - oldPos.x < 0) {
            
            const leftTop3 = newPos.add(new Vector4f(-0.25, 0.0, 0.25));
            const rightTop3 = newPos.add(new Vector4f(-0.25, 0.0, -0.25));
            if (this.hit(leftTop3) || this.hit(rightTop3)) {
                
                newPos.x = Math.floor(leftTop3.x) + 1 + 0.2501;
            }
           
        }

        this.camera.position = newPos;

        let cam = this.camera.getMatrix();

        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {

                if (this.level[i][j] === 1) {
                    let cam2 = this.computeModelViewMatrix(i, j, cam);

                    this.colorShaderProgram.setProjectionMatrix(cam2);
                    // this.vbo.draw(this.length);
                    gl.drawArrays(gl.TRIANGLES, 0, this.length);
                } else {
                    let cam2 = this.computeModelViewMatrix(i, j, cam);

                    this.colorShaderProgram.setProjectionMatrix(cam2);
                    // this.vbo.draw(this.length);
                    gl.drawArrays(gl.TRIANGLES, this.firstOff, 6*2);
                }
            }
        }

    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 0.1, 40.0);
    }

    private computeModelViewMatrix(x: number, y: number, cam: mat4): mat4 {

        mat4.translate(this.modelViewMatrix, cam, [-0.0, -0.5, -0.0]);

        let mat = mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [x + 0.5, 0, y + 0.5]);
        // console.log(mat);
        return mat;

    }

}
