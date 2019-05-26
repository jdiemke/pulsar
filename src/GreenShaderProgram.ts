import { mat4 } from 'gl-matrix';
import { logger, Logger } from './core/Logger';
import { context as gl } from './core/RenderingContext';
import { FragmentShader } from './shader/FragmentShader';
import { ShaderProgram } from './shader/ShaderProgram';
import { ShaderUtils } from './shader/ShaderUtils';
import { VertexShader } from './shader/VertexShader';

export class GreenShaderProgram extends ShaderProgram {

    public static create(): Promise<GreenShaderProgram> {
        const startTime: number = Date.now();

        return Promise.all([
            ShaderUtils.loadShader(require('./VertexShader.vs')),
            ShaderUtils.loadShader(require('./FragmentShader.fs')),
        ]).then((value: [string, string]) => {
            return new GreenShaderProgram(value[0], value[1]);
        }).finally(() => {
            GreenShaderProgram.logger.measure((Date.now() - startTime),
                'Finished creating shader program.'
            );
        });
    }

    private static logger: Logger = new Logger(GreenShaderProgram.name);

    private modelViewMatrixLocation: WebGLUniformLocation;
    private projectionMatrixLocation: WebGLUniformLocation;

    constructor(vertexShaderSource: string, fragmentShaderSource: string) {
        super(new VertexShader(vertexShaderSource), new FragmentShader(fragmentShaderSource));
        this.setupUniforms();
    }

    public setModelViewMatrix(modelViewMatrix: mat4): void {
        gl.uniformMatrix4fv(this.projectionMatrixLocation, false, modelViewMatrix);
    }

    public setProjectionMatrix(projectionMatrix: mat4): void {
        gl.uniformMatrix4fv(this.modelViewMatrixLocation, false, projectionMatrix);
    }

    private setupUniforms(): void {
        this.modelViewMatrixLocation = gl.getUniformLocation(this.program, 'modelViewMatrix');
        this.projectionMatrixLocation = gl.getUniformLocation(this.program, 'projectionMatrix');
    }

}
