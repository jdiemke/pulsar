import { AABB } from "./AABB";
import { Player } from "./Player";
import { Portal } from "./Portal";

export class Sector {

    constructor(public aabb: AABB, public portals: Array<Portal>) {

    }

    contains(player: Player): unknown {
        return this.aabb.contains(player.position);
    }

    draw() {
        this.aabb.draw();
    }
}
