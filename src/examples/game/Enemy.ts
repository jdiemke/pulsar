import { Vector4f } from "../particles/Vector4f";

export class Enemy {

    public position: Vector4f;
    public upd: () => Vector4f;

    constructor(pos: Vector4f, upd?: () => Vector4f) {
        this.position = pos;
        this.upd = upd;
    }

    public update(): void {
        this.position =  this.upd ? this.upd() :  this.position;
    }
}
