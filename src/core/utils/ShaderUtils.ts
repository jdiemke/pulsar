import { Logger } from '../Logger';
import { FragmentShader } from '../shader/FragmentShader';
import { ShaderProgram } from '../shader/ShaderProgram';
import { VertexShader } from '../shader/VertexShader';

export class ShaderUtils {

    public static loadShader(filename: string): Promise<string> {
        const startTime: number = Date.now();

        return fetch(filename).then((response: Response) => {
            return response.text();
        }).finally(() => {
            ShaderUtils.logger.measure(
                (Date.now() - startTime),
                'Finished loading shader source: ' + filename
            );
        });
    }

    public static createProgram(vertex: string, fragment: string): Promise<ShaderProgram> {
        const startTime: number = Date.now();

        return Promise.all([
            ShaderUtils.loadShader(vertex),
            ShaderUtils.loadShader(fragment)
        ]).then((value: [string, string]) => {
            return new ShaderProgram(
                new VertexShader(value[0]),
                new FragmentShader(value[1])
            );
        }).finally(() => {
            ShaderUtils.logger.info(
                ShaderUtils.logger.padEnd('Finished creating shader program.', 20, ' '),
                'Duration: ' + (Date.now() - startTime) + ' ms'
            );
        });
    }

    private static logger: Logger = new Logger(ShaderUtils.name);

}
