import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { Texture, TextureUnit } from '../../core/texture/Texture';
import { TextureUtils } from '../../core/utils/TextureUtils';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';
import { BackgroundImage } from '../image/Effect';
import { Vector4f } from '../torus-knot/Vector4f';
import { ControllableCamera } from './ControllableCamera';
import { Keyboard } from './Keyboard';
import { TextureMappingShaderProgram } from './TextureMappingShaderProgram';
import { GreenShaderProgram } from './GreenShaderProgram';
import { ElementBufferObject } from '../../ElementBufferObject';

export class ReflectionMappingScene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private colorShaderProgram: TextureMappingShaderProgram;
    private spriteShader: GreenShaderProgram;
    private vbo: VertexBufferObject;
    private vba: VertexArrayObject;
    private texture: Texture;
    private texture2: Texture;
    private length: number;
    private vao: VertexArrayObject;
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

    private levelColor: Array<Array<number>> = [
        [1, 1, 1, 1, 1, 3, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 4, 3, 5, 5],
        [1, 2, 2, 2, 2, 3, 2, 2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 3, 5],
        [1, 2, 2, 2, 2, 3, 2, 4, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 4, 3],
        [3, 3, 3, 3, 1, 3, 3, 3, 3, 5, 5, 5, 3, 4, 0, 1, 1, 1, 0, 0, 4],
        [3, 3, 3, 3, 1, 3, 3, 3, 5, 5, 5, 5, 5, 3, 4, 1, 1, 1, 0, 0, 1],
        [3, 3, 3, 3, 1, 3, 3, 3, 3, 5, 5, 5, 3, 4, 0, 1, 1, 4, 0, 0, 4],
        [1, 2, 2, 2, 2, 2, 2, 4, 4, 0, 0, 0, 4, 0, 0, 1, 1, 3, 4, 4, 3],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 0, 0, 1, 1, 5, 3, 3, 5],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 5, 5, 5, 5]
    ];

    private colorList: Array<Vector4f> = [
        new Vector4f(1, 1, 1),
        new Vector4f(1, 1, 1),
        new Vector4f(1, 1, 1),
        new Vector4f(0.5, 0.5, 0.5),
        new Vector4f(0.74, 0.74, 0.74),
        new Vector4f(0.25, 0.25, 0.25),
    ];

    private backgroundImage: BackgroundImage;
    private firstOff: number;

    private camera: ControllableCamera = new ControllableCamera(new Vector4f(1.5, 0.0, 1.5), Math.PI * 2 / 360 * 180);
    private keyboard: Keyboard = new Keyboard();
    public preload(): Promise<any> {
        return Promise.all([
            GreenShaderProgram.create().then(
                (shaderProgram: GreenShaderProgram) => {
                    this.spriteShader = shaderProgram;
                }),
            TextureMappingShaderProgram.create().then((shaderProgram: TextureMappingShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
            TextureUtils.load(require('./../../assets/textures/doom_tiles.png')).then((texture: Texture) => {
                texture.blocky(); // remove this hack
                this.texture = texture;
            }),
            BackgroundImage.create(require('./../../assets/textures/plasma-gun.png'))
                .then((backgroundImage: BackgroundImage) => {
                    backgroundImage.setPosition(640 - 64 * 4, 369 - 64 * 4, 128 * 4, 64 * 4);
                    this.backgroundImage = backgroundImage;
                }),
            TextureUtils.load(require('./../../assets/textures/shaman.png')).then((texture: Texture) => {
                texture.blocky();
                this.texture2 = texture;
            }),
        ]);
    }

    public init(): void {

        let xIdx = 1;
        let yIdx = 2;
        let tileArray = [
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
        tileArray = tileArray.concat([
            -0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 0.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 0.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            0.5, 0.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 0.0, -.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            -0.5, 0.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,

        ]);
        yIdx = 7;
        tileArray = tileArray.concat([

            0.5, 1.0, 0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx + 1.0 / 16,
            -0.5, 1.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,
            0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, -.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx,
            0.5, 1.0, -0.5, 1.0 / 8 * xIdx + 1.0 / 8, 1.0 / 16 * yIdx,
            -0.5, 1.0, 0.5, 1.0 / 8 * xIdx, 1.0 / 16 * yIdx + 1.0 / 16,

        ]);

        this.vbo = new VertexBufferObject(tileArray);
        const vao: VertexArrayObject = new VertexArrayObject();
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('vertex'), 3, 5, 0);
        vao.bindVertexBufferToAttribute(this.vbo, this.colorShaderProgram.getAttributeLocation('texcoord'), 2, 5, 3);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix2(this.computeProjectionMatrix());

        this.texture.bind();
        vao.bind();
        this.vao = vao;
        this.initSprites();
    }

    public initSprites(): void {
        const vertexData: Array<number> = [
            -0.5, +1.0, +0.0, +0.0, +0.0,
            +0.5, +1.0, +0.0, +1.0, +0.0,
            +0.5, -0.0, +0.0, +1.0, +1.0,
            -0.5, -0.0, +0.0, +0.0, +1.0
        ];

        const elementData: Array<number> = [
            3, 1, 0, 3, 2, 1
        ];

        const vbo: VertexBufferObject = new VertexBufferObject(vertexData);
        const ibo: ElementBufferObject = new ElementBufferObject(elementData);
        const vba: VertexArrayObject = new VertexArrayObject();

        vba.bindVertexBufferToAttribute(vbo, this.spriteShader.getAttributeLocation('vertex'), 3, 5, 0);
        vba.bindVertexBufferToAttribute(vbo, this.spriteShader.getAttributeLocation('texcoord'), 2, 5, 3);
        vba.bindElementBuffer(ibo);

        this.spriteShader.use();
        this.spriteShader.setModelViewMatrix(this.computeProjectionMatrix());

        this.vba = vba;
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

        this.InputAndCollision();
        this.drawLevel();
        this.drawEnemies();
        this.drawWeapon();
    }

    private drawEnemies(): void {
        this.vba.bind();

        this.spriteShader.use();
        this.texture2.bind(TextureUnit.UNIT_0);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);

        const mv: mat4 = this.camera.getMatrix();

        this.spriteShader.setProjectionMatrix(mv);

        const enemyPos: Vector4f = new Vector4f(
            5.5 + Math.sin(Date.now() * 0.0005) * 2,
            -0.5,
            2.0 + Math.sin(Date.now() * 0.0014) * 0.5
        );

        const enemyList: Array<Vector4f> = [
            enemyPos,
            new Vector4f(1.5, -0.5, 4.5),
            new Vector4f(1.5, -0.5, 5.5)
        ];

        enemyList.forEach((enemy: Vector4f) => {
            const color: Vector4f = this.colorList[this.levelColor[Math.floor(enemy.x)][Math.floor(enemy.z)]];
            this.spriteShader.setColor(color);
            this.spriteShader.setPos(enemy);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
        });
    }

    private drawWeapon(): void {
        const color: number = this.levelColor[Math.floor(this.camera.position.x)][Math.floor(this.camera.position.z)];

        this.backgroundImage.setColor(this.colorList[color]);
        this.backgroundImage.setPosition(
            640 - 64 * 4,
            369 - (64 - 15) * 4 + Math.sin(Date.now() * 0.003) * 3 * 4,
            128 * 4,
            64 * 4
        );
        this.backgroundImage.draw();
    }

    private InputAndCollision(): void {
        let oldPos = new Vector4f(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        if (this.keyboard.isDown(Keyboard.UP)) {
            this.camera.moveForward(0.04, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.DOWN)) {
            this.camera.moveBackward(0.04, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.LEFT)) {
            this.camera.turnLeft(0.02, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.KEY_A)) {
            this.camera.moveLeft(0.04, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.KEY_D)) {
            this.camera.moveRight(0.04, 1.0);
        }

        if (this.keyboard.isDown(Keyboard.RIGHT)) {
            this.camera.turnRight(0.02, 1.0);
        }

        let newPos = new Vector4f(oldPos.x, oldPos.y, oldPos.z);
        newPos.z = this.camera.position.z;

        // up movement collision
        if (newPos.z - oldPos.z > 0) {
            const leftTop = newPos.add(new Vector4f(-0.25, 0.0, 0.25));
            const rightTop = newPos.add(new Vector4f(0.25, 0.0, 0.25));

            if (this.hit(leftTop) || this.hit(rightTop)) {
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

            if (this.hit(leftTop2) || this.hit(rightTop2)) {
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
    }

    private drawLevel(): void {
        let cam = this.camera.getMatrix();
        this.vao.bind();
        this.texture.bind();
        this.colorShaderProgram.use();
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);

        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {


                this.colorShaderProgram.setColor(this.colorList[this.levelColor[i][j]]);

                if (this.level[i][j] === 1) {
                    let cam2 = this.computeModelViewMatrix(i, j, cam);
                    this.colorShaderProgram.setModelViewMatrix(cam2);
                    gl.drawArrays(gl.TRIANGLES, 0, this.length);
                } else {
                    let cam2 = this.computeModelViewMatrix(i, j, cam);
                    this.colorShaderProgram.setModelViewMatrix(cam2);
                    gl.drawArrays(gl.TRIANGLES, this.firstOff, 6 * 2);
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
        return mat;
    }

}
