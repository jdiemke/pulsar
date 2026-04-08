import { ctx } from "./main";
import { Vector2 } from "./Vector2";
import { Plane } from "./Plane";

export class Player {
    public position: Vector2;
    public direction: Vector2;
    public angle: number = 0;
    public fieldOfView: number = 45 * Math.PI / 180;

    constructor() {
        this.position = new Vector2(50, 50);
        this.direction = new Vector2(Math.cos(this.angle), Math.sin(this.angle));
    }

    moveForward() {
        this.position = this.position.add(this.direction);
    }


    moveBackward() {
        this.position = this.position.sub(this.direction);
    }

    turnLeft() {
        this.angle -= 0.01;
        this.direction = (new Vector2(Math.cos(this.angle), Math.sin(this.angle)));
    }

    turnRight() {
        this.angle += 0.01;
        this.direction = (new Vector2(Math.cos(this.angle), Math.sin(this.angle)));
    }

    getDir(angle: number) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    getPlanes() {
        const left = this.getDir(this.angle - this.fieldOfView / 2);
        const right = this.getDir(this.angle + this.fieldOfView / 2);
        const leftOrthi = left.orthogonal();
        const rightOrtho = right.orthogonal().mult(-1);
        return [
            new Plane(leftOrthi, this.position.dot(leftOrthi)),
            new Plane(rightOrtho, this.position.dot(rightOrtho))
        ];
    }

    draw() {
        // player
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        // direction
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        const end = this.position.add(this.direction.mult(10));
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        const left = this.getDir(this.angle - this.fieldOfView / 2);
        const right = this.getDir(this.angle + this.fieldOfView / 2);
        const leftOrthi = left.orthogonal();
        const rightOrtho = right.orthogonal().mult(-1);
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        const end2 = this.position.add(left.mult(400));
        ctx.lineTo(end2.x, end2.y);
        ctx.moveTo(this.position.x, this.position.y);
        const end3 = this.position.add(right.mult(400));
        ctx.lineTo(end3.x, end3.y);
        ctx.stroke();
        // normals
        const nStart = this.position.add(left.mult(50));
        ctx.beginPath();
        ctx.moveTo(nStart.x, nStart.y);
        const nEnd = nStart.add(leftOrthi.mult(10));
        ctx.lineTo(nEnd.x, nEnd.y);
        const nStart2 = this.position.add(right.mult(50));

        ctx.moveTo(nStart2.x, nStart2.y);
        const nEnd2 = nStart2.add(rightOrtho.mult(10));
        ctx.lineTo(nEnd2.x, nEnd2.y);
        ctx.stroke();
    }
}
