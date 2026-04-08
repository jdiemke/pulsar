import { AABB } from "./AABB";
import { Plane } from "./Plane";
import { Player } from "./Player";
import { Portal } from "./Portal";
import { PortalClipper } from "./PortalClipper";
import { Sector } from "./Sector";
import { Vector2 } from "./Vector2";

const canvas = document.getElementById("pulsar") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;

const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

const player = new Player();
const sector3 = new Sector(new AABB(new Vector2(400, 0), new Vector2(600, 200)), []);
const sectors = Array<Sector>();


const portals2 = new Array<Portal>();
portals2.push(new Portal(new Vector2(400, 50), new Vector2(400, 150),sector3));
const sector2 = new Sector(new AABB(new Vector2(200, 0), new Vector2(400, 200)), portals2);
const portals = new Array<Portal>();
portals.push(new Portal(new Vector2(200, 50), new Vector2(200, 150),sector2));
portals.push(new Portal(new Vector2(50, 200), new Vector2(150, 200)));

const sector1 = new Sector(new AABB(new Vector2(0, 0), new Vector2(200, 200)), portals);

sectors.push(sector1);
sectors.push(sector2);
sectors.push(sector3);

class PortalRenderer {

    constructor(public sectors: Array<Sector>) {

    }

    computePlanes(left: Vector2, right: Vector2, leftOrtho: Vector2, rightOrtho: Vector2) {
    
        return [
            new Plane(leftOrtho, player.position.dot(leftOrtho)),
            new Plane(rightOrtho, player.position.dot(rightOrtho))
        ];
    }

    drawVisibleSectors(currentSector: Sector, viewPlanes: Plane[]) {

        currentSector?.portals.forEach(portal => {
            portal.draw();

            const clipped = PortalClipper.clip([portal.a, portal.b], viewPlanes);

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

                if (portal.into) {
                    portal.into.draw();
                    this.drawVisibleSectors(portal.into, this.computePlanes(left, right,leftOrthi, rightOrtho));
                }

            }
        });

    }

    render(player: Player) {

        // 1. find sector containing player
        const activeSector = sectors.find(sector => sector.contains(player));



        ctx.setLineDash([]);
        activeSector?.draw();
        const viewPlanes: Plane[] = player.getPlanes();

        if (activeSector) {
            this.drawVisibleSectors(activeSector, viewPlanes);
        }


    }
}


const portalRenderer = new PortalRenderer(sectors);

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

    portalRenderer.render(player);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
