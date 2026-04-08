import { Vector2 } from "./Vector2";


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
