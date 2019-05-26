import { AbstractScene } from "./AbstractScene";
import { ShaderProgram } from "./shader/ShaderProgram";
import { context as gl } from './core/RenderingContext';
import { ShaderUtils } from "./shader/ShaderUtils";

export class NewScene extends AbstractScene {

    private shaderProgram: ShaderProgram;

    public preload(): Promise<any> {
        return Promise.all([
            ShaderUtils.createProgram(
                require('./shader/VertexShader2.vs'),
                require('./shader/FragmentShader2.fs')
            ).then(
                shader => this.shaderProgram = shader
            )
        ]);
    }

    public init(): void {
        // https://webgl2fundamentals.org/
        this.shaderProgram.use();
        const aPositionLoc = gl.getAttribLocation(this.shaderProgram.getProgram(), "a_position");
        const uPointSizeLoc = gl.getUniformLocation(this.shaderProgram.getProgram(), "uPointSize");

        const vertexArray = new Float32Array([0, 0, 0]);
        const buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

        gl.uniform1f(uPointSizeLoc, 50.0);

        gl.enableVertexAttribArray(aPositionLoc);
        gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);

        gl.clearColor(0.0, 1.0, 0.0, 1.0);
    }

    public draw(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0 , 1);
    }


}
