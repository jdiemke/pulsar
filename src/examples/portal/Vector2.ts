import { ctx } from "./main";


export class Vector2 {

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
        if (length > 0)
            return this.mult(1 / length);

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
