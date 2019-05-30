import { mat4 } from 'gl-matrix';
import { Logger } from '../../core/Logger';
import { context as gl } from '../../core/RenderingContext';
import { FragmentShader } from '../../core/shader/FragmentShader';
import { ShaderProgram } from '../../core/shader/ShaderProgram';
import { VertexShader } from '../../core/shader/VertexShader';
import { ShaderUtils } from '../../core/utils/ShaderUtils';


export class GreenShaderProgram extends ShaderProgram {

    public static create(): Promise<GreenShaderProgram> {
        const startTime: number = Date.now();

        return Promise.all([
            ShaderUtils.loadShader(require('./assets/VertexShader.vs')),
            ShaderUtils.loadShader(require('./assets/FragmentShader.fs')),
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
