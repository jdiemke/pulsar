import { Face } from './face';
import { Mesh } from './mesh';
import { TexCoord } from './tex-coord';
import { Vector } from './vector';

export function convertToMeshArray(data: string): Array<Mesh> {
    const json: Array<Mesh> = new Array<Mesh>();

    let currentObject: Mesh = null;

    let normalCount: number = 0;
    let vertexCount: number = 0;
    let uvCount: number = 0;
    let normalOffset: number = 0;
    let vertexOffset: number = 0;
    let uvOffset: number = 0;

    data.toString().split('\n').forEach((line: string) => {

        if (line.startsWith('o ')) {
            const coords: Array<string> = line.split(' ');

            currentObject = new Mesh();
            currentObject.name = coords[1];
            currentObject.normals = [];
            currentObject.vertices = [];
            currentObject.faces = [];
            currentObject.uv = []; // OPTIONAL

            json.push(currentObject);
            normalOffset = normalCount;
            vertexOffset = vertexCount;
            uvOffset = uvCount;
        }

        if (currentObject === null &&
            (line.startsWith('v ') ||
            line.startsWith('vn ') ||
            line.startsWith('vt '))) {
                console.error('Error: OBJ file does not contain Objects.');
                throw Error();
            }

        if (line.startsWith('v ')) {
            const coords: Array<string> = line.split(' ');

            const vertex: Vector = new Vector(
                Number.parseFloat(coords[1]),
                Number.parseFloat(coords[2]),
                Number.parseFloat(coords[3])
            );

            currentObject.vertices.push(vertex);
            vertexCount++;
        }

        if (line.startsWith('vn ')) {
            const coords: Array<string> = line.split(' ');

            const normal: Vector = new Vector(
                Number.parseFloat(coords[1]),
                Number.parseFloat(coords[2]),
                Number.parseFloat(coords[3])
            );

            currentObject.normals.push(normal);
            normalCount++;
        }

        if (line.startsWith('vt ')) { // OPTIONAL
            const coords: Array<string> = line.split(' ');

            const uv: TexCoord = new TexCoord(
                Number.parseFloat(coords[1]),
                Number.parseFloat(coords[2])
            );

            currentObject.uv.push(uv);
            uvCount++;
        }

        if (line.startsWith('f ')) {
            const coords: Array<string> = line.split(' ');

            const face: Face = new Face();
            face.vertices = [];
            face.normals = [];
            face.uv = [];

            // vertex indices
            face.vertices.push(Number(coords[1].split('/')[0]) - 1 - vertexOffset);
            face.vertices.push(Number(coords[2].split('/')[0]) - 1 - vertexOffset);
            face.vertices.push(Number(coords[3].split('/')[0]) - 1 - vertexOffset);

            // uv indices OPTIONAL!
            face.uv.push(Number(coords[1].split('/')[1]) - 1 - uvOffset);
            face.uv.push(Number(coords[2].split('/')[1]) - 1 - uvOffset);
            face.uv.push(Number(coords[3].split('/')[1]) - 1 - uvOffset);

            // normal indices
            face.normals.push(Number(coords[1].split('/')[2]) - 1 - normalOffset);
            face.normals.push(Number(coords[2].split('/')[2]) - 1 - normalOffset);
            face.normals.push(Number(coords[3].split('/')[2]) - 1 - normalOffset);

            currentObject.faces.push(face);
        }
    });

    return json;
}
