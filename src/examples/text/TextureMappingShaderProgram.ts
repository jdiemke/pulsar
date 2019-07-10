import { mat4, vec4 } from 'gl-matrix';
import { Logger } from '../../core/Logger';
import { context as gl } from '../../core/RenderingContext';
import { FragmentShader } from '../../core/shader/FragmentShader';
import { ShaderProgram } from '../../core/shader/ShaderProgram';
import { VertexShader } from '../../core/shader/VertexShader';
import { ShaderUtils } from '../../core/utils/ShaderUtils';

export class TextureMappingShaderProgram extends ShaderProgram {

    public static create(): Promise<TextureMappingShaderProgram> {
        const startTime: number = Date.now();

        return Promise.all([
            ShaderUtils.loadShader(require('./SphereMapping.vert')),
            ShaderUtils.loadShader(require('./SphereMapping.frag')),
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
    private colorLocation: WebGLUniformLocation;

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

    public setColor(color: vec4): void {
        gl.uniform4f(this.colorLocation, color[0], color[1], color[2], color[3]);
    }

    private setupUniforms(): void {
        this.modelViewMatrixLocation = gl.getUniformLocation(this.program, 'modelViewMatrix');
        this.projectionMatrixLocation = gl.getUniformLocation(this.program, 'projectionMatrix');
        this.colorLocation = gl.getUniformLocation(this.program, 'color');
    }

}
