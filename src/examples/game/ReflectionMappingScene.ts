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
import { TextWriter } from '../text/TextWriter';
import { Vector4f } from '../torus-knot/Vector4f';
import { ControllableCamera } from './ControllableCamera';
import { Enemy } from './Enemy';
import { GreenShaderProgram } from './GreenShaderProgram';
import { Key, Keyboard } from './Keyboard';
import { MouseButton } from './MouseButton';
import { TextureMappingShaderProgram } from './TextureMappingShaderProgram';

class Bullet {
    public pos: Vector4f;
    public direction: Vector4f;
    public hitTime: number;

    constructor(pos: Vector4f, dir: Vector4f) {
        this.pos = pos;
        this.direction = dir;
    }

    public advance(level?: Array<Array<number>>): void {
        this.pos = this.pos.add(this.direction.mul(0.2));
    }
}

class BulletSystem {

    public bullets: Array<Bullet> = new Array<Bullet>();
    private index: number = 0;
    private count: number = 10;

    public addBullet(bullet: Bullet): void {
        this.bullets[this.index] = bullet;
        this.index = (this.index + 1) % this.count;
    }

}

// tslint:disable-next-line: max-classes-per-file
export class ReflectionMappingScene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();

    private lastBullet: number = Date.now();
    private colorShaderProgram: TextureMappingShaderProgram;
    private spriteShader: GreenShaderProgram;
    private vbo: VertexBufferObject;
    private vba: VertexArrayObject;

    private bulletSystem: BulletSystem = new BulletSystem();
    private textWriter: TextWriter;
    private texture: Texture;
    private bulletTexture: Texture;
    private moveAnim: number = 0.0;
    private moveAnimScale: number = 0.015;
    private texture2: Texture;
    private length: number;
    private vao: VertexArrayObject;
    private level: Array<Array<number>> = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    private levelColor: Array<Array<number>> = [
        [1, 1, 1, 1, 1, 6, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 4, 3, 5, 5],
        [1, 2, 2, 2, 2, 6, 2, 2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 3, 5],
        [1, 2, 2, 2, 2, 6, 2, 4, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 4, 3],
        [3, 3, 3, 3, 1, 6, 3, 3, 3, 5, 5, 5, 3, 4, 0, 1, 1, 1, 0, 0, 4],
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
        new Vector4f(0.75, 0.5, 0.5),
    ];

    private backgroundImage: BackgroundImage;
    private firstOff: number;

    private camera: ControllableCamera = new ControllableCamera(new Vector4f(1.5, 0.0, 1.5), Math.PI * 2 / 360 * -90);
    private keyboard: Keyboard = new Keyboard();

    private turnRight: number = 0;
    private turnLeft: number = 0;
    private mouseDown: boolean = false;

    private enemyList: Array<Enemy> = new Array<Enemy>();
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
            TextureUtils.load(require('./../../assets/textures/bullet.png')).then((texture: Texture) => {
                texture.blocky();
                this.bulletTexture = texture;
            }),
            TextWriter.create(
                require('./../text/font.png'),
                32, 2, 8, 8,
                ' !\'><@+\'()@+,-./0123456789:; = ? ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            ).then(
                (t: TextWriter) => this.textWriter = t
            )
        ]);
    }

    public init(canvas: HTMLCanvasElement): void {
        this.enemyList.push(new Enemy(new Vector4f(1.5, -0.5, 4.5)));
        this.enemyList.push(new Enemy(new Vector4f(1.5, -0.5, 5.5)));
        this.enemyList.push(new Enemy(new Vector4f(1.5, -0.5, 5.5), (): Vector4f => new Vector4f(
            5.5 + Math.sin(Date.now() * 0.0005) * 2,
            -0.5,
            2.0 + Math.sin(Date.now() * 0.0014) * 0.5
        )));

        canvas.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.button === MouseButton.LEFT_BUTTON) {
                this.mouseDown = true;
            }
        });
        canvas.addEventListener('mouseup', (event: MouseEvent) => {
            if (event.button === MouseButton.LEFT_BUTTON) {
                this.mouseDown = false;
            }
        });

        document.addEventListener('mousemove', (event: MouseEvent) => {
            if (document.pointerLockElement) {
                if (event.movementX > 0) {
                    this.turnRight += event.movementX;
                }

                if (event.movementX < 0) {
                    this.turnLeft += -event.movementX;
                }
            }
        }, false);

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

        gl.clearColor(0.28, 0.63, 0.21, 1.0);
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

        this.drawHeadUpDisplay();
    }

    private frameCounter: number = 0;
    private lastTime: number = null;
    private fps: number = 0;

    private drawHeadUpDisplay(): void {
        this.computeFPS();

        this.textWriter.begin();

        this.textWriter.setCurrentColor([1, 0.0, 0.0, 1]);
        this.textWriter.setCurrentScale(2);
        this.textWriter.addText(8, 8, 'FPS: ' + this.fps);

        this.textWriter.setCurrentColor([1, 1, 1, 1]);
        this.textWriter.setCurrentScale(4);
        this.textWriter.addText(8, 320, '100+');

        this.textWriter.end();

        this.textWriter.draw();
    }

    // TODO: move into separate class
    private computeFPS(): void {
        const currentTime: number = Date.now();

        if (this.lastTime === null) {
            this.lastTime = currentTime;
        }

        if (currentTime - this.lastTime > 1000) {
            this.fps = this.frameCounter;
            this.frameCounter = 0;
            this.lastTime = currentTime;
        }

        this.frameCounter++;
    }

    /**
     * https://www.khronos.org/opengl/wiki/Transparency_Sorting
     */
    private drawEnemies(): void {
        this.vba.bind();

        this.spriteShader.use();
        this.texture2.bind(TextureUnit.UNIT_0);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);

        // FIXME: move animation in 2 places: level drawing and enemies
        const mv: mat4 = mat4.translate(
            this.modelViewMatrix,
            this.camera.getMatrix(),
            [-0.0, -0.0 + Math.sin(this.moveAnim) * this.moveAnimScale, -0.0]
        );

        this.spriteShader.setProjectionMatrix(mv);
        this.spriteShader.setScale(1.0);

        this.enemyList.forEach(x => x.update());

        this.enemyList.forEach((enemy: Enemy) => {

            const color: Vector4f = this.colorList[this.levelColor[Math.floor(enemy.position.x)][Math.floor(enemy.position.z)]];
            this.spriteShader.setColor(color);
            this.spriteShader.setPos(enemy.position);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
        });

        if (this.bulletSystem.bullets) {
            this.bulletTexture.bind(TextureUnit.UNIT_0);
            this.spriteShader.setColor(new Vector4f(1, 1, 1));

            this.bulletSystem.bullets.forEach(bullet => {

                if (!bullet.hitTime || bullet.hitTime + 200 > Date.now()) {
                    const pos = bullet.pos;
                    if (bullet.hitTime) {

                        let scale;
                        if (Date.now() - bullet.hitTime < 100) {
                            scale = Math.sin(Math.PI / 200 * (Date.now() - bullet.hitTime)) * 0.1;
                        } else {
                            scale = Math.sin(Math.PI / 200 * (Date.now() - (bullet.hitTime))) * (0.1 + 0.15);
                        }
                        this.spriteShader.setScale(scale + 0.15);
                        this.spriteShader.setPos(pos.sub(new Vector4f(0, scale / 2, 0)));
                    } else {
                        this.spriteShader.setScale(0.15);
                        this.spriteShader.setPos(pos);
                    }

                    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
                }
            });
        }
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
        const oldPos: Vector4f = new Vector4f(this.camera.position.x, this.camera.position.y, this.camera.position.z);

        let moving: boolean = false;

        if (this.keyboard.isDown(Key.W)) {
            this.camera.moveForward(0.04, 1.0);
            moving = true;
        }

        if (this.keyboard.isDown(Key.S)) {
            this.camera.moveBackward(0.04, 1.0);
            moving = true;
        }

        if (this.keyboard.isDown(Key.LEFT) || this.turnLeft) {
            this.camera.turnLeft(this.turnLeft * 0.002, 1.0);
            this.turnLeft = 0;
        }

        if (this.keyboard.isDown(Key.A)) {
            this.camera.moveLeft(0.04, 1.0);
            moving = true;
        }

        if (this.keyboard.isDown(Key.D)) {
            this.camera.moveRight(0.04, 1.0);
            moving = true;
        }

        if (this.keyboard.isDown(Key.RIGHT) || this.turnRight) {
            this.camera.turnRight(this.turnRight * 0.002, 1.0);
            this.turnRight = 0;
        }

        if (moving) {
            this.moveAnim += 0.2;
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

        if (this.bulletSystem.bullets) {
            this.bulletSystem.bullets.forEach(bullet => {
                if (!bullet.hitTime) {
                    const oldPos = bullet.pos;
                    bullet.advance();

                    this.enemyList = this.enemyList.filter(enemy => {
                        const hit = enemy.position.sub(bullet.pos).length() < 0.5;
                        if (hit) {
                            bullet.pos = oldPos;
                            bullet.hitTime = Date.now();
                        }
                        return !hit;
                    });

                    if (!bullet.hitTime && this.hit(bullet.pos)) {
                        bullet.pos = oldPos;
                        bullet.hitTime = Date.now();
                    }
                }
            });
        }

        if ((this.keyboard.isDown(Key.L) || this.mouseDown) && this.lastBullet + 200 < Date.now()) {
            this.lastBullet = Date.now();
            this.bulletSystem.addBullet(new Bullet(
                new Vector4f(
                    this.camera.position.x,
                    this.camera.position.y - 0.12,
                    this.camera.position.z
                ).add(this.camera.getOrthoDirection().mul(0.07)).add(
                    this.camera.getDirection().mul(0.25)
                ),
                this.camera.getDirection()
            ));
        }
        /*
        console.log('bullets: ', this.bulletSystem.bullets.length);
        console.log('inactive bullets: ',
            this.bulletSystem.bullets.filter(bullet => {

                return (bullet.hitTime + 200) < Date.now();
            }).length);
            */
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
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 0.1, 100.0);
    }

    private computeModelViewMatrix(x: number, y: number, cam: mat4): mat4 {
        mat4.translate(this.modelViewMatrix, cam, [-0.0, -0.5 + Math.sin(this.moveAnim) * this.moveAnimScale, -0.0]);
        let mat = mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [x + 0.5, 0, y + 0.5]);
        return mat;
    }

}
