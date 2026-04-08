import { ctx } from "./main";
import { Sector } from "./Sector";
import { Vector2 } from "./Vector2";

export class Portal {
    public a: Vector2;
    public b: Vector2;
    public into?: Sector;

    constructor(a: Vector2, b: Vector2, into?: Sector) {
        this.a = a;
        this.b = b;
        this.into = into;
    }

    draw(color: string = 'red') {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
    }
}
