import { vec4, mat4 } from "gl-matrix";
import { Vector4f } from "../torus-knot/Vector4f";

export class ControllableCamera {

    private position: Vector4f;
    private yaw: number = 0.0;
    private mat: mat4 = mat4.create();

    constructor(pos: Vector4f,yaw: number) {
        this.position = pos;
        this.yaw =yaw;
    }

    public getMatrix(): mat4 {
        mat4.identity(this.mat);
        mat4.scale(this.mat, this.mat,[3,3,3]);
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

    public turnRight(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.yaw -= distance;
    }



}