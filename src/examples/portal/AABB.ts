import { Vector2 } from "./Vector2";
import { ctx } from "./main";

export class AABB {

    constructor(public min: Vector2, public max: Vector2) {
    }

    contains(position: Vector2): unknown {
        return position.x >= this.min.x &&
               position.x <= this.max.x &&
               position.y >= this.min.y &&
               position.y <= this.max.y;
    }

    draw() {
        ctx.setLineDash([]);
        ctx.strokeStyle = '#1435ca';
        ctx.strokeRect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.min.y);
    }
}
