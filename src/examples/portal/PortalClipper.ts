import { Vector2 } from "./Vector2";
import { Plane } from "./Plane";

export class PortalClipper {

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
