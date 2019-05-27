import { Logger } from '../core/Logger';
import { VertexBufferObject } from '../VertexBufferObject';
import { Face } from './face';
import { Mesh } from './mesh';
import { convertToMeshArray } from './parseUtils';

export class WavefrontLoader {

    public static load(filename: string): Promise<Array<Mesh>> {
        const startTime: number = Date.now();

        return fetch(filename).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<Mesh> => {
            return convertToMeshArray(text);
        }).finally(() => {
            const elapsedTime: number = (Date.now() - startTime);
            WavefrontLoader.logger.measure(elapsedTime, 'Finished loading model', filename);
        });
    }

    public static loadIntoVbo(filename: string): Promise<{ vbo: VertexBufferObject, length: number }> {
        return WavefrontLoader.load(filename).then((value) => {
            const array: Array<number> = new Array<number>();
            let length: number = 0;

            value.forEach((mesh: Mesh) => {
                mesh.faces.forEach((face: Face) => {
                    array.push(mesh.vertices[face.vertices[0]].x);
                    array.push(mesh.vertices[face.vertices[0]].y);
                    array.push(mesh.vertices[face.vertices[0]].z);

                    array.push(mesh.normals[face.normals[0]].x);
                    array.push(mesh.normals[face.normals[0]].y);
                    array.push(mesh.normals[face.normals[0]].z);

                    array.push(mesh.vertices[face.vertices[1]].x);
                    array.push(mesh.vertices[face.vertices[1]].y);
                    array.push(mesh.vertices[face.vertices[1]].z);

                    array.push(mesh.normals[face.normals[1]].x);
                    array.push(mesh.normals[face.normals[1]].y);
                    array.push(mesh.normals[face.normals[1]].z);

                    array.push(mesh.vertices[face.vertices[2]].x);
                    array.push(mesh.vertices[face.vertices[2]].y);
                    array.push(mesh.vertices[face.vertices[2]].z);

                    array.push(mesh.normals[face.normals[2]].x);
                    array.push(mesh.normals[face.normals[2]].y);
                    array.push(mesh.normals[face.normals[2]].z);
                    length += 3;
                });
            });

            return { vbo: new VertexBufferObject(array), length };
        });
    }

    private static logger: Logger = new Logger('WavefrontLoader');

    private constructor() {

    }

}
