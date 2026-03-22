import { Vector } from "../../model/Vector";

const canvas = document.getElementById("pulsar") as HTMLCanvasElement;


const ctx = canvas.getContext("2d")!;


class Vector2 {

    constructor(public x: number, public y: number) {

    }

    add(vector: Vector2) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    sub(vector: Vector2) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    normalize() {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if( length > 0)
            return this.mult(1/length)
        else
            return this;
    }

    dot(vector: Vector2) {
        return (this.x * vector.x + this.y * vector.y);
    }

    mult(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    orthogonal() {
        return new Vector2(-this.y, this.x);
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, 1, 1);
    }
}

class HalfSpace {
    public normal: Vector2;
    public distance: number;

}

export class Plane {

    public distance: number;
    public normal: Vector2;

    constructor(normal: Vector2, distance: number) {
        this.normal = normal;
        this.distance = distance;
    }

    public getNormal(): Vector2 {
        return this.normal;
    }

    public getDistance(): number {
        return this.distance;
    }

    public isInside(point: Vector2): boolean {
        const dot: number = point.dot(this.normal);
        return dot >= this.distance;
    }

    public computeIntersection(p1: Vector2, p2: Vector2): Vector2 {
        const dot1: number = p1.dot(this.normal);
        const dot2: number = p2.dot(this.normal);
        const scale: number = (this.distance - dot1) / (dot2 - dot1);
        return p2.sub(p1).mult(scale).add(p1);
    }

}

export class SutherlandHodgmanClipper {

    public static clip(portal: Array<Vector2>, planes: Array<Plane>): Vector2[] {
        let output: Array<Vector2> = portal;

        for (let j: number = 0; j < planes.length; j++) {
            const plane: Plane = planes[j];
            const input: Array<Vector2> = output;
            output = new Array<Vector2>();
            let p1: Vector2 = input[0];
            let p2: Vector2 = input[1];

            if (plane.isInside(p2)) {
                if (!plane.isInside(p1)) {
                    output.push(plane.computeIntersection(p1, p2));
                } else {
                    output.push(p1);
                }
                output.push(p2);
            } else {
                if (plane.isInside(p1)) {
                    output.push(p1);
                    output.push(plane.computeIntersection(p1, p2));
                }
            }

            if (output.length < 2) {
                break;
            }
        }

        return output;
    }

}

class Player {
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
        return new Vector2(Math.cos(angle), Math.sin(angle))
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

class Portal {
    public a: Vector2;
    public b: Vector2;

    constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
    }

    draw(color: string = 'red') {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
    }

}



const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

const player = new Player();
const portals = new Array<Portal>();
portals.push(new Portal(new Vector2(300, 120), new Vector2(300, 140)));
portals.push(new Portal(new Vector2(200, 120), new Vector2(300, 120)));

function loop(now: number) {
    if (keys['w']) {
        player.moveForward();

    }
    if (keys['a']) {
        player.turnLeft();
    }
    if (keys['s']) {
        player.moveBackward();
    }
    if (keys['d']) {
        player.turnRight();
    }

    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, 1000, 700);
        ctx.strokeStyle = 'grey';
       
            ctx.setLineDash([5, 6]);
    player.draw();
 ctx.setLineDash([]);
    portals.forEach(portal => {
        portal.draw();

        const clipped = SutherlandHodgmanClipper.clip([portal.a, portal.b], player.getPlanes());

        if (clipped.length == 2) {
            const p = new Portal(clipped[0], clipped[1]);
            p.draw('#00ff00');

            // comput clipped frustum
            const left = p.a.sub(player.position).normalize();
            const right = p.b.sub(player.position).normalize();

     
        const leftOrthi = left.orthogonal();
        const rightOrtho = right.orthogonal().mult(-1);
        ctx.beginPath();
        ctx.moveTo(player.position.x, player.position.y);
        const end2 = player.position.add(left.mult(400));
        ctx.lineTo(end2.x, end2.y);
        ctx.moveTo(player.position.x, player.position.y);
        const end3 = player.position.add(right.mult(400));
        ctx.lineTo(end3.x, end3.y);
        ctx.stroke();

                // normals
        const nStart = player.position.add(left.mult(50));
        ctx.beginPath();
        ctx.moveTo(nStart.x, nStart.y);
        const nEnd = nStart.add(leftOrthi.mult(10));
        ctx.lineTo(nEnd.x, nEnd.y);
        const nStart2 = player.position.add(right.mult(50));

        ctx.moveTo(nStart2.x, nStart2.y);
        const nEnd2 = nStart2.add(rightOrtho.mult(10));
        ctx.lineTo(nEnd2.x, nEnd2.y);
        ctx.stroke();
        }
    });



    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
