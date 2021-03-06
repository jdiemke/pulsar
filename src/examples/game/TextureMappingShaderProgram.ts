import { mat4 } from 'gl-matrix';
import { Logger } from '../../core/Logger';
import { context as gl } from '../../core/RenderingContext';
import { FragmentShader } from '../../core/shader/FragmentShader';
import { ShaderProgram } from '../../core/shader/ShaderProgram';
import { VertexShader } from '../../core/shader/VertexShader';
import { ShaderUtils } from '../../core/utils/ShaderUtils';
import { Vector4f } from '../torus-knot/Vector4f';

export class TextureMappingShaderProgram extends ShaderProgram {

    public static create(): Promise<TextureMappingShaderProgram> {
        const startTime: number = Date.now();

        return Promise.all([
            ShaderUtils.loadShader(require('./shaders/SphereMapping.vert')),
            ShaderUtils.loadShader(require('./shaders/SphereMapping.frag')),
        ]).then((value: [string, string]) => {
            return new TextureMappingShaderProgram(value[0], value[1]);
        }).finally(() => {
            TextureMappingShaderProgram.logger.measure((Date.now() - startTime),
                'Finished creating shader program.'
            );
        });
    }

    private static logger: Logger = new Logger('TextureMappingShaderProgram');

    private modelViewMatrixLocation: WebGLUniformLocation;
    private projectionMatrixLocation: WebGLUniformLocation;
    private color: WebGLUniformLocation;

    constructor(vertexShaderSource: string, fragmentShaderSource: string) {
        super(new VertexShader(vertexShaderSource), new FragmentShader(fragmentShaderSource));
        this.setupUniforms();
    }

    public setModelViewMatrix2(modelViewMatrix: mat4): void {
        gl.uniformMatrix4fv(this.projectionMatrixLocation, false, modelViewMatrix);
    }

    public setModelViewMatrix(projectionMatrix: mat4): void {
        gl.uniformMatrix4fv(this.modelViewMatrixLocation, false, projectionMatrix);
    }

    public setColor(color: Vector4f): void {
        gl.uniform4fv(this.color, new Float32Array([color.x, color.y,color.z, 0]));
    }

    private setupUniforms(): void {
        this.modelViewMatrixLocation = gl.getUniformLocation(this.program, 'modelViewMatrix');
        this.projectionMatrixLocation = gl.getUniformLocation(this.program, 'projectionMatrix');
        this.color = gl.getUniformLocation(this.program, 'color');
    }

}
