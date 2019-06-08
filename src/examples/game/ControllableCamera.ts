import { vec4, mat4 } from "gl-matrix";
import { Vector4f } from "../torus-knot/Vector4f";

export class ControllableCamera {

    public position: Vector4f;
    public yaw: number = 0.0;
    private mat: mat4 = mat4.create();

    constructor(pos: Vector4f,yaw: number) {
        this.position = pos;
        this.yaw =yaw;
    }

    public getMatrix(): mat4 {
        mat4.identity(this.mat);
        mat4.scale(this.mat, this.mat,[4,4,4]);
        mat4.rotateY(this.mat, this.mat, -this.yaw);
        
        return mat4.translate(this.mat, this.mat, [-this.position.x, 0, -this.position.z]);
    }

    public moveForward(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;

        this.position.x += distance * -Math.sin(this.yaw);
        this.position.z += distance * -Math.cos(this.yaw);
    }

    public moveBackward(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.position.x -= distance * -Math.sin(this.yaw);
        this.position.z -= distance * -Math.cos(this.yaw);
    }

    public turnLeft(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.yaw += distance;
    }

    public moveLeft(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.position.x += distance * -Math.sin(this.yaw+Math.PI/2);
        this.position.z += distance * -Math.cos(this.yaw+Math.PI/2);
    }

    public moveRight(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.position.x += distance * -Math.sin(this.yaw-Math.PI/2);
        this.position.z += distance * -Math.cos(this.yaw-Math.PI/2);
    }

    public turnRight(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.yaw -= distance;
    }



}
