import { mat4 } from 'gl-matrix';
import { AbstractScene } from '../../AbstractScene';
import { context as gl } from '../../core/RenderingContext';
import { GreenShaderProgram } from './GreenShaderProgram';
import { Face } from '../../model/face';
import { Mesh } from '../../model/mesh';
import { WavefrontLoader } from '../../model/WavefrontLoader';
import { VertexBufferObject } from '../../VertexBufferObject';
import { VertexArrayObject } from '../../VertextArrayObject';

export class Scene extends AbstractScene {

    private projectionMatrix: mat4 = mat4.create();
    private modelViewMatrix: mat4 = mat4.create();
    private normal: mat4 = mat4.create();

    private colorShaderProgram: GreenShaderProgram;
    private meshes: Array<Mesh>;

    public preload(): Promise<any> {
        return Promise.all([GreenShaderProgram.create().then(
            (shaderProgram: GreenShaderProgram) => {
                this.colorShaderProgram = shaderProgram;
            }),
        WavefrontLoader.load(require('./assets/dragon.obj')).then((mesh: Array<Mesh>) => {
            this.meshes = mesh;
        })
        ]);
    }

    public init(): void {
        const array: Array<number> = new Array<number>();

        this.meshes.forEach((mesh: Mesh) => {
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
            });
        });

        const vbo: VertexBufferObject = new VertexBufferObject(array);
        const vba: VertexArrayObject = new VertexArrayObject();

        const vertex: number = this.colorShaderProgram.getAttributeLocation('vertex');
        const color: number = this.colorShaderProgram.getAttributeLocation('vcolor');

        vba.bindVertexBufferToAttribute(vbo, vertex, 3, 6, 0);
        vba.bindVertexBufferToAttribute(vbo, color, 3, 6, 3);

        this.colorShaderProgram.use();
        this.colorShaderProgram.setModelViewMatrix(this.computeProjectionMatrix());

        vba.bind();
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const mv: mat4 = this.computeModelViewMatrix();
        // mat4.invert(this.normal, mv);
        // mat4.transpose(this.normal, this.normal);
        this.colorShaderProgram.setProjectionMatrix(mv);

        gl.drawArrays(gl.TRIANGLES, 0, this.meshes[0].faces.length * 3);
    }

    private computeProjectionMatrix(): mat4 {
        return mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, 640 / 360, 1.0, 40.0);
    }

    private computeModelViewMatrix(): mat4 {
        mat4.identity(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -2]);
        mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
        return mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, Date.now() * 0.0008);
    }

}
